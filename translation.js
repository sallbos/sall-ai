/**
 * MR.SALL AI — Translation Center
 * High-accuracy neural translation for Arabic, English, and French
 */

import { i18n } from '../services/i18n.js';
import { api } from '../services/api.js';
import { toast } from '../components/toast.js';
import { storage } from '../services/storage.js';

export class TranslationPage {
  constructor() {
    this.sourceLang = 'en';
    this.targetLang = 'ar';
    this.isTranslating = false;
  }

  render(container) {
    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="translation.title">Translation Center</h1>
          <p class="page-main-subtitle" data-i18n="translation.subtitle">
            High-accuracy neural and AI translation between English, Arabic, and French.
          </p>
        </div>

        <!-- Controls Bar -->
        <div class="apple-card" style="margin-bottom:20px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <!-- Source Language -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12.5px; font-weight:600; color:var(--apple-text-secondary);">Source:</span>
            <select id="trans-source-lang" style="font-weight:600; cursor:pointer;">
              <option value="auto">✨ Auto Detect</option>
              <option value="en" selected>🇺🇸 English</option>
              <option value="ar">🇸🇦 العربية (Arabic)</option>
              <option value="fr">🇫🇷 Français (French)</option>
            </select>
          </div>

          <!-- Swap Button -->
          <button id="btn-trans-swap" class="header-icon-btn" title="Swap Languages">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </button>

          <!-- Target Language -->
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12.5px; font-weight:600; color:var(--apple-text-secondary);">Target:</span>
            <select id="trans-target-lang" style="font-weight:600; cursor:pointer;">
              <option value="ar" selected>🇸🇦 العربية (Arabic)</option>
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 Français (French)</option>
            </select>
          </div>

          <button id="btn-trans-action" class="btn-primary" style="padding:8px 20px; font-size:13px;">
            Translate Now
          </button>
        </div>

        <!-- Split Editor -->
        <div class="grid-split-2" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <!-- Source Input Box -->
          <div class="apple-card" style="display:flex; flex-direction:column; min-height:380px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:13px; font-weight:600;">Original Text</span>
              <button id="btn-trans-clear" class="btn-ghost" style="font-size:12px; color:var(--apple-red);">Clear</button>
            </div>
            <textarea id="trans-input-text" style="flex:1; width:100%; border:none; resize:none; font-size:15px; line-height:1.6; background:transparent; box-shadow:none;" placeholder="Type or paste text here to translate..."></textarea>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--apple-border); padding-top:10px; margin-top:10px;">
              <button id="btn-trans-speak-src" class="btn-ghost" style="font-size:12px;">🔊 Listen</button>
              <span id="trans-char-count" style="font-size:12px; color:var(--apple-text-secondary);">0 chars</span>
            </div>
          </div>

          <!-- Target Translation Box -->
          <div class="apple-card" style="display:flex; flex-direction:column; min-height:380px; background:var(--apple-surface-secondary);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:13px; font-weight:600;">Translation</span>
              <button id="btn-trans-copy" class="btn-ghost" style="font-size:12px;">Copy</button>
            </div>
            <div id="trans-output-text" style="flex:1; width:100%; font-size:15px; line-height:1.6; white-space:pre-wrap; overflow-y:auto;">
              <span style="color:var(--apple-text-tertiary); font-style:italic;">Translation will appear here...</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--apple-border); padding-top:10px; margin-top:10px;">
              <button id="btn-trans-speak-tgt" class="btn-ghost" style="font-size:12px;">🔊 Listen</button>
              <span style="font-size:11px; font-weight:600; color:var(--apple-blue);">MR.SALL Neural Engine</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const input = container.querySelector('#trans-input-text');
    const output = container.querySelector('#trans-output-text');
    const actionBtn = container.querySelector('#btn-trans-action');
    const swapBtn = container.querySelector('#btn-trans-swap');
    const clearBtn = container.querySelector('#btn-trans-clear');
    const copyBtn = container.querySelector('#btn-trans-copy');
    const srcSelect = container.querySelector('#trans-source-lang');
    const tgtSelect = container.querySelector('#trans-target-lang');
    const charCount = container.querySelector('#trans-char-count');
    const speakSrcBtn = container.querySelector('#btn-trans-speak-src');
    const speakTgtBtn = container.querySelector('#btn-trans-speak-tgt');

    input.addEventListener('input', () => {
      charCount.textContent = `${input.value.length} chars`;
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      output.innerHTML = '<span style="color:var(--apple-text-tertiary); font-style:italic;">Translation will appear here...</span>';
      charCount.textContent = '0 chars';
    });

    swapBtn.addEventListener('click', () => {
      const src = srcSelect.value;
      const tgt = tgtSelect.value;
      if (src !== 'auto') {
        srcSelect.value = tgt;
        tgtSelect.value = src;
        const currentIn = input.value;
        const currentOut = output.innerText;
        if (currentOut && !currentOut.includes('will appear here')) {
          input.value = currentOut;
          output.innerText = currentIn;
        }
      }
    });

    copyBtn.addEventListener('click', () => {
      const text = output.innerText;
      if (text && !text.includes('will appear here')) {
        navigator.clipboard.writeText(text);
        toast.success('Translation copied to clipboard!');
      }
    });

    actionBtn.addEventListener('click', async () => {
      const text = input.value.trim();
      if (!text) return;

      actionBtn.disabled = true;
      actionBtn.textContent = 'Translating...';
      output.innerHTML = `<span style="color:var(--apple-blue); animation:pulseGlow 1.5s infinite;">MR.SALL AI translating...</span>`;

      try {
        const src = srcSelect.value;
        const tgt = tgtSelect.value;
        const result = await api.translate(text, src, tgt);
        output.innerText = result;

        // Arabic text styling
        if (tgt === 'ar') {
          output.style.direction = 'rtl';
          output.style.fontFamily = '"Cairo", sans-serif';
        } else {
          output.style.direction = 'ltr';
          output.style.fontFamily = 'inherit';
        }

        storage.addToolHistory({
          toolName: `Translate: ${src.toUpperCase()} -> ${tgt.toUpperCase()}`,
          toolCategory: 'translation',
          inputSnippet: text.substring(0, 100),
          outputSnippet: result.substring(0, 100)
        });

        toast.success('Translation complete!');
      } catch (err) {
        output.innerHTML = `<div style="color:var(--apple-red);">Translation error: ${err.message}</div>`;
      } finally {
        actionBtn.disabled = false;
        actionBtn.textContent = 'Translate Now';
      }
    });

    // Text to Speech
    const speak = (text, lang) => {
      if (!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'ar') utterance.lang = 'ar-SA';
      else if (lang === 'fr') utterance.lang = 'fr-FR';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    };

    speakSrcBtn.addEventListener('click', () => {
      speak(input.value, srcSelect.value);
    });

    speakTgtBtn.addEventListener('click', () => {
      speak(output.innerText, tgtSelect.value);
    });
  }
}

export const translationPage = new TranslationPage();
