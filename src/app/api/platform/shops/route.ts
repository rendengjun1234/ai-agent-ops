import { NextResponse } from 'next/server'
import { platformStore } from '@/lib/store/platform-store'
import { PLATFORM_DISPLAY, PLATFORM_ICON } from '@/lib/db'

export async function GET() {
  try {
    const shops = platformStore.getShops()
    const result = shops.map(s => ({
      ...s,
      platformName: PLATFORM_DISPLAY[s.platform] || s.platform,
      platformIcon: PLATFORM_ICON[s.platform] || '⚪',
    }))
    return NextResponse.json({ shops: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
