import { NextRequest, NextResponse } from 'next/server'
import { getBound } from '@/lib/bind-store'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ bound: false })
  
  const data = getBound(token)
  if (data) {
    return NextResponse.json({ bound: true, data }, {
      headers: { 'Access-Control-Allow-Origin': '*' }
    })
  }
  return NextResponse.json({ bound: false })
}
