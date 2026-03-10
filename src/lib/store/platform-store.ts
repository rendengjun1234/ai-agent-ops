/**
 * 平台账号和门店的内存存储
 * TODO: 后续可替换为数据库存储
 */

import { PlatformAccount, PlatformShop, PlatformType } from '../platform-service'

class PlatformStore {
  private accounts: Map<string, PlatformAccount> = new Map()

  // ====== 账号 CRUD ======

  addAccount(account: PlatformAccount): void {
    const key = `${account.platform}:${account.accountId}`
    this.accounts.set(key, account)
  }

  getAccount(platform: PlatformType, accountId: string): PlatformAccount | undefined {
    return this.accounts.get(`${platform}:${accountId}`)
  }

  getAllAccounts(): PlatformAccount[] {
    return Array.from(this.accounts.values())
  }

  getAccountsByPlatform(platform: PlatformType): PlatformAccount[] {
    return this.getAllAccounts().filter(a => a.platform === platform)
  }

  removeAccount(platform: PlatformType, accountId: string): boolean {
    return this.accounts.delete(`${platform}:${accountId}`)
  }

  updateAccountStatus(platform: PlatformType, accountId: string, status: PlatformAccount['status']): void {
    const account = this.getAccount(platform, accountId)
    if (account) account.status = status
  }

  updateLastSyncTime(platform: PlatformType, accountId: string): void {
    const account = this.getAccount(platform, accountId)
    if (account) account.lastSyncTime = Date.now()
  }

  // ====== 门店查询 ======

  getAllShops(): PlatformShop[] {
    return this.getAllAccounts().flatMap(a => a.shops)
  }

  getShopsByPlatform(platform: PlatformType): PlatformShop[] {
    return this.getAccountsByPlatform(platform).flatMap(a => a.shops)
  }

  // ====== 统计 ======

  getStats() {
    const accounts = this.getAllAccounts()
    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(a => a.status === 'active').length,
      totalShops: accounts.reduce((sum, a) => sum + a.shops.length, 0),
      byPlatform: Object.fromEntries(
        (['meituan', 'eleme', 'douyin', 'xhs', 'dianping'] as PlatformType[]).map(p => [
          p,
          { accounts: this.getAccountsByPlatform(p).length, shops: this.getShopsByPlatform(p).length },
        ])
      ),
    }
  }
}

// 全局单例
export const platformStore = new PlatformStore()
