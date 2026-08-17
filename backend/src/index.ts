/**
 * KDP Niche Finder — Cloudflare Workers Backend
 * Pure Workers fetch handler (no Hono — avoids framework type conflicts)
 * Auth: Google OAuth (PKCE)
 * Payments: Creem (subscriptions + one-time credit packs)
 * Data: D1
 */

export {};

// ─── SHA-256 helper ───────────────────────────────────────────────────────────

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(digest)));
}

export interface Env {
  DB: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  APP_ORIGIN?: string;
  GOOGLE_REDIRECT_URI?: string;
  CREEM_API_KEY?: string;
  CREEM_WEBHOOK_SECRET?: string;
  CREEM_API_BASE?: string;
  CREEM_STARTER_MONTHLY_PRICE_ID?: string;
  CREEM_STARTER_YEARLY_PRICE_ID?: string;
  CREEM_PRO_MONTHLY_PRICE_ID?: string;
  CREEM_PRO_YEARLY_PRICE_ID?: string;
  CREEM_CREDIT_MINI_PRICE_ID?: string;
  CREEM_CREDIT_STANDARD_PRICE_ID?: string;
  FREE_DAILY_LIMIT?: string;
}

const WORKER_VERSION = 'kdpnichefinder-v1-20260816';

// ─── Response helpers ─────────────────────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-worker-version': WORKER_VERSION,
    },
  });
}

function redirect(location: string, status = 302): Response {
  return new Response(null, { status, headers: { location } });
}

// ─── Cookie helpers ────────────────────────────────────────────────────────────

function cookie(req: Request, name: string): string | undefined {
  return req.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
}

function setCookie(name: string, value: string, maxAge: number, path = '/'): string {
  return `${name}=${value}; HttpOnly; SameSite=Lax; Path=${path}; Max-Age=${maxAge}`;
}

