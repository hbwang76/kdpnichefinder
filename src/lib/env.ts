export interface Env {
  DB: { prepare: (sql: string) => { bind: (...vals: unknown[]) => { first<T>(): Promise<T | null>; run(): Promise<unknown> } } }
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  SESSION_SECRET: string
  APP_ORIGIN: string
  GOOGLE_REDIRECT_URI: string
  CREEM_API_KEY: string
  CREEM_WEBHOOK_SECRET: string
  CREEM_API_BASE: string
  CREEM_STARTER_MONTHLY_PRICE_ID: string
  CREEM_STARTER_YEARLY_PRICE_ID: string
  CREEM_PRO_MONTHLY_PRICE_ID: string
  CREEM_PRO_YEARLY_PRICE_ID: string
  CREEM_CREDIT_MINI_PRICE_ID: string
  CREEM_CREDIT_STANDARD_PRICE_ID: string
  FREE_DAILY_LIMIT: string
}
