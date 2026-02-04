require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function setupDatabase() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('📝 테이블 생성 중...');
    
    // 입주자 차량 테이블
    await sql`
      CREATE TABLE IF NOT EXISTS residents (
        id SERIAL PRIMARY KEY,
        car_number VARCHAR(20) NOT NULL UNIQUE,
        owner VARCHAR(50) NOT NULL,
        spot VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 방문 차량 테이블
    await sql`
      CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        car_number VARCHAR(20) NOT NULL,
        visit_date DATE NOT NULL,
        spot VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('📊 샘플 데이터 추가 중...');
    
    // 샘플 데이터 입력
    await sql`
      INSERT INTO residents (car_number, owner, spot) 
      VALUES 
        ('12가3456', '김철수', 'A-101'),
        ('34나5678', '이영희', 'A-102'),
        ('56다7890', '박민수', 'B-201')
      ON CONFLICT (car_number) DO NOTHING
    `;

    await sql`
      INSERT INTO visitors (car_number, visit_date, spot) 
      VALUES 
        ('78라1234', CURRENT_DATE, 'V-01'),
        ('90마5678', CURRENT_DATE, 'V-02')
    `;

    console.log('✅ 데이터베이스 설정 완료!');
  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    process.exit();
  }
}

setupDatabase();