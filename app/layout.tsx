import Link from 'next/link'
import LogoutButton from './components/LogoutButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <nav className="site-nav" style={{ 
          backgroundColor: '#333', 
          padding: '15px 40px',
          marginBottom: '0'
        }}>
          <div className="site-nav-inner" style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="site-nav-links" style={{ display: 'flex', gap: '20px' }}>
              <Link className="site-nav-link" href="/" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                주차현황
              </Link>
              <Link className="site-nav-link" href="/register" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                방문차량 등록
              </Link>
              <Link className="site-nav-link" href="/search" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                차량번호 검색
              </Link>
            </div>
            
            <LogoutButton />
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
