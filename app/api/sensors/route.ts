import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sensors = await prisma.sensor.findMany({
      include: {
        data: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })
    return NextResponse.json(sensors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sensors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sensor = await prisma.sensor.create({
      data: body,
    })
    return NextResponse.json(sensor)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sensor' }, { status: 500 })
  }
}