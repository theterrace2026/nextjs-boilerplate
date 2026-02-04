'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Car {
  id: number
  car_number: string
  owner?: string
  spot: string
  visit_date?: string
  created_at: string
}

export default function ParkingStatus() {
  const router = useRouter()
  const [residents, setResidents] = useState<Car[]>([])
  const [visitors, setVisitors] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  // 인증 체크
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(c => c.trim().startsWith('parking_auth='))
      
      if (!authCookie) {
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  // 데이터 로드
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/parking-status')
      const data = await response.json()
      setResidents(data.residents || [])
      setVisitors(data.visitors || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, type: 'resident' | 'visitor') => {
    const confirmMsg = type === 'resident' 
      ? '입주자 차량을 삭제하시겠습니까?' 
      : '방문 차량을 삭제하시겠습니까?'
    
    if (!confirm(confirmMsg)) {
      return
    }

    try {
      const response = await fetch(`/api/residents?id=${id}&type=${type}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('삭제되었습니다')
        fetchData() // 데이터 새로고침
      } else {
        alert('삭제 실패')
      }
    } catch (error) {
      alert('오류가 발생했습니다')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>로딩 중...</p>
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
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>호실</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>비고</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', width: '100px' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((car) => (
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
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(car.id, 'resident')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    삭제
                  </button>
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
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>방문세대</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', width: '100px' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((car) => (
              <tr key={car.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.car_number}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.visit_date ? new Date(car.visit_date).toLocaleDateString('ko-KR') : '-'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  {car.spot}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(car.id, 'visitor')}
                    style={{
                      padding: '6px 12px',
                      fontSize: '14px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}