import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { fundraiserId, userId, amount, method } = await request.json()
    const donation = await prisma.donation.create({
      data: { fundraiserId: parseInt(fundraiserId), userId: parseInt(userId), amount: parseFloat(amount), method }
    })
    // Update raised amount
    await prisma.fundraiser.update({
      where: { id: parseInt(fundraiserId) },
      data: { raised: { increment: parseFloat(amount) } }
    })
    return NextResponse.json({ success: true, donation })
  } catch (error) {
    return NextResponse.json({ error: 'Donation failed' }, { status: 500 })
  }
}