function clearCookie(name: string): string {
  return `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

// ─── ID generation ────────────────────────────────────────────────────────────

function generateId(prefix: string): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return prefix + Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

// ─── Time ─────────────────────────────────────────────────────────────────────

function now(): number {
  return Math.floor(Date.now() / 1000);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getSessionUser(db: D1Database, req: Request): Promise<{ id: string; email: string; name: string; plan: string; google_sub: string; creem_customer_id?: string } | null> {
  const sessionId = cookie(req, 'session_id');
  if (!sessionId) return null;

  const session = await db
    .prepare(
      'SELECT s.id, s.user_id, u.email, u.name, u.plan, u.google_sub, u.creem_customer_id FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > ?'
    )
    .bind(sessionId, now())
    .first();

  if (!session) return null;
  return session as any;
}

function requireAuth(user: { id: string } | null): Response | null {
  if (!user) return json({ error: 'Unauthorized' }, 401);
  return null;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function handleHealth(env: Env): Promise<Response> {
  try {
    await env.DB.prepare('SELECT 1').all();
    return json({ status: 'ok', db: true, version: WORKER_VERSION });
  } catch {
    return json({ status: 'degraded', db: false }, 503);
  }
}

async function handleAuthGoogleStart(req: Request, env: Env): Promise<Response> {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_REDIRECT_URI) {
    return json({ error: 'Google OAuth not configured' }, 503);
  }

  const state = generateId('st_');
  const verifier = generateId('vr_');
  const challenge = await sha256(verifier);

  // Store state in D1 for 10 min validity
  await env.DB
    .prepare('INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
    .bind(state, `oauth_state:${verifier}`, now() + 600)
    .run();

  const appOrigin = env.APP_ORIGIN || new URL(req.url).origin;
  const redirectTo = env.GOOGLE_REDIRECT_URI;

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectTo);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const cookies = [
    setCookie('oauth_state', state, 600),
    setCookie('oauth_verifier', verifier, 600),
  ];

  return new Response(null, {
    status: 302,
    headers: {
      location: url.toString(),
      'Set-Cookie': cookies.join(', '),
    },
  });
}

async function handleAuthCallback(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const appOrigin = env.APP_ORIGIN || new URL(req.url).origin;

  if (error) {
    return redirect(`${appOrigin}/login?error=${encodeURIComponent(error)}`, 302);
  }

  const storedState = cookie(req, 'oauth_state');
  const storedVerifier = cookie(req, 'oauth_verifier');

  if (!code || !state || !storedState || state !== storedState || !storedVerifier) {
    return json({ error: 'invalid_oauth_state' }, 400);
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID || '',
      client_secret: env.GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: env.GOOGLE_REDIRECT_URI || '',
      code_verifier: storedVerifier,
    }),
  });

  if (!tokenRes.ok) {
    return json({ error: 'google_token_exchange_failed' }, 502);
  }

  const tokens = await tokenRes.json() as { access_token: string };

  // Fetch Google user info
  const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userInfoRes.ok) {
    return json({ error: 'google_userinfo_failed' }, 502);
  }

  const googleUser = await userInfoRes.json() as { sub: string; email: string; name: string; picture: string };
  const ts = now();

  // Upsert user
  await env.DB
    .prepare(`
      INSERT INTO users (id, google_sub, email, name, profile_image_url, plan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'free', ?, ?)
      ON CONFLICT(google_sub) DO UPDATE SET
        email = excluded.email,
        name = excluded.name,
        profile_image_url = excluded.profile_image_url,
        updated_at = excluded.updated_at
    `)
    .bind(generateId('u_'), googleUser.sub, googleUser.email, googleUser.name, googleUser.picture, ts, ts)
    .run();

  const existingUser = await env.DB
    .prepare('SELECT id FROM users WHERE google_sub = ?')
    .bind(googleUser.sub)
    .first<{ id: string }>();

  const userId = existingUser!.id;

  // Create session (30 days)
  const sessionId = generateId('s_');
  const expiresAt = ts + 30 * 86400;
  await env.DB
    .prepare('INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
    .bind(sessionId, userId, ts, expiresAt)
    .run();

  const cookies = [
    setCookie('session_id', sessionId, 30 * 86400),
    `oauth_state=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
    `oauth_verifier=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`,
  ];

  return new Response(null, {
    status: 302,
    headers: {
      location: `${appOrigin}/account`,
      'Set-Cookie': cookies.join(', '),
    },
  });
}

async function handleLogout(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const authError = requireAuth(user);
  if (authError) return authError;

  const sessionId = cookie(req, 'session_id');
  if (sessionId) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'content-type': 'application/json',
      'Set-Cookie': clearCookie('session_id'),
    },
  });
}

async function handleMe(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  if (!user) return json({ authenticated: false });

  return json({
    authenticated: true,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
  });
}

// ─── Billing ─────────────────────────────────────────────────────────────────

