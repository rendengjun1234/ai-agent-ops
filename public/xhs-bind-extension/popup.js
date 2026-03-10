document.getElementById('btn').addEventListener('click', async () => {
  const msg = document.getElementById('msg');
  const btn = document.getElementById('btn');
  btn.disabled = true;
  msg.textContent = '⏳ 获取cookie中...';
  msg.style.background = '#fefce8';

  try {
    const all = await chrome.cookies.getAll({ url: 'https://www.xiaohongshu.com' });

    if (!all.some(c => c.name === 'a1')) {
      msg.textContent = '❌ 没有a1，请先登录 www.xiaohongshu.com';
      msg.style.background = '#fef2f2';
      btn.disabled = false;
      return;
    }

    const cookieStr = all.map(c => c.name + '=' + c.value).join('; ');
    msg.textContent = '⏳ 正在验证账号...';

    // 从 localStorage 获取 bindToken（网页端生成的），或用时间戳
    let bindToken = '';
    try {
      const tabs = await chrome.tabs.query({ url: 'https://ai-agent-ops.vercel.app/*' });
      if (tabs.length > 0) {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => localStorage.getItem('xhs_bind_token') || ''
        });
        bindToken = result[0]?.result || '';
      }
    } catch(e) {}

    if (!bindToken) {
      bindToken = 'bind_' + Date.now();
    }

    const res = await fetch('https://ai-agent-ops.vercel.app/api/xhs/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookieString: cookieStr, bindToken: bindToken })
    });
    const data = await res.json();

    if (data.success) {
      msg.innerHTML = '✅ 绑定成功！<br>账号：' + data.data.userInfo.nickname + '<br>粉丝：' + data.data.userInfo.fansCount + '<br><br><span style="font-size:11px;color:#666">页面将自动刷新...</span>';
      msg.style.background = '#f0fdf4';
      btn.textContent = '✅ 已绑定';

      // 通知网页刷新
      try {
        const tabs = await chrome.tabs.query({ url: 'https://ai-agent-ops.vercel.app/*' });
        for (const tab of tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (token, d) => {
              localStorage.setItem('xhs_bind_result', JSON.stringify(d));
              window.dispatchEvent(new Event('storage'));
            },
            args: [bindToken, data.data]
          }).catch(() => {});
        }
      } catch(e) {}
    } else {
      msg.textContent = '❌ ' + (data.error || '失败');
      msg.style.background = '#fef2f2';
      btn.disabled = false;
    }
  } catch(e) {
    msg.textContent = '❌ 错误: ' + e.message;
    msg.style.background = '#fef2f2';
    btn.disabled = false;
  }
});
