/**
 * 抖音服务 - 从 AiToEarn 提取的核心发布逻辑
 * 适配 Next.js API Routes
 */

import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

// ====== 常量配置 ======

const LOGIN_URL = 'https://creator.douyin.com/'
const USER_INFO_URL = 'https://creator.douyin.com/web/api/media/user/info/'
const UPLOAD_AUTH_URL = 'https://creator.douyin.com/web/api/media/upload/auth/v5/'
const PUBLISH_URL = 'https://creator.douyin.com/web/api/media/aweme/create/'
const IMAGE_UPLOAD_URL = 'https://imagex.bytedanceapi.com/'
const CSRF_TOKEN_URL = 'https://creator.douyin.com/web/api/media/anchor/search'

const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

// ====== 辅助函数 ======

function cookieArrayToString(cookies: Array<{ name: string; value: string }>): string {
  return cookies.map(c => `${c.name}=${c.value}`).join('; ')
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function httpBuildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key])
    }
  }
  return searchParams.toString()
}

// ====== AWS4 签名相关 ======

function credentialString(amzDate: string, region: string, service: string): string {
  return [amzDate.substring(0, 8), region, service, 'aws4_request'].join('/')
}

function signedHeaders(requestHeaders: Record<string, string>): string {
  return Object.keys(requestHeaders)
    .map(k => k.toLowerCase())
    .sort()
    .join(';')
}

function canonicalString(
  requestMethod: string,
  requestParams: Record<string, any>,
  requestHeaders: Record<string, string>,
  requestBody: any,
): string {
  const headerKeys = Object.keys(requestHeaders).sort()
  const canonicalHeaders = headerKeys
    .map(k => `${k.toLowerCase()}:${requestHeaders[k]}`)
    .join('\n') + '\n'

  const body = Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : ''

  return [
    requestMethod.toUpperCase(),
    '/',
    httpBuildQuery(requestParams),
    canonicalHeaders,
    signedHeaders(requestHeaders),
    crypto.createHash('sha256').update(body).digest('hex'),
  ].join('\n')
}

function signature(
  secretAccessKey: string,
  amzDate: string,
  region: string,
  service: string,
  requestMethod: string,
  requestParams: Record<string, any>,
  requestHeaders: Record<string, string>,
  requestBody: any,
): string {
  const amzDay = amzDate.substring(0, 8)
  const kDate = crypto.createHmac('sha256', 'AWS4' + secretAccessKey).update(amzDay).digest()
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
  const signingKey = crypto.createHmac('sha256', kService).update('aws4_request').digest()

  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialString(amzDate, region, service),
    crypto.createHash('sha256').update(canonicalString(requestMethod, requestParams, requestHeaders, requestBody)).digest('hex'),
  ].join('\n')

  return crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex')
}

function addHeaders(amzDate: string, sessionToken: string, requestBody: any): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Amz-Date': amzDate,
    'X-Amz-Security-Token': sessionToken,
  }
  if (Object.keys(requestBody).length > 0) {
    headers['X-Amz-Content-Sha256'] = crypto.createHash('sha256').update(JSON.stringify(requestBody)).digest('hex')
  }
  return headers
}

async function generateAuthorizationAndHeader(
  accessKeyID: string,
  secretAccessKey: string,
  sessionToken: string,
  region: string,
  service: string,
  requestMethod: string,
  requestParams: Record<string, any>,
  requestBody: any = {},
): Promise<Record<string, string>> {
  const now = new Date()
  const amzDate = now.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'

  const requestHeaders = addHeaders(amzDate, sessionToken, requestBody)

  const authorizationParams = [
    'AWS4-HMAC-SHA256 Credential=' + accessKeyID + '/' + credentialString(amzDate, region, service),
    'SignedHeaders=' + signedHeaders(requestHeaders),
    'Signature=' + signature(secretAccessKey, amzDate, region, service, requestMethod, requestParams, requestHeaders, requestBody),
  ]

  const headers: Record<string, string> = { ...requestHeaders }
  headers['Authorization'] = authorizationParams.join(', ')
  return headers
}

