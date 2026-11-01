/**
 * MR.SALL AI — Application Header Bar Component
 */

import { i18n } from '../services/i18n.js';
import { storage } from '../services/storage.js';
import { modal } from './modal.js';
import { toast } from './toast.js';

export class HeaderComponent {
  constructor() {
    this.container = null;
  }

  render(containerId = 'app-header-root') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    const user = storage.getCurrentUser();
    const currentTheme = storage.getTheme();
    const currentLang = localStorage.getItem('mrsall_lang') || 'en';

    this.container.innerHTML = `
      <div class="header-left">
        <button id="mobile-drawer-toggle" class="mobile-menu-btn" aria-label="Open Navigation">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <span class="header-title-crumb" id="header-page-title">Home</span>
      </div>

      <div class="header-right">
        <!-- Upgrade Button -->
        <button id="header-btn-upgrade" class="upgrade-pill-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span data-i18n="nav.upgrade">Upgrade to Premium</span>
        </button>

        <!-- Language Selector -->
        <select id="header-lang-select" class="lang-selector-select" aria-label="Select Language">
          <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
          <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
          <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
        </select>

        <!-- Theme Switcher -->
        <button id="header-theme-toggle" class="header-icon-btn" title="Toggle Theme">
          ${currentTheme === 'dark' 
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
          }
        </button>

        <!-- Notifications Bell -->
        <div style="position:relative;">
          <button id="header-btn-notifications" class="header-icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notification-dot"></span>
          </button>
          <div id="notifications-dropdown" style="display:none; position:absolute; right:0; top:46px; width:300px; background:var(--apple-surface); border:1px solid var(--apple-border); border-radius:var(--radius-md); box-shadow:var(--shadow-lg); padding:16px; z-index:200;">
            <div style="font-size:13px; font-weight:700; margin-bottom:12px; display:flex; justify-content:space-between;">
              <span>Notifications</span>
              <span style="font-size:10px; color:var(--apple-blue); cursor:pointer;">Mark all read</span>
            </div>
            <div style="font-size:12px; color:var(--apple-text); border-bottom:1px solid var(--apple-border); padding-bottom:8px; margin-bottom:8px;">
              ✨ Welcome to <strong>MR.SALL AI</strong>! All 11 workspaces are now operational.
            </div>
            <div style="font-size:12px; color:var(--apple-text-secondary);">
              🔒 Cloudflare D1 and secure edge services connected.
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown Button -->
        <div style="position:relative;">
          <button id="header-user-btn" class="user-profile-btn">
            <img src="${user?.avatarUrl || 'assets/logo.png'}" class="user-avatar-small" alt="Avatar" style="object-fit:cover;" />
            <span style="font-size:12.5px; font-weight:600; max-width:90px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${user ? user.fullName.split(' ')[0] : 'Guest'}
            </span>
            <span class="user-badge-tag ${user?.tier === 'premium' ? 'premium' : ''}">
              ${user ? user.tier.toUpperCase() : 'FREE'}
            </span>
          </button>

          <div id="user-menu-dropdown" style="display:none; position:absolute; right:0; top:46px; width:220px; background:var(--apple-surface); border:1px solid var(--apple-border); border-radius:var(--radius-md); box-shadow:var(--shadow-lg); padding:8px; z-index:200;">
            <div style="padding:8px 12px; border-bottom:1px solid var(--apple-border); margin-bottom:6px;">
              <div style="font-size:13px; font-weight:700;">${user?.fullName || 'Guest User'}</div>
              <div style="font-size:11px; color:var(--apple-text-secondary);">${user?.email || 'guest@mrsall.ai'}</div>
            </div>
            <button class="btn-ghost user-menu-item" style="width:100%; justify-content:flex-start;" data-nav="settings">
              Settings & Keys
            </button>
            <button class="btn-ghost user-menu-item" style="width:100%; justify-content:flex-start;" data-nav="premium">
              Manage Subscription
            </button>
            ${user?.role === 'admin' ? `
              <button class="btn-ghost user-menu-item" style="width:100%; justify-content:flex-start; color:var(--apple-purple);" data-nav="admin">
                Admin Dashboard
              </button>
            ` : ''}
            <div style="border-top:1px solid var(--apple-border); margin-top:6px; padding-top:6px;">
              <button id="user-menu-logout" class="btn-ghost" style="width:100%; justify-content:flex-start; color:var(--apple-red);">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Language change
    const langSelect = this.container.querySelector('#header-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        i18n.setLanguage(e.target.value);
        toast.info(`Language switched to ${e.target.value.toUpperCase()}`);
      });
    }

    // Theme toggle
    const themeBtn = this.container.querySelector('#header-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = storage.getTheme();
        const next = cur === 'dark' ? 'light' : 'dark';
        storage.setTheme(next);
        this.render();
        toast.info(`Theme changed to ${next} mode`);
      });
    }

    // Upgrade button
    const upgradeBtn = this.container.querySelector('#header-btn-upgrade');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        modal.showUpgradeModal();
      });
    }

    // Notifications toggle
    const notifBtn = this.container.querySelector('#header-btn-notifications');
    const notifDrop = this.container.querySelector('#notifications-dropdown');
    if (notifBtn && notifDrop) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDrop.style.display = notifDrop.style.display === 'block' ? 'none' : 'block';
      });
    }

    // User profile toggle
    const userBtn = this.container.querySelector('#header-user-btn');
    const userDrop = this.container.querySelector('#user-menu-dropdown');
    if (userBtn && userDrop) {
      userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDrop.style.display = userDrop.style.display === 'block' ? 'none' : 'block';
      });
    }

    // Menu clicks
    const menuItems = this.container.querySelectorAll('.user-menu-item');
    menuItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const nav = btn.getAttribute('data-nav');
        window.location.hash = '#' + nav;
        if (userDrop) userDrop.style.display = 'none';
      });
    });

    const logoutBtn = this.container.querySelector('#user-menu-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        storage.setCurrentUser(null);
        toast.info('Signed out. Please sign in to continue.');
        modal.showAuthModal('login');
      });
    }

    // Mobile drawer toggle
    const mobileBtn = this.container.querySelector('#mobile-drawer-toggle');
    const sidebarEl = document.getElementById('app-sidebar-root');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (mobileBtn && sidebarEl) {
      mobileBtn.addEventListener('click', () => {
        sidebarEl.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('active');
      });
    }

    // Close popups on outer click
    document.addEventListener('click', () => {
      if (notifDrop) notifDrop.style.display = 'none';
      if (userDrop) userDrop.style.display = 'none';
    });
  }

  setTitle(title) {
    const el = document.getElementById('header-page-title');
    if (el) el.textContent = title;
  }
}

export const header = new HeaderComponent();
