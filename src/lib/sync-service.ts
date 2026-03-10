/**
 * 评价同步服务
 * 从各平台拉取最新评价并存入数据库
 */

import { prisma } from './db'
import { meituanService } from './meituan-service'
import { elemeService } from './eleme-service'
import { douyinService } from './douyin-service'
import { PlatformCookie, PlatformService, PlatformType } from './platform-service'

const services: Record<string, PlatformService> = {
  meituan: meituanService,
  eleme: elemeService,
  douyin: douyinService,
}

export function getServiceByPlatform(platform: string): PlatformService | undefined {
  return services[platform]
}

export async function syncReviewsForAccount(accountId: string) {
  const account = await prisma.platformAccount.findUnique({
    where: { id: accountId },
    include: { shops: true },
  })
  if (!account || account.status !== 'active') return

  const cookies: PlatformCookie[] = JSON.parse(account.cookies)
  const service = getServiceByPlatform(account.platform)
  if (!service) return

  const task = await prisma.syncTask.create({
    data: {
      platform: account.platform,
      accountId: account.id,
      taskType: 'reviews',
      status: 'running',
      startedAt: new Date(),
    },
  })

  try {
    for (const shop of account.shops) {
      const result = await service.getReviews(cookies, shop.shopId, 1)
      if (result.reviews.length > 0) {
        for (const r of result.reviews) {
            await prisma.review.upsert({
              where: { platform_reviewId: { platform: account.platform, reviewId: r.reviewId } },
              update: {},
              create: {
                reviewId: r.reviewId,
                platform: account.platform,
                shopId: shop.id,
                userName: r.userName,
                rating: r.rating,
                content: r.content,
                images: r.images ? JSON.stringify(r.images) : null,
                createdAt: new Date(r.reviewTime),
                reply: r.replyContent || null,
                repliedAt: r.replyTime ? new Date(r.replyTime) : null,
              },
            })
          }
      }
    }

    await prisma.syncTask.update({
      where: { id: task.id },
      data: { status: 'completed', completedAt: new Date() },
    })
    await prisma.platformAccount.update({
      where: { id: accountId },
      data: { lastSyncAt: new Date() },
    })
  } catch (err: any) {
    await prisma.syncTask.update({
      where: { id: task.id },
      data: { status: 'failed', error: err.message },
    })
  }
}

export async function syncAllAccounts() {
  const accounts = await prisma.platformAccount.findMany({
    where: { status: 'active' },
  })
  for (const account of accounts) {
    await syncReviewsForAccount(account.id)
  }
}
