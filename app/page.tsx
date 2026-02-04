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

type SortOrder = 'asc' | 'desc'

const thTdStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'center'
}

export default function ParkingStatus() {
  const router = useRouter()

  const [residents, setResidents] = useState<Car[]>([])
  const [visitors, setVisitors] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  const [residentSort, setResidentSort] = useState<{
    key: keyof Car
    order: SortOrder
  } | null>(null)

  const [visitorSort, setVisitorSort] = useState<{
    key: keyof Car
    order: SortOrder
  } | null>(null)

  useEffect(() => {
    const auth = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('parking_auth='))

    if (!auth) router.push('/login')
  }, [router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/parking-status')
      const data = await res.json()
      setResidents(data.residents || [])
      setVisitors(data.visitors || [])
    } finally {
      setLoading(false)
    }
  }

  const sortData = <T,>(
    data: T[],
    key: keyof T,
    order: SortOrder
  ) =>
    [...data].sort((a: any, b: any) => {
      if (!a[key]) return 1
      if (!b[key]) return -1
      return order === 'asc'
        ? a[key] > b[key] ? 1 : -1
        : a[key] < b[key] ? 1 : -1
    })

  const sortedResidents = residentSort
    ? sortData(residents, residentSort.key, residentSort.order)
    : residents

  const sortedVisitors = visitorSort
    ? sortData(visitors, visitorSort.key, visitorSort.order)
    : visitors

  const toggleSort = (
    current: typeof residentSort,
    setter: Function,
    key: keyof Car
  ) => {
    setter(
      current?.key === key
        ? { key, order: current.order === 'asc' ? 'desc' : 'asc' }
        : { key, order: 'asc' }
    )
  }

  const sortIcon = (
    current: typeof residentSort,
    key: keyof Car
  ) => {
    if (current?.key !== key) return '⇅'
    return current.order === 'asc' ? '▲' : '▼'
  }

  if (loading) return <div style={{ padding: 40 }}>로딩 중...</div>

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, marginBottom: 30 }}>주차 현황</h1>

      {/* 입주자 차량 */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, marginBottom: 15 }}>
          입주자 차량 ({residents.length}대)
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                ['car_number', '차량번호'],
                ['owner', '호실'],
                ['spot', '비고']
              ].map(([key, label]) => (
                <th
                  key={key}
                  style={{ ...thTdStyle, cursor: 'pointer' }}
                  onClick={() =>
                    toggleSort(
                      residentSort,
                      setResidentSort,
                      key as keyof Car
                    )
                  }
                >
                  {label}{' '}
                  <span style={{ fontSize: 12, marginLeft: 4 }}>
                    {sortIcon(residentSort, key as keyof Car)}
                  </span>
                </th>
              ))}
              <th style={thTdStyle}>작업</th>
            </tr>
          </thead>

          <tbody>
            {sortedResidents.map(car => (
              <tr key={car.id}>
                <td style={thTdStyle}>{car.car_number}</td>
                <td style={thTdStyle}>{car.owner}</td>
                <td style={thTdStyle}>{car.spot}</td>
                <td style={thTdStyle}>
                  <button>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 방문 차량 */}
      <section>
        <h2 style={{ fontSize: 24, marginBottom: 15 }}>
          방문 차량 ({visitors.length}대)
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {[
                ['car_number', '차량번호'],
                ['visit_date', '방문일'],
                ['spot', '방문세대']
              ].map(([key, label]) => (
                <th
                  key={key}
                  style={{ ...thTdStyle, cursor: 'pointer' }}
                  onClick={() =>
                    toggleSort(
                      visitorSort,
                      setVisitorSort,
                      key as keyof Car
                    )
                  }
                >
                  {label}{' '}
                  <span style={{ fontSize: 12, marginLeft: 4 }}>
                    {sortIcon(visitorSort, key as keyof Car)}
                  </span>
                </th>
              ))}
              <th style={thTdStyle}>작업</th>
            </tr>
          </thead>

          <tbody>
            {sortedVisitors.map(car => (
              <tr key={car.id}>
                <td style={thTdStyle}>{car.car_number}</td>
                <td style={thTdStyle}>
                  {car.visit_date
                    ? new Date(car.visit_date).toLocaleDateString('ko-KR')
                    : '-'}
                </td>
                <td style={thTdStyle}>{car.spot}</td>
                <td style={thTdStyle}>
                  <button>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