// ====== 核心接口 ======

export interface DouyinCookie {
  name: string
  value: string
  domain?: string
}

export interface DouyinUserInfo {
  uid: string
  authorId: string
  nickname: string
  avatar: string
  fansCount: number
}

export interface DouyinPublishParams {
  title: string
  caption?: string
  images: string[]  // 图片 URL 或 base64
  topics?: string[]
  activity?: Array<{ value: string; label: string }>
  mentionedUserInfo?: Array<{ nickName: string; uid: string }>
  timingTime?: number
  visibility_type: 0 | 1 | 2  // 0=公开 1=私密 2=好友
  poiInfo?: { poiId: string; poiName: string }
  musicId?: string
  mixInfo?: { mixId: string; mixName: string }
  hot_sentence?: string
  userDeclare?: any
}

export interface DouyinPublishResult {
  success: boolean
  publishId?: string
  shareLink?: string
  publishTime?: number
  error?: string
}

/**
 * 获取用户信息
 */
export async function getUserInfo(cookies: DouyinCookie[]): Promise<DouyinUserInfo | null> {
  try {
    const cookieStr = cookieArrayToString(cookies)
    const res = await fetch(USER_INFO_URL, {
      method: 'GET',
      headers: {
        'User-Agent': DEFAULT_UA,
        Cookie: cookieStr,
      },
    })

    const data = await res.json()
    if (data.status_code !== 0) return null

    return {
      uid: data.user.sec_uid,
      authorId: data.user.unique_id !== '' ? data.user.unique_id : data.user.uid,
      nickname: data.user.nickname ?? '',
      avatar: data.user.avatar_thumb.url_list[0] ?? '',
      fansCount: data.user.follower_count ?? 0,
    }
  } catch {
    return null
  }
}

/**
 * 获取上传凭证
 */
async function getUploadAuth(cookieStr: string): Promise<any> {
  const res = await fetch(UPLOAD_AUTH_URL, {
    method: 'GET',
    headers: {
      'User-Agent': DEFAULT_UA,
      Cookie: cookieStr,
    },
  })

  const data = await res.json()
  if (data.status_code !== 0) throw new Error('获取上传凭证失败')
  return JSON.parse(data.auth)
}

/**
 * 获取用户 UID
 */
async function getUserUid(cookieStr: string): Promise<string> {
  const res = await fetch(USER_INFO_URL, {
    method: 'GET',
    headers: {
      'User-Agent': DEFAULT_UA,
      Cookie: cookieStr,
    },
  })

  const data = await res.json()
  if (data.status_code !== 0) throw new Error('获取用户UID失败')
  return data.user.uid
}

/**
 * 上传封面文件
 */
