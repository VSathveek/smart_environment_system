import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get('groupId')
  try {
    const messages = await prisma.message.findMany({
      where: groupId ? { groupId: parseInt(groupId) } : {},
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, groupId, userId } = await request.json()
    const message = await prisma.message.create({
      data: {
        content,
        groupId: parseInt(groupId),
        userId: parseInt(userId),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    })
    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}