async function handleCheckout(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const authError = requireAuth(user);
  if (authError) return authError;

  if (!env.CREEM_API_KEY) {
    return json({ error: 'Creem not configured' }, 503);
  }

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const plan = body.plan;
  const validPlans = [
    'starter_monthly', 'starter_yearly',
    'pro_monthly', 'pro_yearly',
    'credit_mini', 'credit_standard',
  ];
  if (!plan || !validPlans.includes(plan)) {
    return json({ error: 'invalid plan' }, 400);
  }

  const priceIdMap: Record<string, string | undefined> = {
    starter_monthly: env.CREEM_STARTER_MONTHLY_PRICE_ID,
    starter_yearly: env.CREEM_STARTER_YEARLY_PRICE_ID,
    pro_monthly: env.CREEM_PRO_MONTHLY_PRICE_ID,
    pro_yearly: env.CREEM_PRO_YEARLY_PRICE_ID,
    credit_mini: env.CREEM_CREDIT_MINI_PRICE_ID,
    credit_standard: env.CREEM_CREDIT_STANDARD_PRICE_ID,
  };
  const priceId = priceIdMap[plan];

  if (!priceId) {
    return json({ error: 'plan not configured' }, 503);
  }

  const appOrigin = env.APP_ORIGIN || new URL(req.url).origin;

  const checkoutRes = await fetch(`${env.CREEM_API_BASE || 'https://api.creem.io'}/v1/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CREEM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price_id: priceId,
      customer_email: user!.email,
      customer_id: user!.id,
      success_url: `${appOrigin}/account?checkout=success`,
      cancel_url: `${appOrigin}/pricing?checkout=cancelled`,
    }),
  });

  if (!checkoutRes.ok) {
    return json({ error: 'creem_checkout_failed' }, 502);
  }

  const checkout = await checkoutRes.json() as { url?: string; id?: string };
  return json({ checkout_url: checkout.url, checkout_id: checkout.id });
}

async function handleWebhook(req: Request, env: Env): Promise<Response> {
  const rawBody = await req.text();
  const signature = req.headers.get('x-creem-signature') ?? '';

  // Verify HMAC signature — mandatory: refuse webhooks when secret is not configured
  if (!env.CREEM_WEBHOOK_SECRET) {
    return json({ error: 'webhook not configured' }, 503);
  }
  {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.CREEM_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const hex = signature.replace(/^sha256=/, '');
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) return json({ error: 'invalid signature' }, 401);
    const sigBytes = new Uint8Array(hex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    const bodyBytes = encoder.encode(rawBody);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, bodyBytes);
    if (!valid) return json({ error: 'invalid signature' }, 401);
  }

  let event: { id?: string; type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const eventId = event.id ?? generateId('evt_');
  const eventType = event.type ?? 'unknown';

  // Idempotency
  const existing = await env.DB.prepare('SELECT id FROM webhook_events WHERE id = ?').bind(eventId).first();
  if (existing) return json({ ok: true, message: 'already processed' });

  const ts = now();
  const d = event.data ?? {};

  if (eventType === 'order.completed') {
    const customerId = d.customer_id as string;
    const orderId = d.order_id as string;
    const priceId = d.price_id as string;

    if (customerId && orderId && priceId === env.CREEM_CREDIT_MINI_PRICE_ID) {
      const credits = 15;
      await env.DB
        .prepare('INSERT INTO credit_packs (id, user_id, creem_order_id, credits, status, purchased_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(generateId('cp_'), customerId, orderId, credits, 'active', ts)
        .run();

      const balanceRow = await env.DB
        .prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?')
        .bind(customerId)
        .first<{ balance: number }>();

      await env.DB
        .prepare('INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(generateId('cl_'), customerId, credits, (balanceRow?.balance ?? 0) + credits, 'purchase', orderId, ts)
        .run();
    } else if (customerId && orderId && priceId === env.CREEM_CREDIT_STANDARD_PRICE_ID) {
      const credits = 35;
      await env.DB
        .prepare('INSERT INTO credit_packs (id, user_id, creem_order_id, credits, status, purchased_at) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(generateId('cp_'), customerId, orderId, credits, 'active', ts)
        .run();

      const balanceRow = await env.DB
        .prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?')
        .bind(customerId)
        .first<{ balance: number }>();

      await env.DB
        .prepare('INSERT INTO credit_ledger (id, user_id, amount, balance_after, reason, reference_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(generateId('cl_'), customerId, credits, (balanceRow?.balance ?? 0) + credits, 'purchase', orderId, ts)
        .run();
    }
  } else if (eventType === 'subscription.created' || eventType === 'subscription.updated') {
    const customerId = d.customer_id as string;
    const subscriptionId = d.subscription_id as string;
    const planStr = ((d.plan as string) ?? '').toLowerCase();
    const plan = planStr.includes('pro') ? 'pro' : 'starter';
    const status = (d.status as string) ?? 'active';
    const periodEnd = (d.current_period_end as number) ?? ts;

    if (customerId && subscriptionId) {
      await env.DB
        .prepare(`
          INSERT INTO subscriptions (id, user_id, plan, creem_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
          ON CONFLICT(creem_subscription_id) DO UPDATE SET
            status = excluded.status,
            plan = excluded.plan,
            current_period_end = excluded.current_period_end,
            updated_at = excluded.updated_at
        `)
        .bind(generateId('sub_'), customerId, plan, subscriptionId, status, ts, periodEnd, ts, ts)
        .run();

      if (status === 'active') {
        await env.DB.prepare('UPDATE users SET plan = ?, updated_at = ? WHERE id = ?').bind(plan, ts, customerId).run();
      }
    }
  } else if (eventType === 'subscription.cancelled') {
    const subscriptionId = d.subscription_id as string;
    if (subscriptionId) {
      await env.DB
        .prepare('UPDATE subscriptions SET status = ?, cancel_at_period_end = 1, updated_at = ? WHERE creem_subscription_id = ?')
        .bind('cancelled', ts, subscriptionId)
        .run();
    }
  }

  await env.DB
    .prepare('INSERT INTO webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
    .bind(eventId, eventType, ts)
    .run();

  return json({ ok: true });
}

// ─── Credits ─────────────────────────────────────────────────────────────────

async function handleCreditsBalance(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const authError = requireAuth(user);
  if (authError) return authError;

  const row = await env.DB
    .prepare('SELECT COALESCE(SUM(amount), 0) as balance FROM credit_ledger WHERE user_id = ?')
    .bind(user!.id)
    .first<{ balance: number }>();

  return json({ balance: row?.balance ?? 0 });
}

// ─── Analyses ────────────────────────────────────────────────────────────────

async function handleCreateAnalysis(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const ip = req.headers.get('cf-connecting-ip') ?? 'anonymous';
  const ts = now();
  const tier = user?.plan ?? 'free';

  let body: { query?: string; book_type?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON' }, 400);
  }

  const query = body.query?.trim();
  if (!query) {
    return json({ error: 'query is required' }, 400);
  }

  // Check free tier limit (1/day): logged-in free users by user_id, anonymous by IP marker
  if (!user || tier === 'free') {
    const dayStart = ts - (ts % 86400);
    const existing = user
      ? await env.DB
          .prepare('SELECT id FROM analyses WHERE user_id = ? AND created_at >= ? LIMIT 1')
          .bind(user.id, dayStart)
          .first()
      : await env.DB
          .prepare('SELECT id FROM analyses WHERE query = ? AND created_at >= ? AND tier = ?')
          .bind(`free_ip_${ip}_${dayStart}`, dayStart, 'free')
          .first();
    if (existing) {
      return json({
        error: 'Free daily limit reached. Login to check your plan or purchase credits.',
        code: 'FREE_LIMIT_REACHED',
      }, 429);
    }
  }

  // TODO: Replace with real OpenAI/Claude niche analysis call
  // const analysis = await callNicheAnalysisAI(query, body.book_type);
  const analysis = {
    niches: [
      {
        niche: query,
        category: body.book_type ?? 'general / low-content',
        score: 72,
        score_breakdown: { bsr: 18, competition: 16, seasonality: 12, price: 14, trend: 12 },
        bsr_sweet_spot: '10,000–40,000',
        competition_level: 'medium',
        price_range: '$9.99–$12.99',
        trend: 'rising (+8% 12m)',
        why_it_works: [
          'Growing demand in KDP community — niche keywords show steady search interest',
          'Moderate competition means an opportunity gap for well-optimized listings',
        ],
        risk_warnings: [
          'Seasonal variation may affect Q4 sales — plan your launch timing',
          'Competition is increasing — differentiate with unique angle or cover',
        ],
        titles: [
          `Ultimate ${query} Guide: The Complete Step-by-Step System`,
          `The ${query} Handbook: From Idea to Profitable KDP Book in 30 Days`,
          `${query} Mastery: A Proven Roadmap for Self-Publishers`,
        ],
        cover_style: 'Bold sans-serif title on solid background with high-contrast accent color. Professional but approachable. Avoid stock photos — use geometric shapes or illustrated elements instead.',
        launch_plan: [
          'Week 1-2: Conduct keyword research using Helium 10 or Publisher Rocket. Optimize book metadata (title, subtitle, 7 backend keywords). Design cover with clear value proposition.',
          'Week 3-4: Launch with 2-3 day Countdown Deal at $0.99–$2.99. Run Facebook ads ($5-10/day) targeting niche interests. Email your existing reader list.',
          'Week 5+: Implement follow-up email sequence asking for reviews. Consider second book in the series or adjacent niche.',
        ],
        disclaimer: 'Estimates based on publicly available data. Actual results vary. This tool is not affiliated with Amazon.',
      },
    ],
    query,
    analyzed_at: new Date().toISOString(),
  };

  const analysisId = generateId('a_');
  const storedQuery = user ? query : `free_ip_${ip}_${ts - (ts % 86400)}`;

  await env.DB
    .prepare('INSERT INTO analyses (id, user_id, query, result, tier, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(analysisId, user?.id ?? null, storedQuery, JSON.stringify(analysis), tier, ts)
    .run();

  return json({ id: analysisId, ...analysis });
}

async function handleListAnalyses(req: Request, env: Env): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const authError = requireAuth(user);
  if (authError) return authError;

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '30'), 100);

  const { results } = await env.DB
    .prepare('SELECT id, query, tier, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
    .bind(user!.id, limit)
    .all();

  return json({ analyses: results });
}

async function handleGetAnalysis(req: Request, env: Env, id: string): Promise<Response> {
  const user = await getSessionUser(env.DB, req);
  const authError = requireAuth(user);
  if (authError) return authError;

  const analysis = await env.DB
    .prepare('SELECT * FROM analyses WHERE id = ? AND user_id = ?')
    .bind(id, user!.id)
    .first();

  if (!analysis) return json({ error: 'not found' }, 404);

  return json({ ...analysis, result: JSON.parse((analysis as any).result) });
}

// ─── Main fetch handler ──────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      // Route matching
      if (path === '/api/health' && request.method === 'GET') {
        return handleHealth(env);
      }

      // Auth routes
      if (path === '/api/auth/login' && request.method === 'GET') {
        return handleAuthGoogleStart(request, env);
      }
      if (path === '/api/auth/callback/google' && request.method === 'GET') {
        return handleAuthCallback(request, env);
      }
      if (path === '/api/auth/logout' && request.method === 'POST') {
        return handleLogout(request, env);
      }
      if (path === '/api/auth/me' && request.method === 'GET') {
        return handleMe(request, env);
      }

      // Billing
      if (path === '/api/billing/checkout' && request.method === 'POST') {
        return handleCheckout(request, env);
      }
      if (path === '/api/billing/webhook' && request.method === 'POST') {
        return handleWebhook(request, env);
      }

      // Credits
      if (path === '/api/credits/balance' && request.method === 'GET') {
        return handleCreditsBalance(request, env);
      }

      // Analyses
      if (path === '/api/analyses' && request.method === 'POST') {
        return handleCreateAnalysis(request, env);
      }
      if (path === '/api/analyses' && request.method === 'GET') {
        return handleListAnalyses(request, env);
      }
      if (path.startsWith('/api/analyses/') && request.method === 'GET') {
        const id = path.split('/').pop()!;
        return handleGetAnalysis(request, env, id);
      }

      return json({ error: 'not found' }, 404);
    } catch (err) {
      console.error('Unhandled error:', err);
      return json({ error: 'internal server error' }, 500);
    }
  },
};
