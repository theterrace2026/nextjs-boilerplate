import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'parking_admin'

function adminToken() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createHash('sha256').update(`parking-admin:${password}`).digest('hex')
}

export function isAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) return false

  const actual = Buffer.from(password)
  const expected = Buffer.from(configured)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function isAdmin() {
  const expected = adminToken()
  const actual = (await cookies()).get(ADMIN_COOKIE_NAME)?.value
  if (!expected || !actual) return false

  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export function getAdminToken() {
  return adminToken()
}
