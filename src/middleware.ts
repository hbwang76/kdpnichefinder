import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware removed — API routes are now handled by Next.js directly
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
