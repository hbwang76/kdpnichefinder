import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ['/api/:path*'],
}

const API_BASE = 'https://kdpnichefinder.hbwang2076.workers.dev'

export function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const apiPath = url.pathname.replace(/^\/api/, '/api')
  const forwardUrl = `${API_BASE}${apiPath}${url.search}`

  const headers: Record<string, string> = {
    'X-Forwarded-Host': url.host,
    'X-Forwarded-Proto': url.protocol.replace(':', ''),
  }

  const cookie = request.headers.get('cookie')
  if (cookie) headers['cookie'] = cookie

  const authHeader = request.headers.get('authorization')
  if (authHeader) headers['authorization'] = authHeader

  const contentType = request.headers.get('content-type')
  if (contentType) headers['content-type'] = contentType

  const newReq = new Request(forwardUrl, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().text() : undefined,
    redirect: 'manual',
  })

  try {
    const response = await fetch(newReq)

    const newHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        newHeaders.set(key, value)
      }
    })
    newHeaders.set('Access-Control-Allow-Origin', url.origin)

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    })
  } catch {
    return NextResponse.json({ error: 'API proxy error' }, { status: 502 })
  }
}
