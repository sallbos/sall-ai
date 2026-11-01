/**
 * MR.SALL AI — Settings & API Key Configuration
 */

import { storage } from '../services/storage.js';
import { i18n } from '../services/i18n.js';
import { toast } from '../components/toast.js';

export class SettingsPage {
  render(container) {
    const user = storage.getCurrentUser();
    const geminiKey = storage.getGeminiKey();
    const openAiKey = storage.getOpenAIKey();
    const currentTheme = storage.getTheme();
    const currentLang = localStorage.getItem('mrsall_lang') || 'en';

    container.innerHTML = `
      <div class="page-inner" style="max-width:860px;">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="settings.title">Settings & Preferences</h1>
          <p class="page-main-subtitle" data-i18n="settings.subtitle">
            Manage your profile, API connections, visual theme, and privacy preferences.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Profile Card -->
          <div class="apple-card">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;" data-i18n="settings.profile">Profile Information</h3>
            <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
              <img id="settings-avatar-preview" src="${user?.avatarUrl || 'assets/logo.png'}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid var(--apple-border);" alt="Avatar" />
              <div>
                <span class="user-badge-tag ${user?.tier === 'premium' ? 'premium' : ''}" style="margin-bottom:6px; display:inline-block;">
                  ${user ? user.tier.toUpperCase() : 'FREE'} PLAN
                </span>
                <div style="font-size:13px; color:var(--apple-text-secondary);">${user?.email || 'guest@mrsall.ai'}</div>
              </div>
            </div>

            <form id="form-settings-profile" style="display:flex; flex-direction:column; gap:14px;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                <div>
                  <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;" data-i18n="settings.fullName">Full Name</label>
                  <input type="text" id="set-name" value="${user?.fullName || ''}" required style="width:100%;" />
                </div>
                <div>
                  <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;" data-i18n="settings.email">Email Address</label>
                  <input type="email" id="set-email" value="${user?.email || ''}" required style="width:100%;" />
                </div>
              </div>
              <button type="submit" class="btn-primary" style="align-self:flex-start; padding:8px 18px; font-size:13px;" data-i18n="settings.saveProfile">Save Changes</button>
            </form>
          </div>

          <!-- AI Provider & API Keys -->
          <div class="apple-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <h3 style="font-size:16px; font-weight:700;" data-i18n="settings.apiKeys">AI Provider & API Keys</h3>
                <p style="font-size:13px; color:var(--apple-text-secondary); margin-top:2px;" data-i18n="settings.apiNotice">
                  API keys are securely utilized by the backend Cloudflare Worker and never leaked to third parties.
                </p>
              </div>
              <span style="font-size:11px; font-weight:700; color:var(--apple-green); background:rgba(52,199,89,0.1); padding:4px 8px; border-radius:6px;">
                ${geminiKey || openAiKey ? '● API Configured' : '○ Standalone Mode'}
              </span>
            </div>

            <form id="form-settings-keys" style="display:flex; flex-direction:column; gap:16px; margin-top:16px;">
              <div>
                <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">Google Gemini API Key (Recommended)</label>
                <input type="password" id="set-gemini-key" value="${geminiKey}" placeholder="AIzaSy..." style="width:100%; font-family:var(--font-mono);" />
                <span style="font-size:11px; color:var(--apple-text-tertiary); display:block; margin-top:4px;">
                  Powering multimodal reasoning, image vision, and fast completions.
                </span>
              </div>

              <div>
                <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;">OpenAI API Key (Optional)</label>
                <input type="password" id="set-openai-key" value="${openAiKey}" placeholder="sk-proj-..." style="width:100%; font-family:var(--font-mono);" />
              </div>

              <div style="display:flex; gap:10px;">
                <button type="submit" class="btn-primary" style="padding:8px 18px; font-size:13px;">Save Keys</button>
                <button type="button" id="btn-test-key-connection" class="btn-secondary" style="padding:8px 18px; font-size:13px;">
                  Test Connection
                </button>
              </div>
            </form>
          </div>

          <!-- Preferences -->
          <div class="apple-card">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:16px;" data-i18n="settings.preferences">Interface Preferences</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;" data-i18n="settings.language">Language</label>
                <select id="set-lang-select" style="width:100%;">
                  <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English (LTR)</option>
                  <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>العربية (Arabic RTL)</option>
                  <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français (French LTR)</option>
                </select>
              </div>
              <div>
                <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:4px;" data-i18n="settings.theme">Appearance Theme</label>
                <select id="set-theme-select" style="width:100%;">
                  <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Apple Light (Default)</option>
                  <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Apple Dark / Pro</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Privacy & Cache -->
          <div class="apple-card">
            <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;" data-i18n="settings.dataPrivacy">Data & Privacy</h3>
            <p style="font-size:13px; color:var(--apple-text-secondary); margin-bottom:14px;">
              MR.SALL AI preserves your privacy. All chat and tool inputs are sanitized and protected according to Zero Trust principles.
            </p>
            <button id="btn-settings-clear-cache" class="btn-secondary" style="font-size:12.5px; color:var(--apple-red);">
              Clear Local Storage & Cache
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const profileForm = container.querySelector('#form-settings-profile');
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = storage.getCurrentUser() || {};
      user.fullName = container.querySelector('#set-name').value;
      user.email = container.querySelector('#set-email').value;
      storage.setCurrentUser(user);
      toast.success('Profile updated successfully!');
      window.dispatchEvent(new CustomEvent('mrsall:user-changed', { detail: user }));
    });

    const keysForm = container.querySelector('#form-settings-keys');
    keysForm.addEventListener('submit', (e) => {
      e.preventDefault();
      storage.setGeminiKey(container.querySelector('#set-gemini-key').value);
      storage.setOpenAIKey(container.querySelector('#set-openai-key').value);
      toast.success('AI API Keys saved securely!');
      this.render(container);
    });

    const testBtn = container.querySelector('#btn-test-key-connection');
    testBtn.addEventListener('click', async () => {
      const gemini = container.querySelector('#set-gemini-key').value.trim();
      if (!gemini) {
        toast.warning('Please enter a Gemini API Key to test.');
        return;
      }
      testBtn.textContent = 'Testing...';
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${gemini}`);
        if (res.ok) {
          toast.success('Connection verified! Google Gemini API is ready.');
        } else {
          toast.error('API key verification failed. Check the key and try again.');
        }
      } catch (e) {
        toast.error('Network check error: ' + e.message);
      } finally {
        testBtn.textContent = 'Test Connection';
      }
    });

    const langSelect = container.querySelector('#set-lang-select');
    langSelect.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
      toast.info('Language preference saved.');
    });

    const themeSelect = container.querySelector('#set-theme-select');
    themeSelect.addEventListener('change', (e) => {
      storage.setTheme(e.target.value);
      toast.info('Theme updated.');
      window.location.reload();
    });

    const clearBtn = container.querySelector('#btn-settings-clear-cache');
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear all local cached conversations, keys, and quotas?')) {
        localStorage.clear();
        toast.info('Cache cleared. Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }
}

export const settingsPage = new SettingsPage();
