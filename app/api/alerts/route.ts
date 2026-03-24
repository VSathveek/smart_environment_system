import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: {
        sensor: { select: { type: true, location: true } }
      }
    })
    return NextResponse.json(alerts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, message, sensorId } = await request.json()
    const alert = await prisma.alert.create({
      data: { type, message, ...(sensorId ? { sensorId } : {}) }
    })
    return NextResponse.json(alert)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
