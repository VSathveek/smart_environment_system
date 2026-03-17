import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { groupId, userId } = await request.json()
    const group = await prisma.group.update({
      where: { id: parseInt(groupId) },
      data: {
        members: { connect: { id: parseInt(userId) } },
      },
    })
    return NextResponse.json(group)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
  }
}