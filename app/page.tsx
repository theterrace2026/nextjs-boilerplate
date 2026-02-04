import { neon } from '@neondatabase/serverless'

export const revalidate = 0

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
  const residents = await getResidents()
  const visitors = await getVisitors()

  if (!process.env.DATABASE_URL) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>⚠️ 데이터베이스 연결 오류</h1>
        <p>환경변수가 설정되지 않았습니다.</p>
      </div>
    )
  }

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