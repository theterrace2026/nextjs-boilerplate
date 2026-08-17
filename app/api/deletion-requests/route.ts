import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/adminAuth'

type TargetType = 'resident' | 'visitor'

function isTargetType(value: unknown): value is TargetType {
  return value === 'resident' || value === 'visitor'
}

async function ensureTable(sql: NeonQueryFunction<false, false>) {
  await sql`
    CREATE TABLE IF NOT EXISTS deletion_requests (
      id SERIAL PRIMARY KEY,
      target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('resident', 'visitor')),
      target_id INTEGER NOT NULL,
      status VARCHAR(10) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
      requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP,
      UNIQUE (target_type, target_id)
    )
  `
}

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { id, type } = await request.json()
    const targetId = Number(id)

    if (!Number.isInteger(targetId) || targetId <= 0 || !isTargetType(type)) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    await ensureTable(sql)
    const target = type === 'resident'
      ? await sql`SELECT id FROM residents WHERE id = ${targetId}`
      : await sql`SELECT id FROM visitors WHERE id = ${targetId}`

    if (target.length === 0) {
      return NextResponse.json({ error: '차량을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (type === 'visitor') {
      await sql`DELETE FROM visitors WHERE id = ${targetId}`
      return NextResponse.json({ success: true, immediate: true })
    }

    await sql`
      INSERT INTO deletion_requests (target_type, target_id)
      VALUES (${type}, ${targetId})
      ON CONFLICT (target_type, target_id) DO UPDATE SET
        status = 'pending', requested_at = CURRENT_TIMESTAMP, reviewed_at = NULL
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Deletion request error:', error)
    return NextResponse.json({ error: '삭제 요청에 실패했습니다.' }, { status: 500 })
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    await ensureTable(sql)
    const requests = await sql`
      SELECT d.id, d.target_type, d.target_id, d.requested_at,
        COALESCE(r.car_number, v.car_number) AS car_number,
        COALESCE(r.owner, v.spot) AS description
      FROM deletion_requests d
      LEFT JOIN residents r ON d.target_type = 'resident' AND d.target_id = r.id
      LEFT JOIN visitors v ON d.target_type = 'visitor' AND d.target_id = v.id
      WHERE d.status = 'pending'
      ORDER BY d.requested_at ASC
    `
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Fetch deletion requests error:', error)
    return NextResponse.json({ error: '삭제 요청 조회에 실패했습니다.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: '관리자 인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { requestId, action } = await request.json()
    const id = Number(requestId)
    if (!Number.isInteger(id) || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
    }

    await ensureTable(sql)
    const rows = await sql`
      SELECT target_type, target_id FROM deletion_requests
      WHERE id = ${id} AND status = 'pending'
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: '처리할 요청이 없습니다.' }, { status: 404 })
    }

    if (action === 'approve') {
      const target = rows[0]
      if (target.target_type === 'resident') {
        await sql`DELETE FROM residents WHERE id = ${target.target_id}`
      } else {
        await sql`DELETE FROM visitors WHERE id = ${target.target_id}`
      }
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    await sql`
      UPDATE deletion_requests
      SET status = ${status}, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND status = 'pending'
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review deletion request error:', error)
    return NextResponse.json({ error: '요청 처리에 실패했습니다.' }, { status: 500 })
  }
}
