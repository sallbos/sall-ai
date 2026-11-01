# MR.SALL AI — Cloudflare Deployment Guide

This guide walks you through deploying **MR.SALL AI** to Cloudflare Pages (frontend) and Cloudflare Workers (backend) with Cloudflare D1 (database) and R2 (storage).

---

## Prerequisites

1. A [Cloudflare Account](https://dash.cloudflare.com/)
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed:
   ```bash
   npm install -g wrangler
   ```
3. A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

---

## Step 1: Login to Cloudflare

```bash
wrangler login
```

---

## Step 2: Create Cloudflare D1 Database

```bash
wrangler d1 create mrsall-ai-d1
```
Copy the output `database_id` and update `configuration/wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "mrsall-ai-d1"
database_id = "YOUR_DATABASE_ID_HERE"
```

Apply database schema and seeds:
```bash
wrangler d1 execute mrsall-ai-d1 --file=database/schema.sql
wrangler d1 execute mrsall-ai-d1 --file=database/seed.sql
```

---

## Step 3: Create Cloudflare R2 Storage Bucket

```bash
wrangler r2 bucket create mrsall-ai-storage
```

---

## Step 4: Configure Production Secrets

Set the Google Gemini API key and secrets on your Worker:
```bash
wrangler secret put GEMINI_API_KEY
# Enter your Google Gemini key when prompted

wrangler secret put JWT_SECRET
# Enter a secure random string for JWT signing
```

---

## Step 5: Deploy the Backend Worker

```bash
wrangler deploy --config configuration/wrangler.toml
```

---

## Step 6: Deploy Frontend to Cloudflare Pages

### Option A: Using Wrangler Direct Upload
```bash
wrangler pages deploy frontend --project-name mrsall-ai
```

### Option B: Using Cloudflare Pages Git Integration
1. Connect your GitHub/GitLab repository to Cloudflare Pages.
2. Set Build Settings:
   - **Framework preset**: None
   - **Build command**: (Leave empty)
   - **Build output directory**: `frontend`
3. Click **Deploy**.

---

## Verification Checklist

- [x] New MR.SALL AI logo is displayed crisp and proportionally in the sidebar, chat greeting, assistant bubbles, and favicon.
- [x] Language switcher activates English (LTR), Arabic (RTL), and French (LTR).
- [x] AI Chat connects to Google Gemini API with streaming responses.
- [x] Image Studio performs real-time client-side transformations, before/after comparisons, and downloads.
- [x] Developer tools format and validate code.
- [x] Cybersecurity tools calculate accurate Shannon entropy and hashes.
- [x] Admin dashboard displays telemetry and user tier controls.
