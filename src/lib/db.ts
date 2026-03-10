import Database from 'better-sqlite3'
import path from 'node:path'

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(dbPath)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initTables(_db)
  }
  return _db
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS platform_accounts (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      account_id TEXT NOT NULL,
      account_name TEXT NOT NULL,
      cookies TEXT DEFAULT '{}',
      status TEXT DEFAULT 'active',
      bind_time TEXT DEFAULT (datetime('now')),
      last_sync_at TEXT,
      UNIQUE(platform, account_id)
    );

    CREATE TABLE IF NOT EXISTS shops (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL,
      shop_name TEXT NOT NULL,
      platform TEXT NOT NULL,
      address TEXT,
      rating REAL,
      account_id TEXT NOT NULL,
      UNIQUE(platform, shop_id),
      FOREIGN KEY (account_id) REFERENCES platform_accounts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      review_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      shop_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      content TEXT NOT NULL,
      images TEXT,
      has_video INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      reply TEXT,
      replied_at TEXT,
      synced_at TEXT DEFAULT (datetime('now')),
      ai_tags TEXT,
      risk_level TEXT,
      ai_summary TEXT,
      ai_reply TEXT,
      root_cause TEXT,
      mentioned_dish TEXT,
      mentioned_staff TEXT,
      mentioned_period TEXT,
      status TEXT DEFAULT 'pending',
      assignee TEXT,
      is_high_value INTEGER DEFAULT 0,
      linked_task_id TEXT,
      UNIQUE(platform, review_id),
      FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS remediation_tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      source_review_count INTEGER DEFAULT 0,
      stores TEXT,
      risk_level TEXT NOT NULL,
      assignee TEXT NOT NULL,
      deadline TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      suggested_action TEXT NOT NULL,
      period TEXT,
      staff TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      resolved_at TEXT,
      score_impact TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_tasks (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      account_id TEXT NOT NULL,
      task_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      started_at TEXT,
      completed_at TEXT,
      error TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)
}

// Helper: generate cuid-like id
export function genId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Platform display mappings
export const PLATFORM_DISPLAY: Record<string, string> = {
  meituan: '美团', dianping: '大众点评', douyin: '抖音', xhs: '小红书', eleme: '饿了么',
}
export const PLATFORM_ICON: Record<string, string> = {
  meituan: '🟠', dianping: '🔴', douyin: '⬛', xhs: '📕', eleme: '🔵',
}
export const PLATFORM_KEY: Record<string, string> = {
  '美团': 'meituan', '大众点评': 'dianping', '抖音': 'douyin', '小红书': 'xhs', '饿了么': 'eleme',
}
