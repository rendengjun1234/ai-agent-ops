// 监听来自扩展 popup 的消息，转发给网页
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'XHS_BIND_SUCCESS') {
    window.postMessage({ type: 'XHS_BIND_SUCCESS', data: message.data }, '*')
  }
})
