import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const fundraisers = await prisma.fundraiser.findMany({
      include: {
        creator: { select: { name: true, email: true } },
      },
    })
    return NextResponse.json(fundraisers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fundraisers' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cause, description, goal, creatorId } = await request.json()
    const fundraiser = await prisma.fundraiser.create({
      data: {
        cause,
        description,
        goal: parseFloat(goal),
        creatorId,
      },
    })
    return NextResponse.json(fundraiser)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fundraiser' }, { status: 500 })
  }
}