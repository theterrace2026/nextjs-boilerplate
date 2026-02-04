import { neon } from '@neondatabase/serverless'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const revalidate = 0

// 인증 체크 함수
async function checkAuth() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('parking_auth')
  
  if (!auth) {
    redirect('/login')
  }
}

async function getResidents() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    return []
  }
  
  const sql = neon(databaseUrl)
  const rows = await sql`SELECT * FROM residents ORDER BY id`
  return rows
}

async function getVisitors() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    return []
  }
  
  const sql = neon(databaseUrl)
  const rows = await sql`SELECT * FROM visitors ORDER BY id DESC`
  return rows
}

export default async function ParkingStatus() {
  // 인증 체크
  await checkAuth()
  
  const residents = await getResidents()
  const visitors = await getVisitors()

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>주차 현황</h1>
      
      {/* 입주자 차량 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>
          입주자 차량 ({residents.length}대)
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>차량번호</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>소유자</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>주차위치</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((car: any) => (
              <tr key={car.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.car_number}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.owner}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.spot}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 방문 차량 */}
      <section>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>
          방문 차량 ({visitors.length}대)
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>차량번호</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>방문일</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>주차위치</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((car: any) => (
              <tr key={car.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.car_number}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {new Date(car.visit_date).toLocaleDateString('ko-KR')}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.spot}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}