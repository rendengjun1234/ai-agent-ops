/**
 * 多平台Cookie抓取扩展 - Popup 逻辑
 * 检测当前页面所属平台，提取cookie，发送到后端绑定
 */

const PLATFORM_MAP = [
  { platform: 'meituan', name: '美团', icon: '🟡', domains: ['e.waimai.meituan.com', 'shangou.meituan.com'] },
  { platform: 'eleme', name: '饿了么', icon: '🔵', domains: ['napos.ele.me', 'app-merchant.ele.me'] },
  { platform: 'douyin', name: '抖音来客', icon: '⚫', domains: ['business.douyin.com', 'life.douyin.com'] },
  { platform: 'xhs', name: '小红书', icon: '🔴', domains: ['creator.xiaohongshu.com', 'www.xiaohongshu.com'] },
  { platform: 'dianping', name: '大众点评', icon: '🟠', domains: ['e.dianping.com', 'emc.dianping.com'] },
]

// TODO: 替换为实际部署地址
const API_BASE = 'https://ai-agent-ops.vercel.app'

let detectedPlatform = null

async function detectPlatform() {
  const statusBox = document.getElementById('statusBox')
  const bindBtn = document.getElementById('bindBtn')

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.url) {
      statusBox.textContent = '❌ 无法获取当前页面信息'
      statusBox.className = 'status none'
      return
    }

    const url = new URL(tab.url)
    for (const p of PLATFORM_MAP) {
      if (p.domains.some(d => url.hostname === d || url.hostname.endsWith('.' + d))) {
        detectedPlatform = p
        statusBox.innerHTML = `<span class="platform-icon">${p.icon}</span> 检测到 <b>${p.name}</b> 商家后台`
        statusBox.className = 'status detected'
        bindBtn.disabled = false
        bindBtn.textContent = `提取 ${p.name} Cookie 并绑定`
        return
      }
    }

    statusBox.textContent = '⚠️ 当前页面不是已支持的商家后台，请先打开对应平台'
    statusBox.className = 'status none'
  } catch (err) {
    statusBox.textContent = '❌ 检测失败: ' + err.message
    statusBox.className = 'status none'
  }
}

async function extractAndBind() {
  const bindBtn = document.getElementById('bindBtn')
  const resultBox = document.getElementById('result')

  if (!detectedPlatform) return

  bindBtn.disabled = true
  bindBtn.textContent = '绑定中...'
  resultBox.style.display = 'block'
  resultBox.textContent = '正在提取Cookie...'
  resultBox.className = 'result'

  try {
    // 提取该平台所有域名的cookie
    const allCookies = []
    for (const domain of detectedPlatform.domains) {
      const cookies = await chrome.cookies.getAll({ domain })
      allCookies.push(...cookies.map(c => ({ name: c.name, value: c.value, domain: c.domain })))
    }

    if (allCookies.length === 0) {
      resultBox.textContent = '❌ 未获取到Cookie，请确保已登录'
      resultBox.className = 'result error'
      bindBtn.disabled = false
      bindBtn.textContent = `提取 ${detectedPlatform.name} Cookie 并绑定`
      return
    }

    resultBox.textContent = `获取到 ${allCookies.length} 个Cookie，正在验证...`

    // 发送到后端
    const res = await fetch(`${API_BASE}/api/platform/bind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: detectedPlatform.platform, cookies: allCookies }),
    })

    const data = await res.json()

    if (data.success) {
      const shops = data.data.shops || []
      resultBox.innerHTML = `✅ 绑定成功！<br>账号: ${data.data.accountName}<br>门店数: ${shops.length}<br>${shops.map(s => '• ' + s.shopName).join('<br>')}`
      resultBox.className = 'result success'
    } else {
      resultBox.textContent = '❌ ' + (data.error || '绑定失败')
      resultBox.className = 'result error'
    }
  } catch (err) {
    resultBox.textContent = '❌ 请求失败: ' + err.message
    resultBox.className = 'result error'
  }

  bindBtn.disabled = false
  bindBtn.textContent = `提取 ${detectedPlatform.name} Cookie 并绑定`
}

document.getElementById('bindBtn').addEventListener('click', extractAndBind)
detectPlatform()
