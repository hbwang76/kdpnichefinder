import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }
    // TODO: implement niche analysis logic
    return NextResponse.json({
      niches: [
        { id: 1, name: query, score: 75, competition: 'MED', bsr: '15k-40k' }
      ]
    });
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
