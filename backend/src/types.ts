// Shared types for KDP Niche Finder backend

export interface Env {
  DB: D1Database;
  // From wrangler.jsonc vars
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  SESSION_SECRET?: string;
  APP_ORIGIN?: string;
  GOOGLE_REDIRECT_URI?: string;
  CREEM_API_KEY?: string;
  CREEM_WEBHOOK_SECRET?: string;
  CREEM_API_BASE?: string;
  CREEM_STARTER_PRICE_ID?: string;
  CREEM_PRO_PRICE_ID?: string;
  CREEM_CREDIT_PACK_ID?: string;
  FREE_DAILY_LIMIT?: string;
}

export interface Variables {
  user?: {
    id: string;
    email: string;
    name: string;
    plan: 'free' | 'starter' | 'pro';
    google_sub: string;
    creem_customer_id?: string;
  };
  sessionId?: string;
}

export interface NicheResult {
  niche: string;
  category: string;
  score: number;
  score_breakdown: {
    bsr: number;
    competition: number;
    seasonality: number;
    price: number;
    trend: number;
  };
  bsr_sweet_spot: string;
  competition_level: 'low' | 'medium' | 'high';
  price_range: string;
  trend: string;
  why_it_works: string[];
  risk_warnings: string[];
  titles: string[];
  cover_style: string;
  launch_plan: string[];
  disclaimer: string;
}

export interface AnalysisResponse {
  id: string;
  niches: NicheResult[];
  query: string;
  analyzed_at: string;
}
