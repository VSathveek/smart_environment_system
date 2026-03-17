import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    const hashedPassword = bcrypt.hashSync(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'public',
      },
    })
    const token = signToken({ id: user.id, email: user.email, role: user.role })
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token })
  } catch (error) {
    return NextResponse.json({ error: 'User already exists or invalid data' }, { status: 400 })
  }
}