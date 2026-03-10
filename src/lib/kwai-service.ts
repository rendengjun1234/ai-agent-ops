/**
 * 快手服务 - 从 AiToEarn 提取的核心发布逻辑
 * 适配 Next.js API Routes
 */

import fs from 'fs'
import path from 'path'
import kwaiSign from './kwai-sign'

const CP_API = 'https://cp.kuaishou.com'
const GRAPHQL_API = 'https://www.kuaishou.com/graphql'
const UPLOAD_API = 'https://upload.kuaishouzt.com'
const FILE_BLOCK_SIZE = 4194304 // 4MB

const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0'

// ====== 辅助函数 ======

function cookieArrayToString(cookies: KwaiCookie[]): string {
  return cookies.map((c) => `${c.name}=${c.value}`).join('; ')
}

function getApiPh(cookies: KwaiCookie[]): string {
  const ph = cookies.find((c) => c.name === 'kuaishou.web.cp.api_ph')
  if (!ph) throw new Error('缺少 kuaishou.web.cp.api_ph cookie')
  return ph.value
}

/** 获取文件分片信息 */
function getFilePartInfo(filePath: string, blockSize: number) {
  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const blockInfo: number[] = []
  let offset = 0
  while (offset < fileSize) {
    offset = Math.min(offset + blockSize, fileSize)
    blockInfo.push(offset)
  }
  return { fileSize, blockInfo }
}

/** 读取文件分片内容 */
function getFilePartContent(filePath: string, start: number, end: number): Buffer {
  const fd = fs.openSync(filePath, 'r')
  const length = end - start + 1
  const buffer = Buffer.alloc(length)
  fs.readSync(fd, buffer, 0, length, start)
  fs.closeSync(fd)
  return buffer
}

/** 带签名的快手 API 请求 */
async function kwaiRequest<T = any>(options: {
  url: string
  apiUrl?: string
  method: 'GET' | 'POST'
  cookies: KwaiCookie[]
  body?: any
  isFormData?: boolean
  formDataBody?: FormData
  headers?: Record<string, string>
}): Promise<{ status: number; data: T }> {
  const { url, apiUrl = CP_API, method, cookies, body, isFormData, formDataBody, headers: extraHeaders } = options
  const apiPh = getApiPh(cookies)
  const cookieStr = cookieArrayToString(cookies)

  // 构建 body（注入 api_ph）
  let finalBody: any = body || {}
  if (!isFormData && method === 'POST') {
    finalBody = { ...finalBody, 'kuaishou.web.cp.api_ph': apiPh }
  }

  // 签名
  const signJson = isFormData ? { 'kuaishou.web.cp.api_ph': apiPh } : finalBody
  const signedUrl = await kwaiSign.sign({
    json: signJson,
    type: isFormData ? 'form-data' : 'json',
    url: `${apiUrl}${url || ''}`,
  })

  const fullUrl = apiUrl === CP_API ? signedUrl : apiUrl
  const fetchHeaders: Record<string, string> = {
    'User-Agent': DEFAULT_UA,
    Cookie: cookieStr,
    ...extraHeaders,
  }

  let fetchBody: any
  if (isFormData && formDataBody) {
    // 注入 api_ph 到 FormData
    formDataBody.append('kuaishou.web.cp.api_ph', apiPh)
    fetchBody = formDataBody
  } else if (method === 'POST') {
    fetchHeaders['Content-Type'] = 'application/json'
    fetchBody = JSON.stringify(finalBody)
  }

  const res = await fetch(fullUrl, { method, headers: fetchHeaders, body: fetchBody })
  const data = (await res.json()) as T
  return { status: res.status, data }
}

/** 无签名的上传请求 */
async function uploadRequest<T = any>(url: string, options: {
  method: 'POST' | 'PUT'
  body?: any
  isOctetStream?: boolean
  headers?: Record<string, string>
}): Promise<{ data: T }> {
  const fetchHeaders: Record<string, string> = {
    'User-Agent': DEFAULT_UA,
    ...options.headers,
  }
  if (options.isOctetStream) {
    fetchHeaders['Content-Type'] = 'application/octet-stream'
  }

  const res = await fetch(url, {
    method: options.method,
    headers: fetchHeaders,
    body: options.body,
  })
  const data = (await res.json()) as T
  return { data }
}

// ====== 公开接口 ======

export interface KwaiCookie {
  name: string
  value: string
  domain?: string
}

export interface KwaiUserInfo {
  userId: number
  nickname: string
  avatar: string
  eid: string
}

