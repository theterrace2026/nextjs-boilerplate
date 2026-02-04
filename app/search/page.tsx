'use client'

import { useState } from 'react'

export default function SearchCar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)

  // 임시 데이터 (나중에 실제 DB에서 가져오기)
  const allCars = [
    { carNumber: '12가3456', owner: '김철수', spot: 'A-101', type: '입주자' },
    { carNumber: '34나5678', owner: '이영희', spot: 'A-102', type: '입주자' },
    { carNumber: '56다7890', owner: '박민수', spot: 'B-201', type: '입주자' },
    { carNumber: '78라1234', visitDate: '2024-02-04', spot: 'V-01', type: '방문' },
    { carNumber: '90마5678', visitDate: '2024-02-04', spot: 'V-02', type: '방문' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = allCars.find(car => 
      car.carNumber.includes(searchTerm)
    )
    
    setSearchResult(result || 'notfound')
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>차량번호 검색</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="차량번호를 입력하세요"
            required
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            검색
          </button>
        </div>
      </form>

      {/* 검색 결과 */}
      {searchResult && (
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: searchResult === 'notfound' ? '#fff3cd' : '#d4edda'
        }}>
          {searchResult === 'notfound' ? (
            <p style={{ margin: 0, color: '#856404' }}>
              해당 차량번호를 찾을 수 없습니다.
            </p>
          ) : (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>검색 결과</h3>
              <p><strong>차량번호:</strong> {searchResult.carNumber}</p>
              <p><strong>구분:</strong> {searchResult.type}</p>
              {searchResult.type === '입주자' ? (
                <p><strong>소유자:</strong> {searchResult.owner}</p>
              ) : (
                <p><strong>방문일:</strong> {searchResult.visitDate}</p>
              )}
              <p><strong>주차위치:</strong> {searchResult.spot}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}