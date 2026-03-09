'use client'
import { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'
interface Toast { id: number; type: ToastType; message: string }

const icons = { success: CheckCircle, error: AlertTriangle, info: Info, warning: AlertTriangle }
const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

const ToastContext = createContext<{ toast: (type: ToastType, message: string) => void }>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

let _id = 0
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++_id
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])
  const remove = (id: number) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map(t => {
          const Icon = icons[t.type]
          return (
            <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-slide-in ${colors[t.type]}`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{t.message}</span>
              <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
