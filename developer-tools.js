/**
 * MR.SALL AI — Developer Tools Suite
 * Formatters, Validators, AI Code Assistant, Color Studio, and Base64 Converter
 */

import { i18n } from '../services/i18n.js';
import { CodeFormatters } from '../tools/formatters.js';
import { CryptoService } from '../services/crypto.js';
import { api } from '../services/api.js';
import { toast } from '../components/toast.js';
import { storage } from '../services/storage.js';

export class DeveloperToolsPage {
  constructor() {
    this.activeTool = 'json';
  }

  render(container) {
    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="devTools.title">Developer Tools</h1>
          <p class="page-main-subtitle" data-i18n="devTools.subtitle">
            High-performance code formatters, validators, AI assistants, and cryptographic utilities.
          </p>
        </div>

        <!-- Dev Tools Navigation Tabs -->
        <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid var(--apple-border);">
          <button class="btn-ghost dev-tab-btn active-tab" data-dev="json">{ } JSON Studio</button>
          <button class="btn-ghost dev-tab-btn" data-dev="html">&lt;&gt; HTML Formatter</button>
          <button class="btn-ghost dev-tab-btn" data-dev="css">🎨 CSS Formatter</button>
          <button class="btn-ghost dev-tab-btn" data-dev="js">⚡ JS Formatter</button>
          <button class="btn-ghost dev-tab-btn" data-dev="explainer">🧠 Code Explainer</button>
          <button class="btn-ghost dev-tab-btn" data-dev="assistant">🤖 AI Code Assistant</button>
          <button class="btn-ghost dev-tab-btn" data-dev="color">🖌️ Color Palette & WCAG</button>
          <button class="btn-ghost dev-tab-btn" data-dev="base64">🔐 Base64 Tool</button>
        </div>

        <!-- Active Tool Container -->
        <div id="dev-tool-content" class="apple-card" style="min-height:500px;">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.renderTool(this.activeTool, container);
  }

