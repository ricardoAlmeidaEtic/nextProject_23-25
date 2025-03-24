import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  return NextResponse.json({ loggedIn: !!sessionCookie?.value })
}