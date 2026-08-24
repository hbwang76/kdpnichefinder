import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const WORKER_VERSION = 'kdpnichefinder-v1-20260816'

interface DbClient { prepare: (sql: string) => { all<T>(): Promise<{ results: T[] }> } }

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true }) as unknown as { env: { DB?: DbClient } }
    if (!env.DB) {
      return NextResponse.json({ status: 'degraded', db: false }, { status: 503 })
    }
    await env.DB.prepare('SELECT 1').all()
    return NextResponse.json({ status: 'ok', db: true, version: WORKER_VERSION })
  } catch {
    return NextResponse.json({ status: 'degraded', db: false }, { status: 503 })
  }
}
