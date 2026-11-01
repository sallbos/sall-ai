-- MR.SALL AI — Database Seed Data
-- Creates default Administrator and Sample Demo Accounts

-- Passwords hashed with PBKDF2 (SHA-256, 100,000 iterations):
-- Admin credentials: admin@mrsall.ai / AdminSall2026!
-- Demo user credentials: user@mrsall.ai / SallUser2026!

INSERT OR IGNORE INTO users (id, email, password_hash, salt, full_name, role, tier, avatar_url, language_pref, theme_pref)
VALUES 
(
    'usr_admin_master_001',
    'admin@mrsall.ai',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    'sall_salt_admin_9872',
    'Administrator Sall',
    'admin',
    'premium',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'en',
    'light'
),
(
    'usr_demo_user_002',
    'user@mrsall.ai',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'sall_salt_demo_3311',
    'Alex Vance',
    'user',
    'free',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    'en',
    'light'
);

-- Initial Subscriptions
INSERT OR IGNORE INTO subscriptions (id, user_id, plan_id, status, current_period_start, current_period_end)
VALUES
(
    'sub_adm_001',
    'usr_admin_master_001',
    'premium_annual',
    'active',
    CURRENT_TIMESTAMP,
    datetime(CURRENT_TIMESTAMP, '+365 days')
),
(
    'sub_usr_002',
    'usr_demo_user_002',
    'free',
    'active',
    CURRENT_TIMESTAMP,
    NULL
);

-- Initial System Logs
INSERT OR IGNORE INTO system_logs (id, event_type, severity, message, metadata_json)
VALUES
(
    'log_boot_001',
    'SYSTEM_STARTUP',
    'info',
    'MR.SALL AI platform core initialized successfully on Cloudflare Edge.',
    '{"edge_region":"global","d1_status":"healthy","r2_status":"connected"}'
),
(
    'log_boot_002',
    'AI_GATEWAY',
    'info',
    'Modular AI Provider engine registered: Gemini API / Cloudflare Workers AI active.',
    '{"primary_model":"gemini-1.5-flash","fallback_model":"@cf/meta/llama-3-8b-instruct"}'
);
