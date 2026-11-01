/**
 * MR.SALL AI — Safe & Educational Cybersecurity Suite
 * Password Strength, Generator, Hash Studio, URL Inspector, Learning Center & Glossary
 */

import { i18n } from '../services/i18n.js';
import { CryptoService } from '../services/crypto.js';
import { CyberUtils } from '../tools/cyber-utils.js';
import { toast } from '../components/toast.js';

export class CyberToolsPage {
  constructor() {
    this.activeTab = 'pwd-analyzer';
  }

  render(container) {
    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="cyberTools.title">Cybersecurity Tools</h1>
          <p class="page-main-subtitle" data-i18n="cyberTools.subtitle">
            Educational security hardening utilities, cryptographic hash generators, and learning modules.
          </p>
        </div>

        <!-- Navigation Tabs -->
        <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid var(--apple-border);">
          <button class="btn-ghost cyber-tab-btn active-tab" data-tab="pwd-analyzer">🛡️ Password Analyzer</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="generator">🔑 Password Generator</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="hash">🔒 Hash Studio</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="encoder">⚙️ Encoders & Hex</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="url">🔗 URL Inspector</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="learning">📚 Learning Center</button>
          <button class="btn-ghost cyber-tab-btn" data-tab="glossary">📖 Cyber Glossary</button>
        </div>

        <div id="cyber-content-area" class="apple-card" style="min-height:480px;">
          <!-- Dynamically injected -->
        </div>
      </div>
    `;

    this.bindEvents(container);
    this.renderTab(this.activeTab, container);
  }

  bindEvents(container) {
    const tabs = container.querySelectorAll('.cyber-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active-tab'));
        tab.classList.add('active-tab');
        this.activeTab = tab.getAttribute('data-tab');
        this.renderTab(this.activeTab, container);
      });
    });
  }

  renderTab(tab, container) {
    const root = container.querySelector('#cyber-content-area');
    if (!root) return;

    switch (tab) {
      case 'pwd-analyzer':
        this.renderPasswordAnalyzer(root);
        break;
      case 'generator':
        this.renderPasswordGenerator(root);
        break;
      case 'hash':
        this.renderHashStudio(root);
        break;
      case 'encoder':
        this.renderEncoders(root);
        break;
      case 'url':
        this.renderUrlInspector(root);
        break;
      case 'learning':
        this.renderLearningCenter(root);
        break;
      case 'glossary':
        this.renderGlossary(root);
        break;
    }
  }

  /**
   * Password Strength & Entropy Analyzer
   */
  renderPasswordAnalyzer(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Password Strength & Entropy Analyzer</h3>
      <p style="font-size:13px; color:var(--apple-text-secondary); margin-bottom:20px;">
        Evaluates your password resistance against offline brute-force cracking clusters using Shannon entropy metrics.
      </p>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Test Password</label>
          <div style="position:relative;">
            <input type="password" id="input-test-pwd" placeholder="Enter password to evaluate..." style="width:100%; font-family:var(--font-mono); padding-right:40px;" />
            <button id="btn-toggle-pwd-mask" style="position:absolute; right:10px; top:10px; color:var(--apple-text-secondary); cursor:pointer;">👁️</button>
          </div>

          <div style="margin-top:16px;">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; margin-bottom:4px;">
              <span>Strength Rating</span>
              <span id="label-pwd-rating" style="color:var(--apple-blue);">Strong</span>
            </div>
            <div style="width:100%; height:8px; background:var(--apple-surface-secondary); border-radius:4px; overflow:hidden;">
              <div id="bar-pwd-entropy" style="width:75%; height:100%; background:var(--apple-green); transition:width 0.3s ease;"></div>
            </div>
          </div>

          <div style="margin-top:20px; display:flex; flex-direction:column; gap:8px; font-size:13px;">
            <div id="chk-len">⚪ Minimum 12 characters</div>
            <div id="chk-upper">⚪ Uppercase letters (A-Z)</div>
            <div id="chk-lower">⚪ Lowercase letters (a-z)</div>
            <div id="chk-num">⚪ Numbers (0-9)</div>
            <div id="chk-sym">⚪ Symbols (!@#$...)</div>
          </div>
        </div>

        <!-- Telemetry Card -->
        <div class="apple-card" style="background:var(--apple-surface-secondary); display:flex; flex-direction:column; justify-content:center; gap:16px; padding:24px;">
          <div>
            <span style="font-size:12px; color:var(--apple-text-secondary); text-transform:uppercase; font-weight:700;">Shannon Entropy</span>
            <div id="label-entropy-val" style="font-size:32px; font-weight:800; color:var(--apple-text); font-family:var(--font-mono);">0 bits</div>
          </div>
          <div>
            <span style="font-size:12px; color:var(--apple-text-secondary); text-transform:uppercase; font-weight:700;">Estimated Crack Time</span>
            <div id="label-crack-val" style="font-size:22px; font-weight:700; color:var(--apple-green);">Instant</div>
            <span style="font-size:11px; color:var(--apple-text-tertiary);">Assumes 10 billion guesses/second brute-force array</span>
          </div>
        </div>
      </div>
    `;

    const input = root.querySelector('#input-test-pwd');
    const maskBtn = root.querySelector('#btn-toggle-pwd-mask');
    const ratingLabel = root.querySelector('#label-pwd-rating');
    const entropyBar = root.querySelector('#bar-pwd-entropy');
    const entropyVal = root.querySelector('#label-entropy-val');
    const crackVal = root.querySelector('#label-crack-val');

    maskBtn.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    const update = () => {
      const res = CryptoService.analyzePassword(input.value);
      ratingLabel.textContent = res.label;
      entropyVal.textContent = `${res.entropy} bits`;
      crackVal.textContent = res.crackTime;

      const colors = ['var(--apple-red)', 'var(--apple-orange)', '#eab308', 'var(--apple-green)', 'var(--apple-blue)'];
      const widths = ['10%', '30%', '55%', '80%', '100%'];

      entropyBar.style.width = widths[res.score];
      entropyBar.style.background = colors[res.score];
      ratingLabel.style.color = colors[res.score];

      const updateCheck = (id, valid) => {
        const el = root.querySelector(`#${id}`);
        el.textContent = (valid ? '🟢 ' : '⚪ ') + el.textContent.substring(2);
      };

      updateCheck('chk-len', res.checks.length);
      updateCheck('chk-upper', res.checks.uppercase);
      updateCheck('chk-lower', res.checks.lowercase);
      updateCheck('chk-num', res.checks.numbers);
      updateCheck('chk-sym', res.checks.symbols);
    };

    input.addEventListener('input', update);
    input.value = 'MR-Sall#Secure2026!';
    update();
  }

