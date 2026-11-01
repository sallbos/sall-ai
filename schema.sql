-- MR.SALL AI — Cloudflare D1 Database Schema
-- Production-Ready SQLite Schema for Cloudflare D1

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'premium'
    avatar_url TEXT,
    language_pref TEXT NOT NULL DEFAULT 'en', -- 'en' | 'ar' | 'fr'
    theme_pref TEXT NOT NULL DEFAULT 'light', -- 'light' | 'dark'
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- 3. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    is_favorite INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_fav ON conversations(user_id, is_favorite);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender TEXT NOT NULL, -- 'user' | 'assistant' | 'system'
    content TEXT NOT NULL,
    attachments_json TEXT, -- JSON array of file metadata / R2 keys
    tokens_count INTEGER DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);

-- 5. Tool History Table
CREATE TABLE IF NOT EXISTS tool_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    tool_category TEXT NOT NULL, -- 'writing' | 'image' | 'dev' | 'cyber' | 'translation'
    input_snippet TEXT,
    output_snippet TEXT,
    metadata_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tool_history_user ON tool_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_history_cat ON tool_history(user_id, tool_category);

-- 6. Usage Quotas & Tracking Table (Server-side enforcement)
CREATE TABLE IF NOT EXISTS usage_quotas (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date_stamp TEXT NOT NULL, -- Format: YYYY-MM-DD
    ai_messages_count INTEGER NOT NULL DEFAULT 0,
    image_ops_count INTEGER NOT NULL DEFAULT 0,
    dev_ops_count INTEGER NOT NULL DEFAULT 0,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    last_reset_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date_stamp),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage_quotas(user_id, date_stamp);

-- 7. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL, -- 'free' | 'premium_monthly' | 'premium_annual'
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'past_due'
    current_period_start DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_period_end DATETIME,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- 8. Bookmarks & Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    item_type TEXT NOT NULL, -- 'prompt' | 'snippet' | 'message' | 'tool_output'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);

-- 9. System Logs Table (for Admin Monitoring)
CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info', -- 'info' | 'warn' | 'error'
    message TEXT NOT NULL,
    user_id TEXT,
    metadata_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_logs_severity ON system_logs(severity);
CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at);
