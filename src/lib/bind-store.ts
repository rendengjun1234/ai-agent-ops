// 简单内存存储 (MVP)
const store = (globalThis as any).__xhsBoundStore || ((globalThis as any).__xhsBoundStore = new Map<string, any>())

export function setBound(token: string, data: any) {
  store.set(token, { data, ts: Date.now() })
  setTimeout(() => store.delete(token), 5 * 60 * 1000)
}

export function getBound(token: string) {
  const entry = store.get(token)
  if (entry) {
    store.delete(token)
    return entry.data
  }
  return null
}
