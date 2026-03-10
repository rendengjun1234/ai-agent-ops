const API_URL = 'https://ai-agent-ops.vercel.app/api/xhs/callback';

document.addEventListener('DOMContentLoaded', function() {
  const btnEl = document.getElementById('bindBtn');
  const statusEl = document.getElementById('status');

  btnEl.addEventListener('click', async function() {
    btnEl.disabled = true;
    statusEl.className = 'status loading';
    statusEl.textContent = '⏳ 正在获取小红书 Cookie...';

    try {
      // 获取小红书所有 cookie（包括 HttpOnly）
      const cookies1 = await chrome.cookies.getAll({ domain: '.xiaohongshu.com' });
      const cookies2 = await chrome.cookies.getAll({ domain: 'creator.xiaohongshu.com' });
      const cookies3 = await chrome.cookies.getAll({ domain: 'www.xiaohongshu.com' });
      const cookies4 = await chrome.cookies.getAll({ domain: 'edith.xiaohongshu.com' });
      
      // 合并去重
      const cookieMap = new Map();
      for (const c of [...cookies1, ...cookies2, ...cookies3, ...cookies4]) {
        cookieMap.set(c.name, c.value);
      }

      statusEl.textContent = '⏳ 检测到 ' + cookieMap.size + ' 个 cookie，正在验证...';

      if (!cookieMap.has('a1')) {
        statusEl.className = 'status error';
        statusEl.textContent = '❌ 未检测到 a1 cookie，请先在浏览器中登录 www.xiaohongshu.com';
        btnEl.disabled = false;
        return;
      }

      // 拼接为 cookie 字符串
      const cookieString = Array.from(cookieMap.entries())
        .map(function(entry) { return entry[0] + '=' + entry[1]; })
        .join('; ');

      statusEl.textContent = '⏳ 正在验证账号（可能需要几秒）...';

      // 发送到后端验证
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookieString: cookieString }),
      });

      const data = await res.json();

      if (data.success) {
        statusEl.className = 'status success';
        statusEl.innerHTML = '✅ 绑定成功！<br>账号：<strong>' + data.data.userInfo.nickname + '</strong><br>粉丝：' + data.data.userInfo.fansCount;
        btnEl.textContent = '✅ 已绑定';

        // 通知智店AI网页
        try {
          const tabs = await chrome.tabs.query({ url: 'https://ai-agent-ops.vercel.app/*' });
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'XHS_BIND_SUCCESS',
              data: data.data,
            }).catch(function() {});
          }
        } catch(e) {
          // 忽略通知错误
        }
      } else {
        statusEl.className = 'status error';
        statusEl.textContent = '❌ ' + (data.error || '绑定失败');
        btnEl.disabled = false;
      }
    } catch (err) {
      statusEl.className = 'status error';
      statusEl.textContent = '❌ 网络错误：' + err.message;
      btnEl.disabled = false;
    }
  });
});
