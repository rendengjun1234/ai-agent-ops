document.getElementById('btn').addEventListener('click', async () => {
  const msg = document.getElementById('msg');
  const btn = document.getElementById('btn');
  btn.disabled = true;
  msg.textContent = '⏳ 获取cookie中...';
  msg.style.background = '#fefce8';

  try {
    const all = await chrome.cookies.getAll({ domain: '.xiaohongshu.com' });
    msg.textContent = '⏳ 获取到 ' + all.length + ' 个cookie，验证中...';

    const cookieStr = all.map(c => c.name + '=' + c.value).join('; ');
    const hasA1 = all.some(c => c.name === 'a1');

    if (!hasA1) {
      msg.textContent = '❌ 没有a1，请先登录 www.xiaohongshu.com';
      msg.style.background = '#fef2f2';
      btn.disabled = false;
      return;
    }

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
