/**
 * 平台账号和门店的持久化存储 (Prisma + SQLite)
 */

import { prisma } from '../db'
import { PlatformAccount, PlatformShop, PlatformType, PlatformCookie } from '../platform-service'

export const platformStore = {
  // ====== 账号 CRUD ======

  async addAccount(account: PlatformAccount) {
    return prisma.platformAccount.upsert({
      where: { platform_accountId: { platform: account.platform, accountId: account.accountId } },
      update: {
        accountName: account.accountName,
        cookies: JSON.stringify(account.cookies),
        status: account.status,
        lastSyncAt: account.lastSyncTime ? new Date(account.lastSyncTime) : null,
      },
      create: {
        platform: account.platform,
        accountId: account.accountId,
        accountName: account.accountName,
        cookies: JSON.stringify(account.cookies),
        status: account.status,
        bindTime: new Date(account.bindTime),
      },
    })
  },

  async getAccount(platform: PlatformType, accountId: string) {
    return prisma.platformAccount.findUnique({
      where: { platform_accountId: { platform, accountId } },
      include: { shops: true },
    })
  },

  async getAllAccounts() {
    return prisma.platformAccount.findMany({ include: { shops: true } })
  },

  async getAccountsByPlatform(platform: PlatformType) {
    return prisma.platformAccount.findMany({
      where: { platform },
      include: { shops: true },
    })
  },

  async removeAccount(platform: PlatformType, accountId: string) {
    try {
      await prisma.platformAccount.delete({
        where: { platform_accountId: { platform, accountId } },
      })
      return true
    } catch {
      return false
    }
  },

  async updateAccountStatus(platform: PlatformType, accountId: string, status: string) {
    await prisma.platformAccount.update({
      where: { platform_accountId: { platform, accountId } },
      data: { status },
    })
  },

  async updateLastSyncTime(platform: PlatformType, accountId: string) {
    await prisma.platformAccount.update({
      where: { platform_accountId: { platform, accountId } },
      data: { lastSyncAt: new Date() },
    })
  },

  // ====== 门店 ======

  async addShops(shops: PlatformShop[], dbAccountId: string) {
    for (const shop of shops) {
      await prisma.shop.upsert({
        where: { platform_shopId: { platform: shop.platform, shopId: shop.shopId } },
        update: { shopName: shop.shopName, address: shop.address, rating: shop.rating },
        create: {
          shopId: shop.shopId,
          shopName: shop.shopName,
          platform: shop.platform,
          address: shop.address,
          rating: shop.rating,
          accountId: dbAccountId,
        },
      })
    }
  },

  async getAllShops() {
    return prisma.shop.findMany()
  },

  async getShopsByPlatform(platform: PlatformType) {
    return prisma.shop.findMany({ where: { platform } })
  },

  // ====== 统计 ======

  async getStats() {
    const [totalAccounts, activeAccounts, totalShops] = await Promise.all([
      prisma.platformAccount.count(),
      prisma.platformAccount.count({ where: { status: 'active' } }),
      prisma.shop.count(),
    ])
    return { totalAccounts, activeAccounts, totalShops }
  },
}

// Helper: convert DB account to PlatformAccount type
export function dbAccountToPlatformAccount(dbAcc: any): PlatformAccount {
  return {
    platform: dbAcc.platform as PlatformType,
    accountId: dbAcc.accountId,
    accountName: dbAcc.accountName,
    cookies: JSON.parse(dbAcc.cookies) as PlatformCookie[],
    shops: (dbAcc.shops || []).map((s: any) => ({
      shopId: s.shopId,
      shopName: s.shopName,
      platform: s.platform as PlatformType,
      bindAccountId: dbAcc.accountId,
      rating: s.rating,
      address: s.address,
    })),
    bindTime: new Date(dbAcc.bindTime).getTime(),
    lastSyncTime: dbAcc.lastSyncAt ? new Date(dbAcc.lastSyncAt).getTime() : undefined,
    status: dbAcc.status as 'active' | 'expired' | 'error',
  }
}
