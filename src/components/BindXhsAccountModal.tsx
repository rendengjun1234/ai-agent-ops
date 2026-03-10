'use client'
import { useState } from 'react'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface BindXhsAccountModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (account: { cookies: any[]; userInfo: any }) => void
}

export default function BindXhsAccountModal({ open, onClose, onSuccess }: BindXhsAccountModalProps) {
  const [cookieStr, setCookieStr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      // 解析 cookie 字符串为数组
      const cookies = cookieStr
        .split(';')
        .map(c => c.trim())
        .filter(Boolean)
        .map(c => {
          const [name, ...rest] = c.split('=')
          return { name: name.trim(), value: rest.join('=').trim() }
        })

      if (!cookies.find(c => c.name === 'a1')) {
        setError('Cookie 中缺少 a1 字段，请确保复制了完整的 Cookie')
        setLoading(false)
        return
      }

      const res = await fetch('/api/xhs/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookies }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '验证失败')
        setLoading(false)
        return
      }

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
          <div className="p-4 bg-amber-50 rounded-lg text-sm text-amber-700 space-y-2">
            <p className="font-medium">📕 如何获取小红书 Cookie：</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>打开 <a href="https://creator.xiaohongshu.com" target="_blank" className="underline">creator.xiaohongshu.com</a> 并登录</li>
              <li>按 F12 打开开发者工具 → Application → Cookies</li>
              <li>复制所有 Cookie（或按 F12 → Console 输入 <code className="bg-amber-100 px-1 rounded">document.cookie</code>）</li>
              <li>粘贴到下方输入框</li>
            </ol>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Cookie 字符串</label>
            <textarea
              value={cookieStr}
              onChange={e => setCookieStr(e.target.value)}
              placeholder="a1=xxx; web_session=xxx; ..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !cookieStr.trim()}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {loading ? '验证中...' : '验证并绑定'}
          </button>
        </div>
      </div>
    </div>
  )
}
