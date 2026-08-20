// Shared helpers for KDP Niche Finder API routes (Next.js App Router on Cloudflare)

export function generateId(prefix: string): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return prefix + Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

export function now(): number {
  return Math.floor(Date.now() / 1000)
}

export function cookie(req: Request, name: string): string | undefined {
  return req.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1]
}

export function setCookie(name: string, value: string, maxAge: number, path = '/'): string {
  return `${name}=${value}; HttpOnly; SameSite=Lax; Path=${path}; Max-Age=${maxAge}`
}

export function clearCookie(name: string): string {
  return `${name}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  // PKCE requires base64url encoding (no + / =)
  // Use manual encoding to avoid Terser eliminating chained .replace() calls
  const bytes = new Uint8Array(digest)
  const base64 = btoa(String.fromCharCode(...bytes))
  let result = ''
  for (let i = 0; i < base64.length; i++) {
    const c = base64.charAt(i)
    if (c === '+') result += '-'
    else if (c === '/') result += '_'
    else if (c !== '=') result += c
  }
  return result
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}

export function redirect(location: string, status = 302): Response {
  return new Response(null, { status, headers: { location } })
}
