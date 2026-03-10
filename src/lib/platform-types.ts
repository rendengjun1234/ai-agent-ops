/**
 * 统一平台服务接口
 */

export type PlatformType = 'xiaohongshu' | 'douyin' | 'kwai' | 'wxsph'

export interface PlatformCookie {
  name: string
  value: string
  domain?: string
}

export interface PlatformUserInfo {
  authorId: string
  nickname: string
  avatar: string
  fansCount: number
}

export interface PublishParams {
  title: string
  desc: string
  images?: string[]       // 图文发布
  videoPath?: string      // 视频发布
  coverPath?: string      // 视频封面
  topics?: Array<{ topicId: string; topicName: string }>
  mentionedUsers?: Array<{ nickName: string; uid: string }>
  timingTime?: number
  visibility?: number     // 0=公开 1=私密
}

export interface PublishResult {
  success: boolean
  publishId?: string
  shareLink?: string
  error?: string
}

export const PLATFORM_LABELS: Record<PlatformType, { label: string; icon: string }> = {
  xiaohongshu: { label: '小红书', icon: '📕' },
  douyin: { label: '抖音', icon: '🎵' },
  kwai: { label: '快手', icon: '🎬' },
  wxsph: { label: '视频号', icon: '📺' },
}

export const SUPPORTED_PLATFORMS: PlatformType[] = ['xiaohongshu', 'douyin', 'kwai', 'wxsph']
