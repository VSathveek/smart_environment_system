import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sensorId = searchParams.get('sensorId')
  const limit = parseInt(searchParams.get('limit') || '100')

  try {
    const data = await prisma.sensorData.findMany({
      where: sensorId ? { sensorId: parseInt(sensorId) } : {},
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: { sensor: true },
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await prisma.sensorData.create({
      data: body,
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create data' }, { status: 500 })
  }
}