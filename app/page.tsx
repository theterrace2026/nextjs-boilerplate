'use client'

export default function ParkingStatus() {
  // 임시 데이터
  const residents = [
    { id: 1, carNumber: '12가3456', owner: '김철수', spot: '1F' },
    { id: 2, carNumber: '34나5678', owner: '이영희', spot: '1F' },
    { id: 3, carNumber: '56다7890', owner: '박민수', spot: '1F' },
  ]

  const visitors = [
    { id: 1, carNumber: '78라1234', visitDate: '2024-02-04', spot: '1F' },
    { id: 2, carNumber: '90마5678', visitDate: '2024-02-04', spot: '1F' },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>주차 현황</h1>
      
      {/* 입주자 차량 */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>입주자 차량</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>차량번호</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>소유자</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>주차위치</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((car) => (
              <tr key={car.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.carNumber}
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
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>방문 차량</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>차량번호</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>방문일</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>주차위치</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((car) => (
              <tr key={car.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.carNumber}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.visitDate}
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