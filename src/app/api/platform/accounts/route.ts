import { NextRequest, NextResponse } from 'next/server'
import { platformStore } from '@/lib/store/platform-store'
import { PLATFORM_DISPLAY, PLATFORM_ICON } from '@/lib/db'

export async function GET() {
  try {
    const accounts = platformStore.getAccounts()
    const result = accounts.map(a => ({
      ...a,
      platformName: PLATFORM_DISPLAY[a.platform] || a.platform,
      platformIcon: PLATFORM_ICON[a.platform] || '⚪',
      cookies: undefined, // Don't expose cookies
    }))
    return NextResponse.json({ accounts: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少账号ID' }, { status: 400 })
    platformStore.removeAccount(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
