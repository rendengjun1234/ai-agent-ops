// Sync service - using better-sqlite3
import { getDb, genId, PLATFORM_DISPLAY } from './db'
import { platformStore } from './store/platform-store'

export async function syncReviewsForAccount(accountId: string) {
  const db = getDb()
  const account = db.prepare('SELECT * FROM platform_accounts WHERE id = ? AND status = ?').get(accountId, 'active') as any
  if (!account) return

  const taskId = genId()
  db.prepare('INSERT INTO sync_tasks (id, platform, account_id, task_type, status, started_at) VALUES (?,?,?,?,?,?)').run(
    taskId, account.platform, account.id, 'reviews', 'running', new Date().toISOString()
  )

  try {
    // TODO: Use real platform service to fetch reviews
    // For now just mark as completed
    db.prepare('UPDATE sync_tasks SET status = ?, completed_at = ? WHERE id = ?').run('completed', new Date().toISOString(), taskId)
    db.prepare('UPDATE platform_accounts SET last_sync_at = ? WHERE id = ?').run(new Date().toISOString(), accountId)
  } catch (err: any) {
    db.prepare('UPDATE sync_tasks SET status = ?, error = ? WHERE id = ?').run('failed', err.message, taskId)
  }
}

export async function syncAllAccounts() {
  const accounts = platformStore.getAccounts().filter(a => a.status === 'active')
  for (const account of accounts) {
    await syncReviewsForAccount(account.id)
  }
}