  /**
   * Password Generator
   */
  renderPasswordGenerator(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Cryptographically Secure Password Generator</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; margin-bottom:4px;">
              <span>Password Length</span>
              <span id="gen-len-label">20 characters</span>
            </div>
            <input type="range" id="gen-len-slider" min="8" max="64" value="20" style="width:100%;" />
          </div>

          <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="gen-chk-upper" checked /> Uppercase Letters (A-Z)
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="gen-chk-lower" checked /> Lowercase Letters (a-z)
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="gen-chk-num" checked /> Numbers (0-9)
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="gen-chk-sym" checked /> Special Symbols (!@#$%^&*)
            </label>
            <label style="display:flex; align-items:center; gap:8px;">
              <input type="checkbox" id="gen-chk-ambig" /> Exclude Ambiguous (il1Lo0O)
            </label>
          </div>

          <button id="btn-gen-pwd" class="btn-primary" style="padding:12px;">Generate Password</button>
        </div>

        <!-- Output Display -->
        <div style="display:flex; flex-direction:column; justify-content:center; gap:16px;">
          <div class="apple-card" style="background:var(--apple-surface-secondary); padding:20px; text-align:center;">
            <div id="gen-output" style="font-family:var(--font-mono); font-size:18px; font-weight:700; word-break:break-all; color:var(--apple-text); margin-bottom:12px;">
              ...
            </div>
            <button id="btn-copy-gen-pwd" class="btn-secondary" style="font-size:13px;">Copy to Clipboard</button>
          </div>
        </div>
      </div>
    `;

    const slider = root.querySelector('#gen-len-slider');
    const label = root.querySelector('#gen-len-label');
    const out = root.querySelector('#gen-output');

    slider.addEventListener('input', (e) => {
      label.textContent = `${e.target.value} characters`;
    });

    const generate = () => {
      const pwd = CryptoService.generatePassword({
        length: parseInt(slider.value, 10),
        includeUpper: root.querySelector('#gen-chk-upper').checked,
        includeLower: root.querySelector('#gen-chk-lower').checked,
        includeNumbers: root.querySelector('#gen-chk-num').checked,
        includeSymbols: root.querySelector('#gen-chk-sym').checked,
        excludeAmbiguous: root.querySelector('#gen-chk-ambig').checked
      });
      out.textContent = pwd;
    };

    root.querySelector('#btn-gen-pwd').addEventListener('click', generate);
    root.querySelector('#btn-copy-gen-pwd').addEventListener('click', () => {
      navigator.clipboard.writeText(out.textContent);
      toast.success('Generated password copied!');
    });

    generate();
  }

  /**
   * Cryptographic Hash Studio
   */
  renderHashStudio(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Cryptographic Hash Studio</h3>
      <p style="font-size:13px; color:var(--apple-text-secondary); margin-bottom:16px;">
        Compute one-way cryptographic digests via hardware-accelerated Web Crypto API.
      </p>

      <div style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Input Text</label>
          <textarea id="hash-input" rows="3" style="width:100%; font-family:var(--font-mono);" placeholder="Enter text to hash..."></textarea>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">SHA-256 (NIST Standard)</label>
            <input type="text" id="hash-sha256" readonly style="width:100%; font-family:var(--font-mono); font-size:12px;" />
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">SHA-512 (High Security)</label>
            <input type="text" id="hash-sha512" readonly style="width:100%; font-family:var(--font-mono); font-size:12px;" />
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">SHA-1 (Legacy)</label>
            <input type="text" id="hash-sha1" readonly style="width:100%; font-family:var(--font-mono); font-size:12px;" />
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">MD5 (Checksum)</label>
            <input type="text" id="hash-md5" readonly style="width:100%; font-family:var(--font-mono); font-size:12px;" />
          </div>
        </div>
      </div>
    `;

    const input = root.querySelector('#hash-input');
    const sha256El = root.querySelector('#hash-sha256');
    const sha512El = root.querySelector('#hash-sha512');
    const sha1El = root.querySelector('#hash-sha1');
    const md5El = root.querySelector('#hash-md5');

    const update = async () => {
      const val = input.value;
      if (!val) {
        sha256El.value = '';
        sha512El.value = '';
        sha1El.value = '';
        md5El.value = '';
        return;
      }
      sha256El.value = await CryptoService.hash(val, 'SHA-256');
      sha512El.value = await CryptoService.hash(val, 'SHA-512');
      sha1El.value = await CryptoService.hash(val, 'SHA-1');
      md5El.value = await CryptoService.hash(val, 'MD5');
    };

    input.addEventListener('input', update);
    input.value = 'MR.SALL AI Platform 2026';
    update();
  }

  /**
   * Encoders & Decoders
   */
  renderEncoders(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">Text, Hex, Binary & URL Encoder</h3>
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Plain Text</label>
          <input type="text" id="enc-text" value="MR.SALL" style="width:100%;" />
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">Hexadecimal Representation</label>
          <input type="text" id="enc-hex" readonly style="width:100%; font-family:var(--font-mono); font-size:13px;" />
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">Binary Representation (8-bit bytes)</label>
          <textarea id="enc-bin" readonly rows="2" style="width:100%; font-family:var(--font-mono); font-size:12px;"></textarea>
        </div>
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--apple-text-secondary);">URL Encoded (Percent-encoding)</label>
          <input type="text" id="enc-url" readonly style="width:100%; font-family:var(--font-mono); font-size:13px;" />
        </div>
      </div>
    `;

    const textIn = root.querySelector('#enc-text');
    const hexOut = root.querySelector('#enc-hex');
    const binOut = root.querySelector('#enc-bin');
    const urlOut = root.querySelector('#enc-url');

    const update = () => {
      const val = textIn.value;
      hexOut.value = CryptoService.textToHex(val);
      binOut.value = CryptoService.textToBinary(val);
      urlOut.value = encodeURIComponent(val);
    };

    textIn.addEventListener('input', update);
    update();
  }

  /**
   * URL Inspector & Sanitizer
   */
  renderUrlInspector(root) {
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;">URL Security Inspector & Sanitizer</h3>
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <input type="text" id="url-input" value="https://mrsall.ai/dashboard?utm_source=portal&auth=token123" placeholder="https://example.com/..." style="flex:1;" />
        <button id="btn-inspect-url" class="btn-primary" style="font-size:13px; padding:8px 16px;">Inspect URL</button>
      </div>

      <div id="url-inspect-result" class="apple-card" style="background:var(--apple-surface-secondary); padding:16px; font-size:13px;">
        <!-- Populated on inspect -->
      </div>
    `;

    const input = root.querySelector('#url-input');
    const btn = root.querySelector('#btn-inspect-url');
    const res = root.querySelector('#url-inspect-result');

    const inspect = () => {
      const info = CyberUtils.inspectUrl(input.value);
      if (!info.valid) {
        res.innerHTML = `<span style="color:var(--apple-red); font-weight:600;">Invalid URL: ${info.error}</span>`;
        return;
      }

      res.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
          <div><strong>Protocol:</strong> <code style="color:${info.protocol === 'https:' ? 'var(--apple-green)' : 'var(--apple-red)'};">${info.protocol}</code></div>
          <div><strong>Hostname:</strong> <code>${info.hostname}</code></div>
          <div><strong>Port:</strong> <code>${info.port}</code></div>
          <div><strong>Pathname:</strong> <code>${info.pathname}</code></div>
        </div>

        <div style="margin-top:10px;">
          <strong>Parameters (${info.parameters.length}):</strong>
          <ul style="margin:6px 0 0 20px;">
            ${info.parameters.map(p => `<li><code>${p.key}</code> = <code>${p.val}</code></li>`).join('') || '<li>None</li>'}
          </ul>
        </div>

        <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--apple-border);">
          <strong>Security Assessment:</strong> 
          ${info.isSafe 
            ? `<span style="color:var(--apple-green); font-weight:700;">🟢 Safe URL Structure</span>` 
            : `<span style="color:var(--apple-red); font-weight:700;">⚠️ Warnings:</span> ${info.warnings.join(', ')}`
          }
        </div>
      `;
    };

    btn.addEventListener('click', inspect);
    inspect();
  }

  /**
   * Learning Center
   */
  renderLearningCenter(root) {
    const modules = CyberUtils.getLearningModules();
    root.innerHTML = `
      <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;">Security Learning Center</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${modules.map(m => `
          <div class="apple-card" style="padding:18px; border-left:4px solid var(--apple-blue);">
            <h4 style="font-size:15px; font-weight:700; margin-bottom:6px;">${m.title}</h4>
            <p style="font-size:13.5px; color:var(--apple-text-secondary); margin-bottom:10px;">${m.summary}</p>
            <ul style="font-size:13px; line-height:1.6; padding-left:20px;">
              ${m.points.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Searchable Glossary
   */
  renderGlossary(root) {
    const terms = CyberUtils.getGlossary();
    root.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:700;">Cybersecurity Glossary (50+ Terms)</h3>
        <input type="text" id="glossary-search" placeholder="Search definitions..." style="width:240px; font-size:12.5px; padding:6px 12px;" />
      </div>

      <div id="glossary-list" style="display:flex; flex-direction:column; gap:12px; max-height:460px; overflow-y:auto; padding-right:8px;">
        ${this.buildGlossaryHtml(terms)}
      </div>
    `;

    const searchInput = root.querySelector('#glossary-search');
    const list = root.querySelector('#glossary-list');

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = terms.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q));
      list.innerHTML = this.buildGlossaryHtml(filtered);
    });
  }

  buildGlossaryHtml(list) {
    if (list.length === 0) return `<div style="padding:20px; text-align:center; color:var(--apple-text-secondary);">No terms found.</div>`;
    return list.map(item => `
      <div class="apple-card" style="padding:14px 18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="font-size:14px; color:var(--apple-text);">${item.term}</strong>
          <span style="font-size:10.5px; font-weight:700; color:var(--apple-blue); background:var(--apple-blue-light); padding:2px 8px; border-radius:4px;">${item.category}</span>
        </div>
        <div style="font-size:13px; color:var(--apple-text-secondary); line-height:1.5;">${item.definition}</div>
      </div>
    `).join('');
  }
}

export const cyberToolsPage = new CyberToolsPage();
