import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: { select: { name: true, email: true } },
        members: { select: { name: true, email: true } },
        _count: { select: { messages: true } },
      },
    })
    return NextResponse.json(groups)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, issue, creatorId } = await request.json()
    const group = await prisma.group.create({
      data: {
        name,
        issue,
        creatorId,
      },
    })
    return NextResponse.json(group)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}