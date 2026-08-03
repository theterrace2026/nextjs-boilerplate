import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

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
    
    const residents = await sql`
      SELECT r.*,
        EXISTS (
          SELECT 1 FROM deletion_requests d
          WHERE d.target_type = 'resident' AND d.target_id = r.id AND d.status = 'pending'
        ) AS deletion_requested
      FROM residents r ORDER BY r.id
    `
    const visitors = await sql`
      SELECT v.*,
        EXISTS (
          SELECT 1 FROM deletion_requests d
          WHERE d.target_type = 'visitor' AND d.target_id = v.id AND d.status = 'pending'
        ) AS deletion_requested
      FROM visitors v ORDER BY v.id DESC
    `
    
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
