import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '智店AI - 本地生活AI Agent运营系统',
  description: '给每一家本地服务商一个永不下班的AI运营团队',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
