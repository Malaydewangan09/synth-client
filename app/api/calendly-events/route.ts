import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.calendly.com/scheduled_events', {
      headers: {
        'Authorization': `Bearer ${process.env.CALENDLY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return NextResponse.json(data.collection)
  } catch (error) {
    console.error('Failed to fetch Calendly events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}