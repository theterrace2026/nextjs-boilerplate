require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function testConnection() {
  try {
    console.log('🔌 데이터베이스 연결 테스트 중...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '설정됨 ✓' : '설정 안됨 ✗');
    
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`SELECT current_database(), version()`;
    
    console.log('✅ 연결 성공!');
    console.log('데이터베이스:', result[0].current_database);
    console.log('PostgreSQL 버전:', result[0].version);
    
    // 테이블 목록 확인
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('\n📋 테이블 목록:');
    tables.forEach(t => console.log(' -', t.table_name));
    
  } catch (error) {
    console.error('❌ 연결 실패:', error.message);
  } finally {
    process.exit();
  }
}

testConnection();