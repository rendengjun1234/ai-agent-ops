'use client'
import { useState } from 'react'
import { X, Loader2, Upload, Image, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'

interface PublishNoteModalProps {
  open: boolean
  onClose: () => void
  account: { cookies: any[]; userInfo: { nickname: string; avatar: string } } | null
}

export default function PublishNoteModal({ open, onClose, account }: PublishNoteModalProps) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [topics, setTopics] = useState('')
  const [visibility, setVisibility] = useState<0 | 1>(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; shareLink?: string; error?: string } | null>(null)

  if (!open || !account) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  const handlePublish = async () => {
    setLoading(true)
    setResult(null)

    try {
      const topicList = topics
        .split(/[,，]/)
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean)
        .map((t, i) => ({ topicId: `topic_${i}`, topicName: t }))

      const res = await fetch('/api/xhs/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookies: account.cookies,
          params: {
            title,
            desc,
            images,
            topics: topicList.length > 0 ? topicList : undefined,
            visibility,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setResult({ success: false, error: data.error })
      } else {
        setResult({ success: true, shareLink: data.data.shareLink })
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold">发布小红书笔记</h2>
            <p className="text-xs text-gray-400 mt-0.5">账号：{account.userInfo.nickname}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 标题 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">标题 *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="输入笔记标题（建议20字以内）"
              maxLength={40}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/40</p>
          </div>

          {/* 正文 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">正文</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="写点什么..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>

          {/* 图片上传 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">图片 * （至少1张）</label>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center text-xs"
                  >×</button>
                </div>
              ))}
              {images.length < 9 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-300 transition">
                  <Upload className="w-6 h-6 text-gray-300" />
                  <span className="text-xs text-gray-400 mt-1">上传</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{images.length}/9 张</p>
          </div>

          {/* 话题 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">话题标签</label>
            <input
              value={topics}
              onChange={e => setTopics(e.target.value)}
              placeholder="用逗号分隔，如：美食探店, 武汉美食"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* 可见性 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">可见范围</label>
            <div className="flex gap-3">
              {[
                { value: 0 as const, label: '公开' },
                { value: 1 as const, label: '私密' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setVisibility(opt.value)}
                  className={`px-4 py-2 text-sm rounded-lg border ${visibility === opt.value ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 结果 */}
          {result && (
            <div className={`p-4 rounded-lg flex items-start gap-2 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              {result.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700">发布成功！</p>
                    {result.shareLink && (
                      <a href={result.shareLink} target="_blank" className="text-xs text-green-600 underline mt-1 block">
                        查看笔记 →
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{result.error}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            取消
          </button>
          <button
            onClick={handlePublish}
            disabled={loading || !title.trim() || images.length === 0}
            className="px-6 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? '发布中...' : '发布笔记'}
          </button>
        </div>
      </div>
    </div>
  )
}
