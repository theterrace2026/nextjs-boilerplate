import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  void request
  return NextResponse.json(
    { error: '직접 삭제는 허용되지 않습니다. 삭제 요청 API를 이용하세요.' },
    { status: 405 }
  )
}
