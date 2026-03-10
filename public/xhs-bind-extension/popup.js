const API_URL = 'https://ai-agent-ops.vercel.app/api/xhs/callback'

async function bindAccount() {
  const statusEl = document.getElementById('status')
  const btnEl = document.getElementById('bindBtn')

  btnEl.disabled = true
  statusEl.className = 'status loading'
  statusEl.textContent = '⏳ 正在获取小红书 Cookie...'

  try {
    // 获取小红书所有 cookie（包括 HttpOnly）
    const xhsCookies = await chrome.cookies.getAll({ domain: '.xiaohongshu.com' })
    const creatorCookies = await chrome.cookies.getAll({ domain: 'creator.xiaohongshu.com' })
    
    // 合并去重
    const cookieMap = new Map()
    for (const c of [...xhsCookies, ...creatorCookies]) {
      cookieMap.set(c.name, c.value)
    }

    if (!cookieMap.has('a1')) {
      statusEl.className = 'status error'
      statusEl.textContent = '❌ 未检测到登录状态，请先登录小红书'
      btnEl.disabled = false
      return
    }

    // 拼接为 cookie 字符串
    const cookieString = Array.from(cookieMap.entries())
      .map(([name, value]) => `${name}=${value}`)
      .join('; ')

    statusEl.textContent = '⏳ 正在验证账号...'

    // 发送到后端验证
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookieString }),
    })

    const data = await res.json()

    if (data.success) {
      statusEl.className = 'status success'
      statusEl.innerHTML = `✅ 绑定成功！<br>账号：<strong>${data.data.userInfo.nickname}</strong><br>粉丝：${data.data.userInfo.fansCount}`
      btnEl.textContent = '✅ 已绑定'

      // 通知网页端
      const tabs = await chrome.tabs.query({ url: 'https://ai-agent-ops.vercel.app/*' })
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'XHS_BIND_SUCCESS',
          data: data.data,
        }).catch(() => {})
      }
    } else {
      statusEl.className = 'status error'
      statusEl.textContent = `❌ ${data.error || '绑定失败'}`
      btnEl.disabled = false
    }
  } catch (err) {
    statusEl.className = 'status error'
    statusEl.textContent = `❌ 网络错误：${err.message}`
    btnEl.disabled = false
  }
}