async function uploadCoverFile(
  imageBuffer: Buffer,
  cookieStr: string,
  userUid: string,
): Promise<string> {
  // 1. 获取上传凭证
  const uploadAuth = await getUploadAuth(cookieStr)

  // 2. 计算 CRC32（简化版，实际需要 crc32 库）
  const imageCrc32 = crypto.createHash('md5').update(imageBuffer).digest('hex').substring(0, 8)

  // 3. 获取图片上传凭证
  const getUploadImageProofRequestParams = {
    Action: 'ApplyImageUpload',
    ServiceId: 'jm8ajry58r',
    Version: '2018-08-01',
    app_id: 2906,
    s: generateRandomString(11),
    user_id: userUid,
  }

  const requestHeadersInfo = await generateAuthorizationAndHeader(
    uploadAuth.AccessKeyID,
    uploadAuth.SecretAccessKey,
    uploadAuth.SessionToken,
    'cn-north-1',
    'imagex',
    'GET',
    getUploadImageProofRequestParams,
  )

  const uploadImgRes = await fetch(
    IMAGE_UPLOAD_URL + '?' + httpBuildQuery(getUploadImageProofRequestParams),
    {
      method: 'GET',
      headers: requestHeadersInfo,
    },
  )

  const uploadImgData = await uploadImgRes.json()
  if (uploadImgData.ResponseMetadata?.Error) {
    throw new Error(uploadImgData.ResponseMetadata.Error.Message)
  }

  const UploadAddress = uploadImgData.Result.UploadAddress
  const uploadImgUrl = `https://${UploadAddress.UploadHosts[0]}/upload/v1/${UploadAddress.StoreInfos[0].StoreUri}`

  // 4. 上传图片
  const imageUploadRes = await fetch(uploadImgUrl, {
    method: 'POST',
    headers: {
      Authorization: UploadAddress.StoreInfos[0].Auth,
      'Content-Crc32': imageCrc32,
      'Content-Type': 'application/octet-stream',
      'X-Storage-U': userUid,
    },
    body: new Uint8Array(imageBuffer),
  })

  const imageUploadData = await imageUploadRes.json()
  if (imageUploadData.code !== 2000) throw new Error(imageUploadData.message)

  // 5. 提交图片上传
  const commitImgParams = {
    Action: 'CommitImageUpload',
    ServiceId: 'jm8ajry58r',
    Version: '2018-08-01',
    app_id: 2906,
    user_id: userUid,
  }

  const commitImgContent = {
    SessionKey: UploadAddress.SessionKey,
  }

  const commitImgHead = await generateAuthorizationAndHeader(
    uploadAuth.AccessKeyID,
    uploadAuth.SecretAccessKey,
    uploadAuth.SessionToken,
    'cn-north-1',
    'imagex',
    'POST',
    commitImgParams,
    commitImgContent,
  )

  const commitImg = await fetch(IMAGE_UPLOAD_URL + '?' + httpBuildQuery(commitImgParams), {
    method: 'POST',
    headers: {
      ...commitImgHead,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commitImgContent),
  })

  const commitImgData = await commitImg.json()
  if (commitImgData.ResponseMetadata?.Error) {
    throw new Error(commitImgData.ResponseMetadata.Error.Message)
  }

  return commitImgData.Result.Results[0].Uri
}

/**
 * 获取 CSRF Token
 */
async function getSecsdkCsrfToken(cookieStr: string): Promise<string> {
  const res = await fetch(CSRF_TOKEN_URL, {
    method: 'HEAD',
    headers: {
      'User-Agent': DEFAULT_UA,
      Cookie: cookieStr,
      'X-Secsdk-Csrf-Request': '1',
      'X-Secsdk-Csrf-Version': '1.2.22',
    },
  })

  const csrfToken = res.headers.get('x-ware-csrf-token')
  if (!csrfToken) throw new Error('获取CSRF Token失败')
  return csrfToken.split(',')[1]
}

/**
 * 获取 bd-ticket 请求头（需要本地签名服务）
 */
async function getBdTicketHeaders(tokens: any): Promise<Record<string, string>> {
  if (!tokens) return {}

  try {
    const { privateKey, webProtect } = JSON.parse(tokens)
    const res = await fetch('http://116.62.154.231:7879/index/index/douyin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        privateKey,
        webProtect,
        path: '/web/api/media/aweme/create/',
      }),
    })
    return res.json()
  } catch {
    return {}
  }
}

/**
 * 构建发布参数
 */
