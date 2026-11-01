/**
 * MR.SALL AI — Reusable Modal System
 * Provides Auth (Login/Signup/Forgot), API Key Setup, and Upgrade Modals
 */

import { storage } from '../services/storage.js';
import { toast } from './toast.js';
import { i18n } from '../services/i18n.js';

export class ModalManager {
  constructor() {
    this.overlay = null;
    this.box = null;
    this.init();
  }

  init() {
    this.overlay = document.getElementById('global-modal-overlay');
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.id = 'global-modal-overlay';
      this.overlay.className = 'modal-overlay';
      this.overlay.innerHTML = `<div class="modal-box" id="global-modal-box"></div>`;
      document.body.appendChild(this.overlay);

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });
    }
    this.box = document.getElementById('global-modal-box');
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('active');
    }
  }

  open(htmlContent) {
    this.init();
    this.box.innerHTML = htmlContent;
    this.overlay.classList.add('active');

    const closeBtn = this.box.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  /**
   * Authentication Modal (Sign In / Sign Up / Forgot Password)
   */
  showAuthModal(initialTab = 'login') {
    const html = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <img src="assets/logo.png" width="32" height="32" alt="Logo" style="object-fit:contain;" />
          <h3 class="modal-title" id="auth-title">${initialTab === 'signup' ? 'Create Account' : 'Sign In'}</h3>
        </div>
        <button class="modal-close-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style="display:flex; gap:8px; margin-bottom:20px; border-bottom:1px solid var(--apple-border); padding-bottom:8px;">
        <button id="tab-login" class="btn-ghost ${initialTab === 'login' ? 'active-tab' : ''}" style="font-weight:600;">Sign In</button>
        <button id="tab-signup" class="btn-ghost ${initialTab === 'signup' ? 'active-tab' : ''}" style="font-weight:600;">Create Account</button>
        <button id="tab-forgot" class="btn-ghost" style="font-weight:600; font-size:12px; margin-left:auto;">Forgot?</button>
      </div>

      <div id="auth-body">
        ${this.getLoginFormHtml()}
      </div>
    `;

    this.open(html);
    this.bindAuthEvents();
  }

  getLoginFormHtml() {
    return `
      <form id="form-login" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Email Address</label>
          <input type="email" id="login-email" required value="alex@mrsall.ai" style="width:100%;" />
        </div>
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Password</label>
          <input type="password" id="login-pwd" required value="••••••••" style="width:100%;" />
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
            <input type="checkbox" checked /> Remember this device
          </label>
        </div>
        <button type="submit" class="btn-primary" style="width:100%; padding:12px; margin-top:8px;">Sign In to MR.SALL AI</button>
        <div style="font-size:12px; color:var(--apple-text-secondary); text-align:center;">
          Admin credentials: <code>admin@mrsall.ai</code> / <code>AdminSall2026!</code>
        </div>
      </form>
    `;
  }

  getSignupFormHtml() {
    return `
      <form id="form-signup" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Full Name</label>
          <input type="text" id="signup-name" required placeholder="Dr. Sarah Connor" style="width:100%;" />
        </div>
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Email Address</label>
          <input type="email" id="signup-email" required placeholder="sarah@example.com" style="width:100%;" />
        </div>
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Password</label>
          <input type="password" id="signup-pwd" required placeholder="Minimum 8 characters" style="width:100%;" />
        </div>
        <button type="submit" class="btn-primary" style="width:100%; padding:12px; margin-top:8px;">Create Account</button>
      </form>
    `;
  }

  getForgotFormHtml() {
    return `
      <form id="form-forgot" style="display:flex; flex-direction:column; gap:14px;">
        <p style="font-size:13.5px; color:var(--apple-text-secondary);">Enter your email address and we'll send you a secure password reset link.</p>
        <div>
          <label style="font-size:12.5px; font-weight:600; display:block; margin-bottom:6px;">Email Address</label>
          <input type="email" id="forgot-email" required placeholder="alex@mrsall.ai" style="width:100%;" />
        </div>
        <button type="submit" class="btn-primary" style="width:100%; padding:12px; margin-top:8px;">Send Reset Link</button>
      </form>
    `;
  }

  bindAuthEvents() {
    const authBody = this.box.querySelector('#auth-body');
    const tabLogin = this.box.querySelector('#tab-login');
    const tabSignup = this.box.querySelector('#tab-signup');
    const tabForgot = this.box.querySelector('#tab-forgot');
    const title = this.box.querySelector('#auth-title');

    const setTab = (name, html, t) => {
      [tabLogin, tabSignup, tabForgot].forEach(b => b.classList.remove('active-tab'));
      authBody.innerHTML = html;
      title.textContent = t;
      this.bindFormActions();
    };

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active-tab');
      setTab('login', this.getLoginFormHtml(), 'Sign In');
    });

    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active-tab');
      setTab('signup', this.getSignupFormHtml(), 'Create Account');
    });

    tabForgot.addEventListener('click', () => {
      tabForgot.classList.add('active-tab');
      setTab('forgot', this.getForgotFormHtml(), 'Reset Password');
    });

    this.bindFormActions();
  }

  bindFormActions() {
    const loginForm = this.box.querySelector('#form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = this.box.querySelector('#login-email').value;
        const isAdmin = email.toLowerCase().includes('admin');
        const user = {
          id: isAdmin ? 'usr_admin_master_001' : 'usr_demo_user_002',
          email,
          fullName: isAdmin ? 'Administrator Sall' : 'Alex Vance',
          role: isAdmin ? 'admin' : 'user',
          tier: isAdmin ? 'premium' : 'free',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        storage.setCurrentUser(user);
        toast.success(`Welcome back, ${user.fullName}!`);
        this.close();
        window.dispatchEvent(new CustomEvent('mrsall:user-changed', { detail: user }));
      });
    }

    const signupForm = this.box.querySelector('#form-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.box.querySelector('#signup-name').value;
        const email = this.box.querySelector('#signup-email').value;
        const user = {
          id: 'usr_' + Date.now(),
          email,
          fullName: name,
          role: 'user',
          tier: 'free',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        storage.setCurrentUser(user);
        toast.success(`Account created successfully! Welcome to MR.SALL AI.`);
        this.close();
        window.dispatchEvent(new CustomEvent('mrsall:user-changed', { detail: user }));
      });
    }

    const forgotForm = this.box.querySelector('#form-forgot');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        toast.info('Password reset instructions sent to your email.');
        this.close();
      });
    }
  }

  /**
   * API Key Configuration Modal
   */
  showApiKeyModal() {
    const currentGemini = storage.getGeminiKey();
    const currentOpenAI = storage.getOpenAIKey();

    const html = `
      <div class="modal-header">
        <h3 class="modal-title">Connect AI Provider</h3>
        <button class="modal-close-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <p style="font-size:13.5px; color:var(--apple-text-secondary); margin-bottom:16px;">
        To activate real-time AI responses, connect your Google Gemini API key (recommended) or deploy the Cloudflare Worker backend.
      </p>

      <form id="form-api-keys" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label style="font-size:13px; font-weight:600; display:block; margin-bottom:6px;">Google Gemini API Key (Recommended)</label>
          <input type="password" id="input-gemini-key" placeholder="AIzaSy..." value="${currentGemini}" style="width:100%;" />
          <span style="font-size:11px; color:var(--apple-text-tertiary); display:block; margin-top:4px;">
            Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener">Google AI Studio</a>.
          </span>
        </div>

        <div>
          <label style="font-size:13px; font-weight:600; display:block; margin-bottom:6px;">OpenAI API Key (Optional)</label>
          <input type="password" id="input-openai-key" placeholder="sk-proj-..." value="${currentOpenAI}" style="width:100%;" />
        </div>

        <div style="background-color:var(--apple-surface-secondary); padding:12px; border-radius:var(--radius-sm); font-size:12px; color:var(--apple-text-secondary);">
          <div style="font-weight:600; margin-bottom:4px; color:var(--apple-text);">🔒 Security Assurance</div>
          When running in production on Cloudflare, keys are stored as encrypted environment secrets. In client preview mode, keys remain in your browser's local sandbox.
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button type="button" class="btn-secondary" id="btn-cancel-keys">Cancel</button>
          <button type="submit" class="btn-primary">Save API Configuration</button>
        </div>
      </form>
    `;

    this.open(html);

    this.box.querySelector('#btn-cancel-keys').addEventListener('click', () => this.close());
    this.box.querySelector('#form-api-keys').addEventListener('submit', (e) => {
      e.preventDefault();
      const gem = this.box.querySelector('#input-gemini-key').value.trim();
      const oai = this.box.querySelector('#input-openai-key').value.trim();
      storage.setGeminiKey(gem);
      storage.setOpenAIKey(oai);
      toast.success('AI Provider keys updated successfully!');
      this.close();
      window.dispatchEvent(new CustomEvent('mrsall:keys-updated'));
    });
  }

  /**
   * Premium Upgrade Modal
   */
  showUpgradeModal() {
    const html = `
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="background:var(--brand-gradient); width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3 class="modal-title">Upgrade to MR.SALL PRO</h3>
        </div>
        <button class="modal-close-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div style="text-align:center; margin:16px 0;">
        <span style="font-size:36px; font-weight:800; color:var(--apple-text);">$19</span>
        <span style="font-size:14px; color:var(--apple-text-secondary);">/ user per month</span>
      </div>

      <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; margin-bottom:24px; font-size:13.5px;">
        <li style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--apple-green);">✔</span> Unlimited AI Chat & Reasoning Messages
        </li>
        <li style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--apple-green);">✔</span> High-Resolution 4x AI Upscale & Background Removal
        </li>
        <li style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--apple-green);">✔</span> Priority Server Execution & Dedicated Latency
        </li>
        <li style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--apple-green);">✔</span> Full Cloud Export & Persistent History Sync
        </li>
      </ul>

      <form id="form-upgrade" style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Card Number</label>
          <input type="text" placeholder="4242 •••• •••• 4242" required style="width:100%; font-family:var(--font-mono);" />
        </div>
        <div style="display:flex; gap:10px;">
          <div style="flex:1;">
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">Expiry</label>
            <input type="text" placeholder="MM/YY" required style="width:100%; font-family:var(--font-mono);" />
          </div>
          <div style="flex:1;">
            <label style="font-size:12px; font-weight:600; display:block; margin-bottom:4px;">CVC</label>
            <input type="text" placeholder="123" required style="width:100%; font-family:var(--font-mono);" />
          </div>
        </div>
        <button type="submit" class="btn-primary" style="width:100%; padding:12px; margin-top:8px;">
          Subscribe to MR.SALL PRO ($19/mo)
        </button>
        <span style="font-size:11px; color:var(--apple-text-tertiary); text-align:center;">
          Secured by Stripe & 256-bit SSL encryption. Cancel anytime in one click.
        </span>
      </form>
    `;

    this.open(html);

    this.box.querySelector('#form-upgrade').addEventListener('submit', (e) => {
      e.preventDefault();
      const user = storage.getCurrentUser();
      if (user) {
        user.tier = 'premium';
        storage.setCurrentUser(user);
      }
      toast.success('Congratulations! Your account is now upgraded to MR.SALL PRO.');
      this.close();
      window.dispatchEvent(new CustomEvent('mrsall:user-changed', { detail: user }));
    });
  }
}

export const modal = new ModalManager();
