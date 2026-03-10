const PLATFORMS = {
  xiaohongshu: {
    label: '小红书',
    url: 'https://www.xiaohongshu.com',
    cookieCheck: 'a1',
    loginHint: 'www.xiaohongshu.com'
  },
  douyin: {
    label: '抖音',
    url: 'https://creator.douyin.com',
    cookieCheck: 'sessionid',
    loginHint: 'creator.douyin.com'
  },
  kwai: {
    label: '快手',
    url: 'https://cp.kuaishou.com',
    cookieCheck: 'passToken',
    loginHint: 'cp.kuaishou.com'
  },
  wxsph: {
    label: '视频号',
    url: 'https://channels.weixin.qq.com',
    cookieCheck: 'sessionid',
    loginHint: 'channels.weixin.qq.com'
  }
};

let selectedPlatform = 'xiaohongshu';

document.addEventListener('DOMContentLoaded', () => {
  // 平台选择
  document.querySelectorAll('.plat button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plat button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPlatform = btn.dataset.plat;
      document.getElementById('msg').textContent = '已选择: ' + PLATFORMS[selectedPlatform].label;
    });
  });

  // 绑定按钮
  document.getElementById('btn').addEventListener('click', async () => {
    const msg = document.getElementById('msg');
    const btn = document.getElementById('btn');
    const plat = PLATFORMS[selectedPlatform];
    btn.disabled = true;
    msg.textContent = '⏳ 获取' + plat.label + ' cookie...';
    msg.style.background = '#fefce8';

    try {
      const all = await chrome.cookies.getAll({ url: plat.url });

      if (all.length === 0) {
        msg.textContent = '❌ 没有cookie，请先登录 ' + plat.loginHint;
        msg.style.background = '#fef2f2';
        btn.disabled = false;
        return;
      }

      const names = all.map(c => c.name);
      msg.textContent = '⏳ 获取到 ' + all.length + ' 个cookie，验证中...';

      if (!names.includes(plat.cookieCheck)) {
        msg.textContent = '❌ 缺少 ' + plat.cookieCheck + '，请重新登录 ' + plat.loginHint;
        msg.style.background = '#fef2f2';
        btn.disabled = false;
        return;
      }

      const cookieStr = all.map(c => c.name + '=' + c.value).join('; ');

      const res = await fetch('https://ai-agent-ops.vercel.app/api/xhs/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookieString: cookieStr,
          platform: selectedPlatform
        })
      });
      const data = await res.json();

      if (data.success) {
        msg.innerHTML = '✅ 绑定成功！<br>账号：' + data.data.userInfo.nickname + '<br>粉丝：' + data.data.userInfo.fansCount;
        msg.style.background = '#f0fdf4';
        btn.textContent = '✅ 已绑定';

        // 通知网页
        try {
          const tabs = await chrome.tabs.query({ url: 'https://ai-agent-ops.vercel.app/*' });
          for (const tab of tabs) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: (d, p) => {
                localStorage.setItem('xhs_bind_result', JSON.stringify({ ...d, platform: p }));
                window.dispatchEvent(new Event('storage'));
              },
              args: [data.data, selectedPlatform]
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
});