  bindEvents(container) {
    const tabs = container.querySelectorAll('.dev-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');
        this.activeTool = tab.getAttribute('data-dev');
        this.renderTool(this.activeTool, container);
      });
    });
  }

  renderTool(tool, container) {
    const root = container.querySelector('#dev-tool-content');
    if (!root) return;

    if (['json', 'html', 'css', 'js'].includes(tool)) {
      this.renderCodeFormatter(tool, root);
    } else if (tool === 'explainer' || tool === 'assistant') {
      this.renderAiDevTool(tool, root);
    } else if (tool === 'color') {
      this.renderColorStudio(root);
    } else if (tool === 'base64') {
      this.renderBase64Tool(root);
    }
  }

  /**
   * Code Formatter View (JSON, HTML, CSS, JS)
   */
  renderCodeFormatter(type, root) {
    const labels = {
      json: 'JSON Formatter & Validator',
      html: 'HTML Formatter & Minifier',
      css: 'CSS Formatter & Beautifier',
      js: 'JavaScript Formatter'
    };

    const placeholders = {
      json: '{\n  "brand": "MR.SALL AI",\n  "status": "production",\n  "version": 2026\n}',
      html: '<div class="hero"><h1 class="title">MR.SALL AI</h1><p>Intelligence Without Limits</p></div>',
      css: '.brand { display: flex; align-items: center; background: #0071e3; color: #fff; }',
      js: 'function calculateEntropy(pwd){ let pool = 0; if(/[a-z]/.test(pwd)) pool += 26; return pwd.length * Math.log2(pool); }'
    };

    root.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:700;">${labels[type]}</h3>
        <div style="display:flex; gap:8px;">
          <button id="btn-fmt-beautify" class="btn-primary" style="font-size:12.5px; padding:6px 14px;">Beautify / Format</button>
          <button id="btn-fmt-minify" class="btn-secondary" style="font-size:12.5px; padding:6px 14px;">Minify</button>
          <button id="btn-fmt-copy" class="btn-ghost" style="font-size:12.5px;">Copy</button>
          <button id="btn-fmt-clear" class="btn-ghost" style="font-size:12.5px; color:var(--apple-red);">Clear</button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; min-height:420px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">Input Code</span>
          <textarea id="dev-input-code" style="flex:1; width:100%; font-family:var(--font-mono); font-size:13px; resize:none; padding:12px;" placeholder="${placeholders[type]}"></textarea>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">Formatted Output</span>
            <span id="dev-syntax-badge" style="font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; display:none;"></span>
          </div>
          <textarea id="dev-output-code" readonly style="flex:1; width:100%; font-family:var(--font-mono); font-size:13px; resize:none; padding:12px; background:var(--apple-surface-secondary);"></textarea>
        </div>
      </div>
    `;

    const input = root.querySelector('#dev-input-code');
    const output = root.querySelector('#dev-output-code');
    const badge = root.querySelector('#dev-syntax-badge');

    root.querySelector('#btn-fmt-beautify').addEventListener('click', () => {
      const code = input.value || placeholders[type];
      if (type === 'json') {
        const res = CodeFormatters.formatJson(code, 2);
        if (res.success) {
          output.value = res.formatted;
          badge.style.display = 'inline-block';
          badge.style.background = 'rgba(52, 199, 89, 0.15)';
          badge.style.color = 'var(--apple-green)';
          badge.textContent = '✔ Valid JSON';
        } else {
          output.value = `Syntax Error at line ${res.line}, column ${res.col}:\n${res.error}`;
          badge.style.display = 'inline-block';
          badge.style.background = 'rgba(255, 59, 48, 0.15)';
          badge.style.color = 'var(--apple-red)';
          badge.textContent = '✖ Invalid JSON';
        }
      } else if (type === 'html') {
        output.value = CodeFormatters.formatHtml(code, 2);
      } else if (type === 'css') {
        output.value = CodeFormatters.formatCss(code, 2);
      } else if (type === 'js') {
        output.value = CodeFormatters.formatJs(code, 2);
      }
      toast.success('Formatted successfully!');
    });

    root.querySelector('#btn-fmt-minify').addEventListener('click', () => {
      const code = input.value || placeholders[type];
      if (type === 'json') output.value = CodeFormatters.minifyJson(code).minified || '';
      else if (type === 'html') output.value = CodeFormatters.minifyHtml(code);
      else if (type === 'css') output.value = CodeFormatters.minifyCss(code);
      else if (type === 'js') output.value = CodeFormatters.minifyJs(code);
      toast.success('Minified code!');
    });

    root.querySelector('#btn-fmt-copy').addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        toast.success('Copied to clipboard!');
      }
    });

    root.querySelector('#btn-fmt-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      badge.style.display = 'none';
    });
  }

  /**
   * AI Code Explainer & Assistant View
   */
  renderAiDevTool(type, root) {
    const isExplainer = type === 'explainer';
    root.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:700;">${isExplainer ? 'Code Explainer & Architecture Analyzer' : 'AI Code Assistant & Bug Fixer'}</h3>
        <button id="btn-dev-ai-action" class="btn-primary" style="font-size:12.5px; padding:6px 16px;">
          ${isExplainer ? 'Explain Code' : 'Analyze & Optimize'}
        </button>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; min-height:420px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">Source Code</span>
          <textarea id="dev-ai-input" style="flex:1; font-family:var(--font-mono); font-size:13px; padding:12px;" placeholder="// Paste code here to analyze..."></textarea>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">AI Insights & Code</span>
          <div id="dev-ai-output" style="flex:1; padding:16px; background:var(--apple-surface-secondary); border-radius:8px; font-size:13.5px; line-height:1.6; overflow-y:auto; white-space:pre-wrap; border:1px solid var(--apple-border);">
            <span style="color:var(--apple-text-tertiary); font-style:italic;">AI analysis will be displayed here...</span>
          </div>
        </div>
      </div>
    `;

    root.querySelector('#btn-dev-ai-action').addEventListener('click', async () => {
      const code = root.querySelector('#dev-ai-input').value;
      if (!code) return;
      const out = root.querySelector('#dev-ai-output');
      out.innerHTML = `<span style="color:var(--apple-blue); animation:pulseGlow 1.5s infinite;">MR.SALL AI analyzing code structure and complexity...</span>`;

      const prompt = isExplainer
        ? `You are MR.SALL AI, an elite software architect. Explain this code thoroughly:
1. High-level architecture and intent
2. Line-by-line or function breakdown
3. Time and Space complexity (Big-O)
4. Potential edge-case bugs and performance optimizations

Code:
\`\`\`
${code}
\`\`\``
        : `You are MR.SALL AI, an elite software architect. Review this code for bugs, race conditions, and performance bottlenecks:
1. Provide the corrected/optimized production-grade code
2. List all bug fixes and why they were needed
3. Include unit test examples

Code:
\`\`\`
${code}
\`\`\``;

      try {
        let result = '';
        for await (const chunk of api.streamChat([{ sender: 'user', content: prompt }])) {
          result += chunk;
        }
        out.innerText = result;
        toast.success('Code analysis completed!');
      } catch (err) {
        out.innerHTML = `<div style="color:var(--apple-red);">Analysis Error: ${err.message}</div>`;
      }
    });
  }

  /**
   * Color Studio & WCAG Contrast Checker
   */
  renderColorStudio(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Color Studio & WCAG Contrast Validator</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Picker & Controls -->
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Foreground Color (Text)</label>
            <div style="display:flex; gap:10px; align-items:center;">
              <input type="color" id="col-fg" value="#0071e3" style="width:48px; height:40px; border-radius:8px; cursor:pointer; padding:0;" />
              <input type="text" id="col-fg-hex" value="#0071e3" style="flex:1; font-family:var(--font-mono);" />
            </div>
          </div>

          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Background Color (Surface)</label>
            <div style="display:flex; gap:10px; align-items:center;">
              <input type="color" id="col-bg" value="#ffffff" style="width:48px; height:40px; border-radius:8px; cursor:pointer; padding:0;" />
              <input type="text" id="col-bg-hex" value="#ffffff" style="flex:1; font-family:var(--font-mono);" />
            </div>
          </div>

          <!-- Color Swatches Palette -->
          <div>
            <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Apple Design Palette</label>
            <div style="display:flex; gap:8px;">
              <button class="color-preset" data-hex="#0071e3" style="width:32px; height:32px; border-radius:8px; background:#0071e3;"></button>
              <button class="color-preset" data-hex="#6366f1" style="width:32px; height:32px; border-radius:8px; background:#6366f1;"></button>
              <button class="color-preset" data-hex="#a855f7" style="width:32px; height:32px; border-radius:8px; background:#a855f7;"></button>
              <button class="color-preset" data-hex="#34c759" style="width:32px; height:32px; border-radius:8px; background:#34c759;"></button>
              <button class="color-preset" data-hex="#ff9500" style="width:32px; height:32px; border-radius:8px; background:#ff9500;"></button>
              <button class="color-preset" data-hex="#ff3b30" style="width:32px; height:32px; border-radius:8px; background:#ff3b30;"></button>
              <button class="color-preset" data-hex="#1d1d1f" style="width:32px; height:32px; border-radius:8px; background:#1d1d1f;"></button>
            </div>
          </div>
        </div>

        <!-- Right: Live Contrast Preview -->
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div id="col-preview-card" style="padding:28px; border-radius:16px; border:1px solid var(--apple-border); background:#ffffff; color:#0071e3; text-align:center;">
            <h4 style="font-size:20px; font-weight:700; margin-bottom:6px;">MR.SALL AI Preview</h4>
            <p style="font-size:14px;">Intelligence Without Limits — Accessibility Contrast Preview</p>
          </div>

          <div class="apple-card" style="padding:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <span style="font-weight:600; font-size:13px;">Contrast Ratio</span>
              <strong id="col-ratio" style="font-size:16px; font-family:var(--font-mono);">4.5 : 1</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span>WCAG AA Normal Text (>= 4.5:1)</span>
              <span id="col-wcag-aa" style="color:var(--apple-green); font-weight:700;">PASS</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px;">
              <span>WCAG AAA Normal Text (>= 7.0:1)</span>
              <span id="col-wcag-aaa" style="color:var(--apple-red); font-weight:700;">FAIL</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const fgInput = root.querySelector('#col-fg');
    const fgHex = root.querySelector('#col-fg-hex');
    const bgInput = root.querySelector('#col-bg');
    const bgHex = root.querySelector('#col-bg-hex');
    const previewCard = root.querySelector('#col-preview-card');
    const ratioLabel = root.querySelector('#col-ratio');
    const aaLabel = root.querySelector('#col-wcag-aa');
    const aaaLabel = root.querySelector('#col-wcag-aaa');

    const updateContrast = () => {
      const fg = fgHex.value;
      const bg = bgHex.value;
      previewCard.style.color = fg;
      previewCard.style.backgroundColor = bg;

      // Compute relative luminance
      const getLuminance = (hex) => {
        const rgb = parseInt(hex.replace('#', ''), 16);
        const r = ((rgb >> 16) & 0xff) / 255;
        const g = ((rgb >> 8) & 0xff) / 255;
        const b = (rgb & 0xff) / 255;
        const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };

      try {
        const l1 = getLuminance(fg);
        const l2 = getLuminance(bg);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        const rounded = ratio.toFixed(2);
        ratioLabel.textContent = `${rounded} : 1`;

        const passAA = ratio >= 4.5;
        const passAAA = ratio >= 7.0;

        aaLabel.textContent = passAA ? 'PASS' : 'FAIL';
        aaLabel.style.color = passAA ? 'var(--apple-green)' : 'var(--apple-red)';

        aaaLabel.textContent = passAAA ? 'PASS' : 'FAIL';
        aaaLabel.style.color = passAAA ? 'var(--apple-green)' : 'var(--apple-red)';
      } catch (e) {}
    };

    fgInput.addEventListener('input', (e) => { fgHex.value = e.target.value; updateContrast(); });
    bgInput.addEventListener('input', (e) => { bgHex.value = e.target.value; updateContrast(); });
    fgHex.addEventListener('input', (e) => { fgInput.value = e.target.value; updateContrast(); });
    bgHex.addEventListener('input', (e) => { bgInput.value = e.target.value; updateContrast(); });

    root.querySelectorAll('.color-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        fgHex.value = btn.getAttribute('data-hex');
        fgInput.value = fgHex.value;
        updateContrast();
      });
    });

    updateContrast();
  }

  /**
   * Base64 Encoder / Decoder
   */
  renderBase64Tool(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Base64 Text & File Encoder / Decoder</h3>
      <div style="display:flex; gap:8px; margin-bottom:16px;">
        <button id="btn-b64-encode" class="btn-primary" style="font-size:12.5px; padding:6px 14px;">Encode to Base64</button>
        <button id="btn-b64-decode" class="btn-secondary" style="font-size:12.5px; padding:6px 14px;">Decode from Base64</button>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; min-height:360px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">Input Text</span>
          <textarea id="b64-input" style="flex:1; font-family:var(--font-mono); font-size:13px; padding:12px;" placeholder="Hello MR.SALL AI!"></textarea>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:600; color:var(--apple-text-secondary);">Result</span>
            <button id="btn-b64-copy" class="btn-ghost" style="font-size:12px; padding:2px 8px;">Copy</button>
          </div>
          <textarea id="b64-output" readonly style="flex:1; font-family:var(--font-mono); font-size:13px; padding:12px; background:var(--apple-surface-secondary);"></textarea>
        </div>
      </div>
    `;

    const input = root.querySelector('#b64-input');
    const output = root.querySelector('#b64-output');

    root.querySelector('#btn-b64-encode').addEventListener('click', () => {
      try {
        output.value = CryptoService.encodeBase64(input.value || 'MR.SALL AI');
        toast.success('Encoded to Base64!');
      } catch (e) {
        toast.error(e.message);
      }
    });

    root.querySelector('#btn-b64-decode').addEventListener('click', () => {
      try {
        output.value = CryptoService.decodeBase64(input.value);
        toast.success('Decoded Base64!');
      } catch (e) {
        toast.error('Invalid Base64 sequence: ' + e.message);
      }
    });

    root.querySelector('#btn-b64-copy').addEventListener('click', () => {
      if (output.value) {
        navigator.clipboard.writeText(output.value);
        toast.success('Copied result!');
      }
    });
  }
}

export const developerToolsPage = new DeveloperToolsPage();
