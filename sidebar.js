/**
 * MR.SALL AI — Application Sidebar Component
 */

import { i18n } from '../services/i18n.js';
import { storage } from '../services/storage.js';
import { usageMeter } from './usage-meter.js';

export class SidebarComponent {
  constructor() {
    this.container = null;
    this.isCollapsed = false;
  }

  render(containerId = 'app-sidebar-root') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    const user = storage.getCurrentUser();
    const isAdmin = user?.role === 'admin';

    this.container.innerHTML = `
      <div class="sidebar-brand-wrapper">
        <a href="#home" class="brand-link">
          <img src="assets/logo.png" alt="MR.SALL AI" class="brand-logo-img" />
          <div class="brand-name-group">
            <span class="brand-title">MR.SALL <span style="color:var(--apple-blue);">AI</span></span>
            <span class="brand-slogan" data-i18n="brand.slogan">INTELLIGENCE WITHOUT LIMITS</span>
          </div>
        </a>
        <button id="sidebar-collapse-toggle" class="sidebar-toggle-btn" title="Toggle Sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="sidebar-nav-container">
        <button id="btn-sidebar-new-chat" class="sidebar-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span data-i18n="nav.newChat">New Conversation</span>
        </button>

        <span class="nav-section-title">Core AI Workspace</span>
        <a href="#home" class="nav-item" data-route="home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span data-i18n="nav.home">Home</span>
        </a>
        <a href="#chat" class="nav-item" data-route="chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span data-i18n="nav.chat">AI Chat</span>
        </a>
        <a href="#image-studio" class="nav-item" data-route="image-studio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span data-i18n="nav.imageStudio">Image Studio</span>
        </a>
        <a href="#writing-studio" class="nav-item" data-route="writing-studio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span data-i18n="nav.writingStudio">AI Writing</span>
          <span class="nav-item-badge">9 tools</span>
        </a>

        <span class="nav-section-title">Professional Suites</span>
        <a href="#dev-tools" class="nav-item" data-route="dev-tools">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          <span data-i18n="nav.devTools">Developer Tools</span>
          <span class="nav-item-badge">8 tools</span>
        </a>
        <a href="#cyber-tools" class="nav-item" data-route="cyber-tools">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span data-i18n="nav.cyberTools">Cyber Tools</span>
        </a>
        <a href="#translation" class="nav-item" data-route="translation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span data-i18n="nav.translation">Translation</span>
          <span class="nav-item-badge">EN·AR·FR</span>
        </a>

        <span class="nav-section-title">Personal</span>
        <a href="#history" class="nav-item" data-route="history">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span data-i18n="nav.history">My History</span>
        </a>
        <a href="#favorites" class="nav-item" data-route="favorites">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span data-i18n="nav.favorites">Favorites</span>
        </a>
        <a href="#settings" class="nav-item" data-route="settings">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          <span data-i18n="nav.settings">Settings</span>
        </a>
        <a href="#premium" class="nav-item" data-route="premium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <span data-i18n="nav.premium">Premium</span>
        </a>

        ${isAdmin ? `
          <span class="nav-section-title">Administration</span>
          <a href="#admin" class="nav-item" data-route="admin" style="color:var(--apple-purple);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span data-i18n="nav.admin">Admin Dashboard</span>
          </a>
        ` : ''}
      </div>

      <div class="sidebar-footer">
        <div id="sidebar-usage-widget"></div>
      </div>
    `;

    usageMeter.render();
    this.bindEvents();
    this.updateActiveItem();
  }

  bindEvents() {
    const toggle = this.container.querySelector('#sidebar-collapse-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.isCollapsed = !this.isCollapsed;
        this.container.classList.toggle('collapsed', this.isCollapsed);
      });
    }

    const newChatBtn = this.container.querySelector('#btn-sidebar-new-chat');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        window.location.hash = '#chat';
        window.dispatchEvent(new CustomEvent('mrsall:new-chat'));
      });
    }

    window.addEventListener('hashchange', () => this.updateActiveItem());
  }

  updateActiveItem() {
    const hash = (window.location.hash || '#home').replace('#', '');
    const items = this.container.querySelectorAll('.nav-item');
    items.forEach(el => {
      const route = el.getAttribute('data-route');
      if (route === hash || (hash === '' && route === 'home')) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
}

export const sidebar = new SidebarComponent();
