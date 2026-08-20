import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? 'MISSING',
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI ?? 'MISSING',
    hasDB: !!(request as NextRequest & { env?: { DB?: unknown } }).env?.DB,
    dbType: typeof (request as NextRequest & { env?: { DB?: unknown } }).env?.DB,
  })
}
