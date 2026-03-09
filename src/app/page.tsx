'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const router = useRouter()

  const sendCode = () => { setSent(true) }
  const login = () => { router.push('/dashboard') }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">智店AI</h1>
          <p className="text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            本地生活AI Agent运营系统
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="请输入手机号"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="请输入验证码"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              />
              <button
                onClick={sendCode}
                disabled={sent}
                className="px-4 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition disabled:opacity-50 whitespace-nowrap"
              >
                {sent ? '已发送' : '获取验证码'}
              </button>
            </div>
          </div>

          <button
            onClick={login}
            className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition mt-2"
          >
            登录
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          登录即表示同意《服务协议》和《隐私政策》
        </p>
      </div>
    </div>
  )
}
