import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const raw = (request as NextRequest & { env?: Record<string, unknown> }).env
  return NextResponse.json({
    envKeys: raw ? Object.keys(raw) : [],
    hasDB: !!raw?.DB,
    dbType: raw?.DB ? typeof raw.DB : 'undefined',
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? 'MISSING',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? 'MISSING',
    nextPublic: process.env.NEXT_PUBLIC_APP_ORIGIN ?? 'MISSING',
  })
}
