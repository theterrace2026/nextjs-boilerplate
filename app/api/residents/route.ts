import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    
    if (!id || !type) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    if (type === 'resident') {
      await sql`DELETE FROM residents WHERE id = ${id}`
    } else if (type === 'visitor') {
      await sql`DELETE FROM visitors WHERE id = ${id}`
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}