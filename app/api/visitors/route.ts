import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { carNumber, spot } = await request.json()
    
    await sql`
      INSERT INTO visitors (car_number, visit_date, spot)
      VALUES (${carNumber}, CURRENT_DATE, ${spot})
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DB Error:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}