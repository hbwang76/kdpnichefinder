import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0].toLowerCase()

  // Keep one canonical host so Google does not index duplicate www URLs.
  if (hostname === 'www.kdpnichefinder.net') {
    const url = request.nextUrl.clone()
    url.hostname = 'kdpnichefinder.net'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
