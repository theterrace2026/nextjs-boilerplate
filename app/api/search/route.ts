import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const carNumber = searchParams.get('carNumber')

  if (!carNumber) {
    return NextResponse.json({ found: false })
  }

  try {
    // 입주자 차량 검색
    const residentResult = await sql`
      SELECT *, '입주자' as type 
      FROM residents 
      WHERE car_number LIKE ${`%${carNumber}%`}
      LIMIT 1
    `

    if (residentResult.rows.length > 0) {
      return NextResponse.json({ 
        found: true, 
        car: residentResult.rows[0] 
      })
    }

    // 방문 차량 검색
    const visitorResult = await sql`
      SELECT *, '방문' as type 
      FROM visitors 
      WHERE car_number LIKE ${`%${carNumber}%`}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (visitorResult.rows.length > 0) {
      return NextResponse.json({ 
        found: true, 
        car: visitorResult.rows[0] 
      })
    }

    return NextResponse.json({ found: false })
  } catch (error) {
    console.error('Search Error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}