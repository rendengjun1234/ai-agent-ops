document.getElementById('btn').addEventListener('click', async () => {
  const msg = document.getElementById('msg');
  const btn = document.getElementById('btn');
  btn.disabled = true;
  msg.textContent = '⏳ 获取cookie中...';
  msg.style.background = '#fefce8';

  try {
    // 只用 url 方式获取（最可靠）
    const all = await chrome.cookies.getAll({ url: 'https://www.xiaohongshu.com' });

    const names = all.map(c => c.name).join(', ');
    msg.textContent = '获取到 ' + all.length + ' 个: ' + names.substring(0, 300);

    // 等2秒让用户看到
    await new Promise(r => setTimeout(r, 2000));

    if (!all.some(c => c.name === 'a1')) {
      msg.textContent = '❌ 没有a1。共' + all.length + '个cookie: ' + names;
      msg.style.background = '#fef2f2';
      btn.disabled = false;
      return;
    }

    const cookieStr = all.map(c => c.name + '=' + c.value).join('; ');
    msg.textContent = '⏳ 有a1，正在验证...';

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
