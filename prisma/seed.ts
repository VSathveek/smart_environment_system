import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create users
  const hashedPassword = bcrypt.hashSync('password', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@example.com' },
    update: {},
    create: {
      email: 'analyst@example.com',
      password: hashedPassword,
      role: 'analyst',
    },
  })

  // Create sensors
  const tempSensor = await prisma.sensor.create({
    data: {
      type: 'temperature',
      location: 'City Center',
      lat: 40.7128,
      lon: -74.0060,
    },
  })

  const humiditySensor = await prisma.sensor.create({
    data: {
      type: 'humidity',
      location: 'City Center',
      lat: 40.7128,
      lon: -74.0060,
    },
  })

  const airQualitySensor = await prisma.sensor.create({
    data: {
      type: 'air_quality',
      location: 'City Center',
      lat: 40.7128,
      lon: -74.0060,
    },
  })

  // Add some sample data
  const now = new Date()
  for (let i = 0; i < 10; i++) {
    const time = new Date(now.getTime() - i * 60000) // every minute
    await prisma.sensorData.create({
      data: {
        sensorId: tempSensor.id,
        value: 20 + Math.random() * 10,
        timestamp: time,
      },
    })
    await prisma.sensorData.create({
      data: {
        sensorId: humiditySensor.id,
        value: 40 + Math.random() * 20,
        timestamp: time,
      },
    })
    await prisma.sensorData.create({
      data: {
        sensorId: airQualitySensor.id,
        value: 50 + Math.random() * 50,
        timestamp: time,
      },
    })
  }

  // Add some sample news
  await prisma.news.createMany({
    data: [
      {
        title: 'Global Warming Reaches Critical Levels',
        content: 'Scientists warn that global temperatures have risen by 1.5 degrees Celsius.',
        source: 'BBC News',
      },
      {
        title: 'New Renewable Energy Breakthrough',
        content: 'Researchers develop efficient solar panels that could revolutionize energy production.',
        source: 'Reuters',
      },
      {
        title: 'Plastic Pollution in Oceans',
        content: 'Report shows alarming increase in plastic waste affecting marine life.',
        source: 'National Geographic',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })