import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <nav style={{ 
          backgroundColor: '#333', 
          padding: '15px 40px',
          marginBottom: '0'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'flex',
            gap: '20px'
          }}>
            <Link href="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              주차현황
            </Link>
            <Link href="/register" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              방문차량 등록
            </Link>
            <Link href="/search" style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              차량번호 검색
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}