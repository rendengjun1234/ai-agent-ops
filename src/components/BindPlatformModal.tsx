'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { PLATFORM_CONFIG, PlatformType, PlatformShop } from '@/lib/platform-service'
import { Chrome, ClipboardPaste, Loader2, CheckCircle2, XCircle, Store } from 'lucide-react'

type BindStatus = 'idle' | 'validating' | 'success' | 'error'

interface BindResult {
  accountId: string
  accountName: string
  shops: PlatformShop[]
}

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: (platform: PlatformType, result: BindResult) => void
}

const SUPPORTED_PLATFORMS: PlatformType[] = ['meituan', 'eleme', 'douyin', 'xhs']

export default function BindPlatformModal({ open, onClose, onSuccess }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | null>(null)
  const [cookieInput, setCookieInput] = useState('')
  const [status, setStatus] = useState<BindStatus>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<BindResult | null>(null)

  const reset = () => {
    setSelectedPlatform(null)
    setCookieInput('')
    setStatus('idle')
    setError('')
    setResult(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleBind = async () => {
    if (!selectedPlatform || !cookieInput.trim()) return

    setStatus('validating')
    setError('')

    try {
      const res = await fetch('/api/platform/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: selectedPlatform, cookieString: cookieInput.trim() }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setResult(data.data)
        onSuccess?.(selectedPlatform, data.data)
      } else {
        setStatus('error')
        setError(data.error || '绑定失败')
      }
    } catch (err: any) {
      setStatus('error')
      setError(err.message || '网络错误')
    }
  }

  const config = selectedPlatform ? PLATFORM_CONFIG[selectedPlatform] : null

  return (
    <Modal open={open} onClose={handleClose} title="绑定平台账号">
      <div className="space-y-5">
        {/* 平台选择 */}
        {!selectedPlatform && (
          <div>
            <p className="text-sm text-gray-500 mb-3">选择要绑定的平台：</p>
            <div className="grid grid-cols-2 gap-3">
              {SUPPORTED_PLATFORMS.map(p => {
                const c = PLATFORM_CONFIG[p]
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition text-left"
                  >
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 绑定流程 */}
        {selectedPlatform && status !== 'success' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{config?.icon}</span>
              <h4 className="font-medium text-gray-900">绑定 {config?.name}</h4>
              <button onClick={reset} className="ml-auto text-xs text-gray-400 hover:text-gray-600">切换平台</button>
            </div>

            {/* 方式1: 扩展 */}
            <div className="p-4 bg-blue-50 rounded-xl mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Chrome className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-800">方式一：浏览器扩展（推荐）</p>
              </div>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4">
                <li>下载并安装「多平台商家绑定助手」扩展</li>
                <li>打开 {config?.name} 商家后台并登录</li>
                <li>点击扩展图标，一键绑定</li>
              </ol>
              <a href="/platform-bind-extension" target="_blank" className="inline-block mt-2 text-xs text-blue-600 underline">
                下载扩展 →
              </a>
            </div>

            {/* 方式2: 手动粘贴 */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardPaste className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">方式二：手动粘贴Cookie</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                登录 {config?.domains.join(' 或 ')}，按F12打开开发者工具，在Console输入 document.cookie 复制结果
              </p>
              <textarea
                value={cookieInput}
                onChange={e => setCookieInput(e.target.value)}
                placeholder="粘贴Cookie字符串..."
                className="w-full h-24 px-3 py-2 text-xs border border-gray-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                onClick={handleBind}
                disabled={!cookieInput.trim() || status === 'validating'}
                className="mt-2 w-full py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'validating' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />验证中...</>
                ) : '验证并绑定'}
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg mt-3">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* 绑定成功 */}
        {status === 'success' && result && (
          <div>
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <h4 className="font-medium">绑定成功！</h4>
            </div>
            <div className="p-4 bg-green-50 rounded-xl space-y-2">
              <p className="text-sm"><span className="text-gray-500">平台：</span>{config?.icon} {config?.name}</p>
              <p className="text-sm"><span className="text-gray-500">账号：</span>{result.accountName}</p>
              <p className="text-sm"><span className="text-gray-500">门店数：</span>{result.shops.length}</p>
            </div>
            {result.shops.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">获取到的门店：</p>
                {result.shops.map(shop => (
                  <div key={shop.shopId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Store className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{shop.shopName}</p>
                      <p className="text-xs text-gray-500">{shop.address} {shop.rating ? `· ${shop.rating}分` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={handleClose} className="mt-4 w-full py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
              完成
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
