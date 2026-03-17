import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { campaignId, userId } = await request.json()
    const campaign = await prisma.campaign.update({
      where: { id: parseInt(campaignId) },
      data: {
        participants: { connect: { id: parseInt(userId) } },
      },
    })
    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join campaign' }, { status: 500 })
  }
}