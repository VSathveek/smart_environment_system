import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })
  try {
    const user = await prisma.user.findFirst({ where: { verifyToken: token } })
    if (!user) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null }
    })
    // Redirect back to app with success flag
    return NextResponse.redirect(new URL('/?verified=1', request.url))
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
