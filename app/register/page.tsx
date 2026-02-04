'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterVisitor() {
  const router = useRouter()
  const [carNumber, setCarNumber] = useState('')
  const [spot, setSpot] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carNumber, spot })
      })

      if (response.ok) {
        alert('등록되었습니다!')
        router.push('/')
      } else {
        alert('등록 실패')
      }
    } catch (error) {
      alert('오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '30px' }}>방문차량 등록</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            차량번호
          </label>
          <input
            type="text"
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            placeholder="예: 12가3456"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            주차위치
          </label>
          <input
            type="text"
            value={spot}
            onChange={(e) => setSpot(e.target.value)}
            placeholder="예: V-01"
            required
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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
            {loading ? '등록중...' : '등록하기'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}