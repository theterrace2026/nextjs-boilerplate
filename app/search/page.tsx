'use client'

import { useState } from 'react'

export default function SearchCar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/search?carNumber=${searchTerm}`)
      const data = await response.json()
      
      setSearchResult(data.found ? data.car : 'notfound')
    } catch (error) {
      alert('검색 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
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
            disabled={loading}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: loading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '검색중...' : '검색'}
          </button>
        </div>
      </form>

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
              <p><strong>차량번호:</strong> {searchResult.car_number}</p>
              <p><strong>구분:</strong> {searchResult.type}</p>
              {searchResult.type === '입주자' && (
                <p><strong>소유자:</strong> {searchResult.owner}</p>
              )}
              {searchResult.type === '방문' && (
                <p><strong>방문일:</strong> {new Date(searchResult.visit_date).toLocaleDateString('ko-KR')}</p>
              )}
              <p><strong>주차위치:</strong> {searchResult.spot}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}