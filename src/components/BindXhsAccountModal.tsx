'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, Loader2, CheckCircle, AlertCircle, BookOpen, ExternalLink, Sparkles } from 'lucide-react'

interface BindXhsAccountModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (account: { cookies: any[]; userInfo: any }) => void
}

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : ''

// 生成 bookmarklet 代码
function getBookmarkletCode(siteUrl: string) {
  // 这段代码会在小红书页面上执行，提取 cookie 并发送到我们的 API
  const code = `
    javascript:void((function(){
      var c=document.cookie;
      if(c.indexOf('a1=')===-1){alert('请先登录小红书！');return;}
      var x=new XMLHttpRequest();
      x.open('POST','${siteUrl}/api/xhs/callback');
      x.setRequestHeader('Content-Type','application/json');
      x.onload=function(){
        var r=JSON.parse(x.responseText);
        if(r.success){
          localStorage.setItem('xhs_bind_result',JSON.stringify(r.data));
          alert('✅ 绑定成功！账号：'+r.data.userInfo.nickname+'\\n请回到智店AI页面');
        }else{
          alert('❌ 绑定失败：'+r.error);
        }
      };
      x.onerror=function(){alert('❌ 网络错误，请重试');};
      x.send(JSON.stringify({cookieString:c}));
    })())
  `.replace(/\s+/g, ' ').trim()
  return code
}

export default function BindXhsAccountModal({ open, onClose, onSuccess }: BindXhsAccountModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'guide' | 'waiting' | 'manual'>('guide')
  const [cookieStr, setCookieStr] = useState('')

  // 监听 localStorage 变化（bookmarklet 绑定成功后会写入）
  const checkBindResult = useCallback(() => {
    const result = localStorage.getItem('xhs_bind_result')
    if (result) {
      try {
        const data = JSON.parse(result)
        localStorage.removeItem('xhs_bind_result')
        onSuccess({ cookies: data.cookies, userInfo: data.userInfo })
        onClose()
      } catch {}
    }
  }, [onSuccess, onClose])

  useEffect(() => {
    if (!open) return
    // 轮询检查 localStorage
    const interval = setInterval(checkBindResult, 1000)
    // 也监听 storage 事件
    window.addEventListener('storage', checkBindResult)
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', checkBindResult)
    }
  }, [open, checkBindResult])

  if (!open) return null

  const bookmarkletCode = getBookmarkletCode(SITE_URL)

  const handleManualSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const cookies = cookieStr
        .split(';')
        .map(c => c.trim())
        .filter(Boolean)
        .map(c => {
          const idx = c.indexOf('=')
          return { name: c.slice(0, idx).trim(), value: c.slice(idx + 1).trim() }
        })

      const res = await fetch('/api/xhs/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookies }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || '验证失败'); return }
      onSuccess({ cookies, userInfo: data.data })
      onClose()
    } catch (err: any) {
      setError(err.message || '网络异常')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">绑定小红书账号</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {step === 'guide' && (
            <>
              {/* 一键绑定方案 */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  一键绑定（推荐）
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-gray-800">拖拽下方按钮到书签栏</p>
                      <div className="mt-2">
                        <a
                          href={bookmarkletCode}
                          onClick={e => e.preventDefault()}
                          onDragStart={() => {}}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition"
                        >
                          <BookOpen className="w-4 h-4" />
                          📕 绑定小红书
                        </a>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">* 拖到浏览器书签栏即可</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium text-gray-800">打开小红书并登录</p>
                      <a
                        href="https://www.xiaohongshu.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-red-500 hover:underline mt-1"
                      >
                        打开小红书 <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <p className="font-medium text-gray-800">登录成功后，点击书签栏的「📕 绑定小红书」</p>
                  </div>
                </div>
              </div>

              {/* 等待提示 */}
              <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm text-blue-700">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                正在等待绑定... 完成后会自动检测
              </div>

              {/* 手动方式入口 */}
              <button
                onClick={() => setStep('manual')}
                className="text-xs text-gray-400 hover:text-gray-600 w-full text-center"
              >
                或者手动粘贴 Cookie →
              </button>
            </>
          )}

          {step === 'manual' && (
            <>
              <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-700 space-y-2">
                <p className="font-medium">📕 如何获取小红书 Cookie：</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>打开 <a href="https://creator.xiaohongshu.com" target="_blank" className="underline">creator.xiaohongshu.com</a> 并登录</li>
                  <li>按 F12 → Console → 输入 <code className="bg-amber-100 px-1 rounded">document.cookie</code></li>
                  <li>复制结果粘贴到下方</li>
                </ol>
              </div>

              <textarea
                value={cookieStr}
                onChange={e => setCookieStr(e.target.value)}
                placeholder="a1=xxx; web_session=xxx; ..."
                rows={5}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none font-mono"
              />

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep('guide')} className="text-sm text-gray-500 hover:text-gray-700">
                  ← 返回一键绑定
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={loading || !cookieStr.trim()}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {loading ? '验证中...' : '验证并绑定'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
