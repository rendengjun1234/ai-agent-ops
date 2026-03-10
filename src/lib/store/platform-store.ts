// Platform store - using better-sqlite3
import { getDb, genId, PLATFORM_DISPLAY, PLATFORM_ICON } from '../db'

export interface StoredAccount {
  id: string
  platform: string
  accountId: string
  accountName: string
  cookies: any[]
  status: string
  bindTime: string
  lastSyncAt: string | null
}

export interface StoredShop {
  id: string
  shopId: string
  shopName: string
  platform: string
  address: string | null
  rating: number | null
  accountId: string
}

class PlatformStore {
  addAccount(data: { platform: string; accountId: string; accountName: string; cookies: any[] }) {
    const db = getDb()
    const id = genId()
    db.prepare('INSERT OR REPLACE INTO platform_accounts (id, platform, account_id, account_name, cookies, status) VALUES (?,?,?,?,?,?)').run(
      id, data.platform, data.accountId, data.accountName, JSON.stringify(data.cookies), 'active'
    )
    return id
  }

  getAccounts(): StoredAccount[] {
    const db = getDb()
    return (db.prepare('SELECT * FROM platform_accounts').all() as any[]).map(r => ({
      id: r.id, platform: r.platform, accountId: r.account_id, accountName: r.account_name,
      cookies: JSON.parse(r.cookies || '[]'), status: r.status, bindTime: r.bind_time, lastSyncAt: r.last_sync_at,
    }))
  }

  getAccountsByPlatform(platform: string): StoredAccount[] {
    return this.getAccounts().filter(a => a.platform === platform)
  }

  removeAccount(id: string) {
    const db = getDb()
    db.prepare('DELETE FROM platform_accounts WHERE id = ?').run(id)
  }

  addShops(accountId: string, shops: { shopId: string; shopName: string; platform: string; address?: string; rating?: number }[]) {
    const db = getDb()
    const stmt = db.prepare('INSERT OR REPLACE INTO shops (id, shop_id, shop_name, platform, address, rating, account_id) VALUES (?,?,?,?,?,?,?)')
    for (const s of shops) {
      stmt.run(genId(), s.shopId, s.shopName, s.platform, s.address || null, s.rating || null, accountId)
    }
  }

  getShops(): StoredShop[] {
    const db = getDb()
    return (db.prepare('SELECT * FROM shops').all() as any[]).map(r => ({
      id: r.id, shopId: r.shop_id, shopName: r.shop_name, platform: r.platform,
      address: r.address, rating: r.rating, accountId: r.account_id,
    }))
  }

  getShopsByPlatform(platform: string): StoredShop[] {
    return this.getShops().filter(s => s.platform === platform)
  }
}

export const platformStore = new PlatformStore()