export interface KwaiPublishParams {
  cookies: KwaiCookie[]
  videoPath: string
  coverPath: string
  desc: string
  topics?: string[]
  mentions?: string[]
  poiInfo?: { poiId: string; latitude: string; longitude: string }
  /** 1=公开 2=私密 4=好友 */
  photoStatus?: 1 | 2 | 4
  /** 定时发布时间戳(ms) */
  publishTime?: number
  callback?: (progress: number, msg?: string) => void
}

export interface KwaiPublishResult {
  success: boolean
  publishId?: string
  shareLink?: string
  error?: string
}

/**
 * 获取用户信息
 */
export async function getUserInfo(cookies: KwaiCookie[]): Promise<KwaiUserInfo | null> {
  try {
    const res = await kwaiRequest<{
      data: {
        userInfo: { id: string; name: string; avatar: string; eid: string; userId: number }
      }
    }>({
      url: GRAPHQL_API,
      cookies,
      method: 'POST',
      body: {
        operationName: 'userInfoQuery',
        variables: {},
        query:
          'query userInfoQuery {\n  userInfo {\n    id\n    name\n    avatar\n    eid\n    userId\n    __typename\n  }\n}\n',
      },
    })

    const info = res.data?.data?.userInfo
    if (!info) return null

    return {
      userId: info.userId,
      nickname: info.name,
      avatar: info.avatar,
      eid: info.eid,
    }
  } catch {
    return null
  }
}

/**
 * 获取首页粉丝/关注/获赞数据
 */
export async function getHomeInfo(cookies: KwaiCookie[]) {
  const res = await kwaiRequest<{
    data: { fansCnt: number; followCnt: number; likeCnt: number; userName: string; userId: number }
  }>({
    cookies,
    url: '/rest/cp/creator/pc/home/infoV2',
    method: 'POST',
  })
  return res.data?.data || null
}

/**
 * 发布视频
 */