function getPublishPublicParams(params: DouyinPublishParams): any {
  let text = `${params.title || ''} ${params.caption || ''}`
  const textExtra: any[] = []
  const mentions: string[] = []

  // 处理话题
  if (params.topics || params.activity) {
    for (const topic of [...(params.topics || []), ...(params.activity?.map(v => v.label) || [])]) {
      const extraItem: any = {
        start: text.length,
        type: 1,
        hashtag_name: topic,
        hashtag_id: 0,
        user_id: '',
        caption_start: 0,
        caption_end: 0,
      }
      text += `#${topic} `
      extraItem.end = text.length - 1
      textExtra.push(extraItem)
    }
  }

  // 处理@好友
  if (params.mentionedUserInfo) {
    for (const userInfo of params.mentionedUserInfo) {
      if (userInfo.nickName) {
        const extraItem: any = {
          start: text.length,
          type: 0,
          hashtag_name: '',
          hashtag_id: 0,
          user_id: userInfo.uid,
          caption_start: 0,
          caption_end: 0,
        }
        text += ` @${userInfo.nickName}`
        extraItem.end = text.length
        textExtra.push(extraItem)
        mentions.push(userInfo.uid)
      }
    }
  }

  const publishParams: any = {
    hot_sentence: params.hot_sentence,
    user_declare_info: params.userDeclare ? { choose_value: params.userDeclare } : {},
    item_title: params.title ?? '',
    text,
    text_extra: textExtra,
    mentions,
    visibility_type: params.visibility_type,
    download: 1,
    activity: JSON.stringify(params.activity?.map(v => v.value) || []),
  }

  if (params.mixInfo) {
    publishParams.mix_id = params.mixInfo.mixId
  }

  if (params.poiInfo?.poiId) {
    publishParams.poi_id = params.poiInfo.poiId
    publishParams.poi_name = params.poiInfo.poiName
  }

  if (params.musicId) {
    publishParams.music_id = params.musicId
  }

  if (params.timingTime && params.timingTime > Date.now()) {
    publishParams.timing = Math.floor(params.timingTime / 1000)
  }

  return publishParams
}

/**
 * 发布图文作品
 */
export async function publishImageWorkApi(
  cookies: DouyinCookie[],
  tokens: any,
  params: DouyinPublishParams,
): Promise<DouyinPublishResult> {
  try {
    const cookieStr = cookieArrayToString(cookies)
    const userUid = await getUserUid(cookieStr)

    // 1. 上传图片
    const images: Array<{ uri: string; width: number; height: number }> = []
    for (const imgSrc of params.images) {
      let buffer: Buffer
      if (imgSrc.startsWith('data:')) {
        const base64Data = imgSrc.split(',')[1]
        buffer = Buffer.from(base64Data, 'base64')
      } else {
        const imgRes = await fetch(imgSrc)
        buffer = Buffer.from(await imgRes.arrayBuffer())
      }

      const poster = await uploadCoverFile(buffer, cookieStr, userUid)
      // 简化：默认尺寸
      images.push({ uri: poster, width: 1080, height: 1440 })
    }

    // 2. 构建发布参数
    const publishParams = getPublishPublicParams(params)
    publishParams.images = images

    // 3. 获取 CSRF Token
    const csrfToken = await getSecsdkCsrfToken(cookieStr)

    // 4. 获取 bd-ticket
    const bdTicketHeaders = await getBdTicketHeaders(tokens)

    // 5. 发布
    const publishRes = await fetch(PUBLISH_URL, {
      method: 'POST',
      headers: {
        'User-Agent': DEFAULT_UA,
        'Content-Type': 'application/json',
        Cookie: cookieStr,
        'X-Secsdk-Csrf-Token': csrfToken,
        ...bdTicketHeaders,
      },
      body: JSON.stringify(publishParams),
    })

    const publishData = await publishRes.json()

    if (publishData.status === 403 || !publishData) {
      return { success: false, error: '请重新授权账号后发布' }
    }

    if (publishData.status_code !== 0) {
      return { success: false, error: publishData.status_msg || '发布失败' }
    }

    const itemId = publishData.aweme?.aweme_id
    return {
      success: true,
      publishId: itemId,
      shareLink: `https://www.douyin.com/user/self?from_tab_name=main&modal_id=${itemId}&showTab=post`,
      publishTime: Math.floor(Date.now() / 1000),
    }
  } catch (err: any) {
    return { success: false, error: err.message || '发布异常' }
  }
}

/**
 * 获取作品列表
 */
export async function getWorks(cookies: DouyinCookie[], cursor?: string) {
  const cookieStr = cookieArrayToString(cookies)
  const url = `https://creator.douyin.com/aweme/v1/creator/item/list/${cursor ? `?cursor=${cursor}` : ''}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': DEFAULT_UA,
      Cookie: cookieStr,
    },
  })

  return res.json()
}
