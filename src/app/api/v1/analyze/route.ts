import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let body: { query?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'body must be valid JSON' }, { status: 400 })
  }

  const query = body.query?.trim()
  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  // TODO: implement niche analysis logic
  return NextResponse.json({
    niches: [
      { id: 1, name: query, score: 75, competition: 'MED', bsr: '15k-40k' }
    ]
  })
}
