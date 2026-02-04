import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const residents = await sql`SELECT * FROM residents ORDER BY id`
    const visitors = await sql`SELECT * FROM visitors ORDER BY id DESC`
    
    return NextResponse.json({ 
      residents,
      visitors 
    })
  } catch (error) {
    console.error('Fetch Error:', error)
    return NextResponse.json({ 
      residents: [], 
      visitors: [] 
    }, { status: 500 })
  }
}