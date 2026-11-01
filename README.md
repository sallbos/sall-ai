# MR.SALL AI — All-In-One AI SaaS Platform
> **Intelligence Without Limits**

MR.SALL AI is a production-oriented, full-stack AI SaaS platform built with an Apple-inspired clean aesthetic. It integrates conversational AI, professional image processing, multi-category AI writing engines, developer utilities, educational cybersecurity hardening tools, and a trilingual translation center.

![MR.SALL AI Platform](assets/logo.png)

---

## 🌟 Highlights & Architecture

- **Brand Design Philosophy**: Inspired by Apple's minimalist design language. Bright white backgrounds, soft gray surfaces, refined typography, subtle blue/purple gradients, and fluid micro-animations. Default light theme with full high-contrast dark mode.
- **Frontend**: Clean component architecture using modern vanilla HTML5, CSS3 Custom Properties, and ES6 Modules without bloat.
- **Backend**: Cloudflare Workers serverless edge execution with global Anycast routing.
- **Database**: Cloudflare D1 (serverless SQLite database) for user accounts, conversation history, and server-enforced quotas.
- **Storage**: Cloudflare R2 bucket integration for user uploads and processed assets.
- **AI Gateway**: Modular architecture natively connecting to Google Gemini API (`gemini-1.5-flash`), OpenAI API (`gpt-4o-mini`), and Cloudflare Workers AI.

---

## 🚀 Workspaces & Features

### 1. Home / AI Chat
- Multi-turn conversation engine with streaming text support.
- Centered Apple-styled message input with auto-expanding textarea.
- File and image attachment previews.
- Markdown rendering and code syntax highlighting with one-click copy.
- Prompt suggestion cards ("Write an article", "Explain a topic", "Generate code", "Translate text", "Analyze an image", "Create a prompt").
- Conversation persistence in IndexedDB / Cloudflare D1 with history drawer.

### 2. Image Studio
- HTML5 Canvas 2D image processing engine operating client-side with zero latency.
- Drag-and-drop upload zone supporting PNG, JPEG, WEBP, and SVG.
- Interactive **Before / After** comparison split slider.
- Real-time image adjustments: Brightness, Contrast, Saturation, Sharpness (3x3 Laplacian convolution kernel), Grayscale, Sepia, and Invert.
- AI Super-Resolution (2x & 4x upscale) and chroma background removal.
- Aspect ratio locking, dimensions scaling, format conversion (PNG, JPEG, WEBP), and compression quality slider.

### 3. AI Writing Studio
- 9 specialized intelligent writing engines:
  1. **AI Article Writer**: Long-form structured essays with SEO keyword targeting.
  2. **AI Essay Writer**: Academic writing with thesis formulation and citation styles (APA, MLA, IEEE, Chicago).
  3. **AI Email Writer**: Diplomatic, urgent, or executive correspondence.
  4. **AI Social Media Writer**: High-engagement posts for LinkedIn, Twitter/X, and Instagram.
  5. **AI Prompt Generator**: Production-grade system prompts for LLMs.
  6. **Text Summarizer**: Executive bullets, TL;DR, and concise abstracts.
  7. **Grammar Correction**: Stylistic enhancements and error correction.
  8. **Text Rewriter**: Tone shifting and paraphrasing.
  9. **Content Ideas Generator**: Creative campaign and article brainstorming.

### 4. Developer Tools
- **HTML Formatter & Minifier**: Code beautification and indentation.
- **CSS Formatter & Minifier**: Rule sorting and stylesheet minification.
- **JavaScript Formatter**: Clean syntax formatting.
- **JSON Formatter & Validator**: Syntax validator pinpointing exact line and column errors.
- **Code Explainer**: AI architecture breakdowns, time/space complexity (Big-O), and edge cases.
- **AI Code Assistant**: Automated bug fixing, unit test generation, and code refactoring.
- **Color Studio**: Interactive HEX/RGB/HSL picker, Apple palette swatches, and WCAG AA/AAA contrast calculation.
- **Base64 Converter**: Text and binary encoding/decoding.