export async function pubVideo(params: KwaiPublishParams): Promise<KwaiPublishResult> {
  const cb = params.callback || (() => {})

  try {
    // 1. 文件分片信息
    cb(5, '正在视频分片...')
    const ext = path.extname(params.videoPath).replace('.', '')
    const filename = path.basename(params.videoPath, `.${ext}`)
    const partInfo = getFilePartInfo(params.videoPath, FILE_BLOCK_SIZE)

    // 2. 创建上传任务
    cb(10, '正在创建视频...')
    const preRes = await kwaiRequest<{
      result: number
      data: { token: string; fileId: number }
      message: string
    }>({
      url: '/rest/cp/works/v2/video/pc/upload/pre',
      cookies: params.cookies,
      method: 'POST',
      body: { uploadType: 1 },
    })
    if (!preRes.data?.data) throw new Error(preRes.data?.message || '创建上传任务失败')
    const token = preRes.data.data.token

    // 3. 分片上传
    for (let i = 0; i < partInfo.blockInfo.length; i++) {
      cb(40, `上传视频（${i}/${partInfo.blockInfo.length}）`)
      const chunkStart = i === 0 ? 0 : partInfo.blockInfo[i - 1]
      const chunkEnd = partInfo.blockInfo[i] - 1
      const chunk = getFilePartContent(params.videoPath, chunkStart, chunkEnd)

      let success = false
      for (let retry = 0; retry < 3; retry++) {
        const uploadRes = await uploadRequest<{ result: number }>(
          `${UPLOAD_API}/api/upload/fragment?upload_token=${token}&fragment_id=${i}`,
          { method: 'POST', body: chunk, isOctetStream: true },
        )
        if (uploadRes.data.result === 1) { success = true; break }
      }
      if (!success) throw new Error('分片上传失败，请稍后重试')
    }

    // 4. 完成上传
    cb(60, '查询分片上传结果...')
    await uploadRequest(
      `${UPLOAD_API}/api/upload/complete?upload_token=${token}&fragment_count=${partInfo.blockInfo.length}`,
      { method: 'POST' },
    )

    // 5. 上传完成确认
    cb(70, '视频上传结束...')
    const finishRes = await kwaiRequest<{
      result: number
      message: string
      data: {
        coverKey: string; coverMediaId: string; duration: number
        fileId: number; height: number; mediaId: string
        photoIdStr: string; videoDuration: string; width: string
      }
    }>({
      url: '/rest/cp/works/v2/video/pc/upload/finish',
      method: 'POST',
      cookies: params.cookies,
      body: {
        token,
        fileName: filename,
        fileType: `video/${ext}`,
        fileLength: partInfo.fileSize,
      },
    })
    if (finishRes.data.result !== 1) throw new Error(finishRes.data.message)

    // 6. 上传封面
    cb(80, '正在上传封面...')
    const coverFormData = new FormData()
    const coverBuffer = fs.readFileSync(params.coverPath)
    const coverBlob = new Blob([coverBuffer])
    coverFormData.append('file', coverBlob, path.basename(params.coverPath))

    const coverRes = await kwaiRequest<{ data: { coverKey: string } }>({
      url: '/rest/cp/works/v2/video/pc/upload/cover/upload',
      method: 'POST',
      cookies: params.cookies,
      isFormData: true,
      formDataBody: coverFormData,
    })

    // 7. 构建发布参数
    cb(90, '正在发布...')
    let caption = params.desc || ''
    if (params.mentions?.length) caption += ` ${params.mentions.join(' ')} `
    if (params.topics?.length) caption += ` ${params.topics.join(' ')} `

    const submitParams = {
      ...finishRes.data.data,
      coverKey: coverRes.data.data.coverKey,
      coverTimeStamp: 0,
      coverType: 1,
      coverTitle: '',
      photoType: 0,
      collectionId: '',
      publishTime: params.publishTime || 0,
      longitude: params.poiInfo?.longitude || '',
      latitude: params.poiInfo?.latitude || '',
      poiId: params.poiInfo?.poiId || 0,
      notifyResult: 0,
      domain: '',
      secondDomain: '',
      coverCropped: false,
      pkCoverKey: '',
      profileCoverKey: '',
      downloadType: 1,
      disableNearbyShow: false,
      allowSameFrame: true,
      movieId: '',
      openPrePreview: false,
      declareInfo: {},
      activityIds: [],
      riseQuality: false,
      chapters: [],
      projectId: '',
      recTagIdList: [],
      videoInfoMeta: '',
      previewUrlErrorMessage: '',
      triggerH265: false,
      caption,
      photoStatus: params.photoStatus || 1,
    }

    const submitRes = await kwaiRequest<{ result: number; message: string }>({
      url: '/rest/cp/works/v2/video/pc/submit',
      method: 'POST',
      cookies: params.cookies,
      body: submitParams,
    })

    if (submitRes.data.result !== 1) {
      return { success: false, error: submitRes.data.message }
    }

    // 8. 查询发布结果
    cb(95, '查询发布结果...')
    let publishId = ''
    for (let retry = 0; retry < 5; retry++) {
      await new Promise((r) => setTimeout(r, 2000))
      const worksList = await getWorks(params.cookies, '2')
      const work = worksList?.find(
        (v: any) => v.unPublishCoverKey === coverRes.data.data.coverKey,
      )
      if (work) {
        publishId = `${work.publishId}`
        break
      }
    }

    return { success: true, publishId, shareLink: '' }
  } catch (err: any) {
    return { success: false, error: err.message || '发布异常' }
  }
}

/**
 * 获取作品列表
 * @param queryType 0=全部 1=已发布 2=待发布 3=未通过
 */
export async function getWorks(
  cookies: KwaiCookie[],
  queryType: '0' | '1' | '2' | '3' = '1',
  limit = 100,
) {
  const res = await kwaiRequest<{
    result: number
    data: { list: any[] }
  }>({
    cookies,
    url: '/rest/cp/works/v2/video/pc/photo/list',
    method: 'POST',
    body: {
      cursor: Date.now(),
      queryType,
      limit,
      timeRangeType: 5,
      keyword: '',
      startTime: Date.now() - 1000 * 60 * 60 * 24 * 30,
      endTime: Date.now(),
    },
  })
  return res.data?.data?.list || null
}

/**
 * 搜索话题
 */
export async function searchTopics(cookies: KwaiCookie[], keyword: string) {
  const res = await kwaiRequest<{
    data: { tags: Array<{ tag: { id: number; name: string }; viewCount: number }> }
  }>({
    cookies,
    url: '/rest/cp/works/v2/video/pc/tag/search',
    method: 'POST',
    body: { keyword },
  })
  return res.data?.data?.tags || []
}

/**
 * 搜索位置
 */
export async function searchLocations(
  cookies: KwaiCookie[],
  keyword: string,
  cityName = '',
) {
  const res = await kwaiRequest<{
    locations: Array<{
      id: number; title: string; address: string
      latitude: number; longitude: number; idString: string
    }>
  }>({
    cookies,
    url: '/rest/zt/location/wi/poi/search?kpn=kuaishou_cp&subBiz=CP%2FCREATOR_PLATFORM',
    method: 'POST',
    body: { cityName, count: 50, keyword, pcursor: '' },
  })
  return res.data?.locations || []
}
