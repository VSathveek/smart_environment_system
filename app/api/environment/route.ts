import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lon = parseFloat(searchParams.get('lon') || '0')
  const radius = parseFloat(searchParams.get('radius') || '10') // km

  try {
    const sensors = await prisma.sensor.findMany({
      where: {
        lat: { not: null },
        lon: { not: null },
      },
      include: {
        data: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })

    const nearbySensors = sensors.filter(sensor => {
      if (sensor.lat && sensor.lon) {
        const distance = getDistance(lat, lon, sensor.lat, sensor.lon)
        return distance <= radius
      }
      return false
    })

    return NextResponse.json(nearbySensors)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch environment data' }, { status: 500 })
  }
}