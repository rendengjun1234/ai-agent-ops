document.getElementById('btn').addEventListener('click', async () => {
  const msg = document.getElementById('msg');
  const btn = document.getElementById('btn');
  btn.disabled = true;
  msg.textContent = '⏳ 获取cookie中...';
  msg.style.background = '#fefce8';

  try {
    // 用多种方式获取cookie，确保不遗漏
    const all1 = await chrome.cookies.getAll({ domain: '.xiaohongshu.com' });
    const all2 = await chrome.cookies.getAll({ domain: 'xiaohongshu.com' });
    const all3 = await chrome.cookies.getAll({ domain: 'www.xiaohongshu.com' });
    const all4 = await chrome.cookies.getAll({ domain: 'edith.xiaohongshu.com' });
    const all5 = await chrome.cookies.getAll({ domain: 'creator.xiaohongshu.com' });
    const all6 = await chrome.cookies.getAll({ url: 'https://www.xiaohongshu.com' });
    const all7 = await chrome.cookies.getAll({ url: 'https://edith.xiaohongshu.com' });

    // 合并去重
    const cookieMap = new Map();
    for (const c of [...all1, ...all2, ...all3, ...all4, ...all5, ...all6, ...all7]) {
      cookieMap.set(c.name, c.value);
    }

    // 调试：显示所有cookie名
    const names = Array.from(cookieMap.keys()).join(', ');
    msg.textContent = '⏳ 获取到 ' + cookieMap.size + ' 个cookie: ' + names.substring(0, 200);

    if (!cookieMap.has('a1')) {
      msg.textContent = '❌ 没有a1。所有cookie: ' + names;
      msg.style.background = '#fef2f2';
      btn.disabled = false;
      return;
    }

    const cookieStr = Array.from(cookieMap.entries()).map(e => e[0] + '=' + e[1]).join('; ');

    msg.textContent = '⏳ 有a1，正在验证账号...';

    const res = await fetch('https://ai-agent-ops.vercel.app/api/xhs/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookieString: cookieStr })
    });
    const data = await res.json();

    if (data.success) {
      msg.innerHTML = '✅ 绑定成功！<br>账号：' + data.data.userInfo.nickname + '<br>粉丝：' + data.data.userInfo.fansCount;
      msg.style.background = '#f0fdf4';
      btn.textContent = '✅ 已绑定';
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
