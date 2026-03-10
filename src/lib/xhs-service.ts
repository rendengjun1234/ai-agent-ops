/**
 * 小红书服务 - 从 AiToEarn 提取的核心发布逻辑
 * 适配 Next.js API Routes
 */

const SIGN_SERVER = process.env.XHS_SIGN_SERVER || 'http://localhost:7879'
const LOGIN_URL = 'https://creator.xiaohongshu.com/'
const LOGIN_URL_HOME = 'https://www.xiaohongshu.com/'
const UPLOAD_PERMIT_URL = 'https://creator.xiaohongshu.com/api/media/v1/upload/web/permit'
const CREATE_NOTE_URL = 'https://edith.xiaohongshu.com/web_api/sns/v2/note'
const USER_INFO_URL = 'https://edith.xiaohongshu.com/api/sns/web/v2/user/me'
const FANS_INFO_URL = 'https://creator.xiaohongshu.com/api/galaxy/creator/home/personal_info'
const WORKS_LIST_URL = 'https://edith.xiaohongshu.com/web_api/sns/v5/creator/note/user/posted'

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// ====== 辅助函数 ======

function cookieArrayToString(cookies: Array<{ name: string; value: string }>): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ')
}

function getA1FromCookies(cookies: Array<{ name: string; value: string }>): string | null {
  return cookies.find(c => c.name === 'a1')?.value || null
}

async function getSignature(url: string, a1: string, data?: any): Promise<{ 'X-s': string; 'X-t': string }> {
  const body: any = { url, a1 }
  if (data) body.data = data
  
  const res = await fetch(SIGN_SERVER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  
  if (!res.ok) throw new Error(`签名服务异常: ${res.status}`)
  return res.json()
}

async function xhsRequest(url: string, options: {
  method: string
  headers: Record<string, string>
  body?: any
}): Promise<any> {
  const fetchOptions: RequestInit = {
    method: options.method,
    headers: {
      'User-Agent': DEFAULT_UA,
      ...options.headers,
    },
  }
  
  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  }
  
  const res = await fetch(url, fetchOptions)
  return res.json()
}

// ====== 公开接口 ======

export interface XhsCookie {
  name: string
  value: string
  domain?: string
}

export interface XhsUserInfo {
  authorId: string
  nickname: string
  avatar: string
  fansCount: number
}

export interface XhsPublishParams {
  title: string
  desc: string
  images: string[]  // 图片 URL 或 base64
  topics?: Array<{ topicId: string; topicName: string }>
  mentionedUsers?: Array<{ nickName: string; uid: string }>
  timingTime?: number
  visibility?: 0 | 1 | 4  // 0=公开 1=私密 4=好友
}

export interface XhsPublishResult {
  success: boolean
  publishId?: string
  shareLink?: string
  error?: string
}

/**
 * 验证 cookie 是否有效，获取用户信息
 */
export async function getUserInfo(cookies: XhsCookie[]): Promise<XhsUserInfo | null> {
  try {
    const cookieStr = cookieArrayToString(cookies)
    
    const [userRes, fansRes] = await Promise.all([
      xhsRequest(USER_INFO_URL, {
        method: 'GET',
        headers: { Cookie: cookieStr, Referer: LOGIN_URL },
      }),
      xhsRequest(FANS_INFO_URL, {
        method: 'GET',
        headers: { Cookie: cookieStr, Referer: LOGIN_URL },
      }),
    ])

    if (!userRes?.data?.user_id) return null

    return {
      authorId: userRes.data.user_id,
      nickname: userRes.data.nickname || '',
      avatar: userRes.data.imageb || '',
      fansCount: fansRes?.data?.fans_count || 0,
    }
  } catch {
    return null
  }
}

/**
 * 获取上传许可
 */
async function getUploadPermit(cookieStr: string, scene: 'image' | 'video'): Promise<any> {
  const url = `${UPLOAD_PERMIT_URL}?biz_name=spectrum&scene=${scene}&file_count=1&version=1&source=web`
  const res = await xhsRequest(url, {
    method: 'GET',
    headers: { Cookie: cookieStr, Referer: LOGIN_URL },
  })
  
  if (res.code !== 0) throw new Error(`获取上传许可失败: ${res.msg}`)
  return res.data.uploadTempPermits
}

/**
 * 上传图片到 COS
 */
async function uploadImage(cookieStr: string, imageBuffer: Buffer): Promise<{
  fileId: string
  width: number
  height: number
}> {
  const permits = await getUploadPermit(cookieStr, 'image')
  const fileId = permits[0].fileIds[0]
  const uploadAddr = permits[0].uploadAddr
  const uploadToken = permits[0].token
  const uploadUrl = `https://${uploadAddr}/${fileId}`

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Referer: LOGIN_URL,
      'X-Cos-Security-Token': uploadToken,
    },
    body: new Uint8Array(imageBuffer),
  })

  if (!uploadRes.ok) throw new Error('上传图片失败')

  // 简单获取图片尺寸（默认值，实际应解析图片）
  return { fileId, width: 1080, height: 1440 }
}

