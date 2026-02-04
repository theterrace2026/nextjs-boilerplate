'use client'

export default function LogoutButton() {
  const handleLogout = () => {
    document.cookie = 'parking_auth=; path=/; max-age=0'
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      style={{ 
        color: 'white',
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '0'
      }}
    >
      로그아웃
    </button>
  )
}