### 5. Cybersecurity Tools (Safe & Educational)
- **Password Strength Analyzer**: Shannon entropy calculation, brute-force crack time estimates, and criteria checklist.
- **Secure Password Generator**: Cryptographically random generator with character set rules and ambiguous character filters.
- **Cryptographic Hash Studio**: Real-time digest calculation for SHA-256, SHA-512, SHA-384, SHA-1, and MD5 via Web Crypto API.
- **Text & Hex Encoders**: Hexadecimal, binary bytes, and URL encoding.
- **URL Inspector & Sanitizer**: Hostname, protocol, port, and malicious query payload scanner.
- **Security Learning Center**: Practical guides on Zero Trust, password managers, and OWASP defenses.
- **Cybersecurity Glossary**: Searchable dictionary with 50+ industry definitions.

### 6. Translation Center
- Trilingual translation between **English**, **Arabic**, and **French**.
- Native Right-to-Left (RTL) Arabic typography and layout mirroring.
- Audio pronunciation via browser speech synthesis.
- Auto-detection and language swapping.

### 7. Account Management & Subscription System
- User Authentication: Sign In, Sign Up, and Forgot Password modals.
- PBKDF2 password hashing and token validation.
- Free vs Premium tier usage quotas (Daily message and image limits).
- Subscription dashboard with billing frequency toggle (Monthly / Annual with 20% discount).
- Protected **Admin Dashboard** with real-time user management and Cloudflare edge health monitoring.

---

## 📁 Project Structure

```
├── assets/
│   ├── logo.png               # Brand logo
│   ├── logo.svg               # SVG asset
│   └── favicon.png            # Favicon
├── backend/
│   ├── worker.js              # Cloudflare Worker API router
│   ├── ai-service.js          # Google Gemini / OpenAI / Workers AI adapter
│   ├── auth-service.js        # Authentication and session verification
│   └── db-service.js          # Cloudflare D1 query helpers
├── components/
│   ├── header.js              # Top navigation bar
│   ├── sidebar.js             # Collapsible sidebar
│   ├── modal.js               # Auth, API key, and Upgrade modals
│   ├── toast.js               # Apple-styled toast notification stack
│   └── usage-meter.js         # Daily quota progress bar
├── configuration/
│   ├── wrangler.toml          # Cloudflare deployment configuration
│   └── .env.example           # Environment secrets template
├── database/
│   ├── schema.sql             # Cloudflare D1 SQL schema
│   └── seed.sql               # Initial administrator and demo records
├── frontend/
│   ├── index.html             # Application shell
│   ├── css/
│   │   ├── styles.css         # Apple design system
│   │   ├── responsive.css     # Mobile and tablet layouts
│   │   └── rtl.css            # Arabic RTL layout rules
│   └── js/
│       └── app.js             # Core single-page router and state coordinator
├── localization/
│   ├── en.json                # English dictionary
│   ├── ar.json                # Arabic dictionary
│   └── fr.json                # French dictionary
├── pages/
│   ├── home-chat.js           # AI Chat interface
│   ├── image-studio.js        # Image editing suite
│   ├── writing-studio.js      # 9 AI writing tools
│   ├── developer-tools.js     # Code formatters & color studio
│   ├── cyber-tools.js         # Security analyzer & glossary
│   ├── translation.js         # EN/AR/FR translation
│   ├── history.js             # Activity history & exports
│   ├── favorites.js           # Bookmarks & saved items
│   ├── settings.js            # Profile & API key management
│   ├── premium.js             # Subscription plans
│   └── admin.js               # Admin telemetry dashboard
├── services/
│   ├── api.js                 # API connector & Gemini streaming client
│   ├── crypto.js              # Web Crypto hashing & entropy
│   ├── i18n.js                # Internationalization service
│   └── storage.js             # State & quota manager
└── tools/
    ├── image-processor.js     # Canvas 2D image processing engine
    ├── formatters.js          # Code beautifiers and minifiers
    └── cyber-utils.js         # Educational cyber modules
```

---

## 🛠️ Quick Start & Local Preview

To preview the frontend locally in any modern web browser:
1. Open `frontend/index.html` directly in your browser, or serve it using any local static web server.
2. In the app, navigate to **Settings** to add your **Google Gemini API Key** (free from [Google AI Studio](https://aistudio.google.com/)). Real-time AI chat, writing, and translation will immediately become active!

## ☁️ Deploying to Cloudflare Pages & Workers

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

---
© 2026 MR.SALL AI. Intelligence Without Limits.
