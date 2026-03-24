import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getDistance(lat1:number,lon1:number,lat2:number,lon2:number){
  const R=6371
  const dLat=(lat2-lat1)*Math.PI/180
  const dLon=(lon2-lon1)*Math.PI/180
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = parseFloat(searchParams.get('lat') || '0')
  const lon = parseFloat(searchParams.get('lon') || '0')
  try {
    const sensors = await prisma.sensor.findMany({
      include: { data: { orderBy: { timestamp: 'desc' }, take: 1 } },
    })
    const withDistance = sensors
      .map(s => ({
        ...s,
        distanceKm: s.lat && s.lon
          ? parseFloat(getDistance(lat, lon, s.lat, s.lon).toFixed(1))
          : null,
      }))
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    return NextResponse.json(withDistance)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}