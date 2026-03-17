'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SensorData {
  id: number
  sensorId: number
  value: number
  timestamp: string
  sensor: {
    type: string
    location: string
  }
}

interface News {
  id: number
  title: string
  content: string
  source: string
  createdAt: string
}

interface Campaign {
  id: number
  title: string
  description: string
  creator: { name: string; email: string }
  participants: { name: string; email: string }[]
}

interface Group {
  id: number
  name: string
  issue: string
  creator: { name: string; email: string }
  members: { name: string; email: string }[]
  _count: { messages: number }
}

interface Fundraiser {
  id: number
  cause: string
  description: string
  goal: number
  raised: number
  creator: { name: string; email: string }
}

export default function Dashboard() {
  const [data, setData] = useState<SensorData[]>([])
  const [news, setNews] = useState<News[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([])
  const [localEnv, setLocalEnv] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData)
    fetch('/api/news').then(res => res.json()).then(setNews)
    fetch('/api/campaigns').then(res => res.json()).then(setCampaigns)
    fetch('/api/groups').then(res => res.json()).then(setGroups)
    fetch('/api/fundraisers').then(res => res.json()).then(setFundraisers)
  }, [])

  const getLocalEnvironment = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        fetch(`/api/environment?lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(setLocalEnv)
      })
    }
  }

  // Group by type
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.sensor.type]) acc[item.sensor.type] = []
    acc[item.sensor.type].push(item)
    return acc
  }, {} as Record<string, SensorData[]>)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Environment Dashboard</h1>

      <button onClick={getLocalEnvironment} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Get Local Environment Data
      </button>

      {localEnv.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Local Environment</h2>
          {localEnv.map(sensor => (
            <div key={sensor.id} className="border p-2 mb-2">
              <p>Type: {sensor.type}</p>
              <p>Location: {sensor.location}</p>
              {sensor.data[0] && <p>Latest Value: {sensor.data[0].value}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Environmental Data</h2>
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-medium mb-2">{type.toUpperCase()}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={items.reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">News</h2>
          {news.map(item => (
            <div key={item.id} className="border p-2 mb-2">
              <h4 className="font-bold">{item.title}</h4>
              <p>{item.content}</p>
              <p className="text-sm text-gray-500">Source: {item.source}</p>
            </div>
          ))}

          <h2 className="text-xl font-semibold mb-2 mt-8">Campaigns</h2>
          {campaigns.map(item => (
            <div key={item.id} className="border p-2 mb-2">
              <h4 className="font-bold">{item.title}</h4>
              <p>{item.description}</p>
              <p>Creator: {item.creator.name}</p>
              <p>Participants: {item.participants.length}</p>
            </div>
          ))}

          <h2 className="text-xl font-semibold mb-2 mt-8">Groups</h2>
          {groups.map(item => (
            <div key={item.id} className="border p-2 mb-2">
              <h4 className="font-bold">{item.name}</h4>
              <p>Issue: {item.issue}</p>
              <p>Creator: {item.creator.name}</p>
              <p>Members: {item.members.length}, Messages: {item._count.messages}</p>
            </div>
          ))}

          <h2 className="text-xl font-semibold mb-2 mt-8">Fundraisers</h2>
          {fundraisers.map(item => (
            <div key={item.id} className="border p-2 mb-2">
              <h4 className="font-bold">{item.cause}</h4>
              <p>{item.description}</p>
              <p>Goal: ${item.goal}, Raised: ${item.raised}</p>
              <p>Creator: {item.creator.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}