/**
 * 发布图文笔记
 */
export async function publishImageNote(
  cookies: XhsCookie[],
  params: XhsPublishParams,
): Promise<XhsPublishResult> {
  try {
    const cookieStr = cookieArrayToString(cookies)
    const a1 = getA1FromCookies(cookies)
    if (!a1) return { success: false, error: '缺少 a1 cookie' }

    // 1. 上传图片
    const uploadedImages: Array<{ fileId: string; width: number; height: number }> = []
    for (const imgSrc of params.images) {
      let buffer: Buffer
      if (imgSrc.startsWith('data:')) {
        // base64
        const base64Data = imgSrc.split(',')[1]
        buffer = Buffer.from(base64Data, 'base64')
      } else {
        // URL
        const imgRes = await fetch(imgSrc)
        buffer = Buffer.from(await imgRes.arrayBuffer())
      }
      const uploaded = await uploadImage(cookieStr, buffer)
      uploadedImages.push(uploaded)
    }

    // 2. 构建发布参数
    let description = params.desc || ''
    const hashTag: any[] = []
    const ats: any[] = []

    if (params.topics) {
      for (const topic of params.topics) {
        description += ` #${topic.topicName}[话题]# `
        hashTag.push({ id: topic.topicId, name: topic.topicName, type: 'topic' })
      }
    }

    if (params.mentionedUsers) {
      for (const user of params.mentionedUsers) {
        description += ` @${user.nickName} `
        ats.push({ nickname: user.nickName, user_id: user.uid, name: user.nickName })
      }
    }

    const isTimingPublish = params.timingTime && params.timingTime > Date.now()

    const requestData = {
      common: {
        type: 'normal',
        title: params.title,
        note_id: '',
        desc: description,
        source: JSON.stringify({
          type: 'web',
          ids: '',
          extraInfo: JSON.stringify({ subType: '', systemId: 'web' }),
        }),
        business_binds: JSON.stringify({
          version: 1,
          noteId: 0,
          bizType: isTimingPublish ? 13 : 0,
          noteOrderBind: {},
          notePostTiming: { postTime: isTimingPublish ? params.timingTime!.toString() : '' },
          noteCollectionBind: { id: '' },
        }),
        ats,
        hash_tag: hashTag,
        post_loc: {},
        privacy_info: {
          op_type: 1,
          type: params.visibility ?? 0,
        },
      },
      image_info: {
        images: uploadedImages.map(img => ({
          file_id: img.fileId,
          width: img.width,
          height: img.height,
          metadata: { source: -1 },
          stickers: { version: 2, floating: [] },
          extra_info_json: JSON.stringify({ mimeType: 'image/jpeg' }),
        })),
      },
      video_info: null,
    }

    // 3. 签名 + 发布
    const encryptUrl = CREATE_NOTE_URL.replace('https://edith.xiaohongshu.com', '')
    const sign = await getSignature(encryptUrl, a1, requestData)

    const createRes = await xhsRequest(CREATE_NOTE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Cookie: cookieStr,
        Referer: LOGIN_URL,
        Origin: LOGIN_URL,
        'X-S': sign['X-s'],
        'X-T': sign['X-t'],
      },
      body: requestData,
    })

    if (createRes?.code === -1) {
      return { success: false, error: '验签未通过' }
    }
    if (createRes?.success === false || (createRes?.result && createRes.result !== 0)) {
      return { success: false, error: createRes.msg || '发布失败' }
    }

    const noteId = createRes?.data?.id
    return {
      success: true,
      publishId: noteId,
      shareLink: noteId ? `https://www.xiaohongshu.com/explore/${noteId}` : undefined,
    }
  } catch (err: any) {
    return { success: false, error: err.message || '发布异常' }
  }
}

/**
 * 获取作品列表
 */
export async function getWorks(cookies: XhsCookie[], page = 0) {
  const cookieStr = cookieArrayToString(cookies)
  const a1 = getA1FromCookies(cookies)
  if (!a1) return null

  const url = `/web_api/sns/v5/creator/note/user/posted?tab=0&page=${page}`
  const sign = await getSignature(url, a1)

  return xhsRequest(`https://edith.xiaohongshu.com${url}`, {
    method: 'GET',
    headers: {
      Cookie: cookieStr,
      Referer: LOGIN_URL,
      Origin: LOGIN_URL,
      'X-S': sign['X-s'],
      'X-T': sign['X-t'],
    },
  })
}
