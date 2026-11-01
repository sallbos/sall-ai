/**
 * MR.SALL AI — Usage Meter Component
 * Shows daily message/image limits and upgrade incentive
 */

import { storage } from '../services/storage.js';

export class UsageMeterComponent {
  constructor(containerId = 'sidebar-usage-widget') {
    this.containerId = containerId;
  }

  render() {
    const el = document.getElementById(this.containerId);
    if (!el) return;

    const user = storage.getCurrentUser();
    const usage = storage.getUsage();
    const limits = storage.getUsageLimits(user?.tier);
    const isPro = user?.tier === 'premium';

    const pct = isPro ? 100 : Math.min(100, Math.round((usage.messages / limits.maxMessages) * 100));

    el.innerHTML = `
      <div class="sidebar-usage-card">
        <div class="usage-header">
          <span>${isPro ? 'Pro Active' : 'Daily AI Quota'}</span>
          <span style="font-size:11px; color:var(--apple-text-secondary);">
            ${isPro ? 'Unlimited' : `${usage.messages} / ${limits.maxMessages}`}
          </span>
        </div>
        <div class="usage-bar-bg">
          <div class="usage-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="usage-caption">${isPro ? 'No restrictions' : `${limits.maxMessages - usage.messages} queries left`}</span>
          ${!isPro ? `<button id="btn-meter-upgrade" style="font-size:10.5px; font-weight:700; color:var(--apple-blue); cursor:pointer;">Upgrade</button>` : ''}
        </div>
      </div>
    `;

    const upBtn = el.querySelector('#btn-meter-upgrade');
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        window.location.hash = '#premium';
      });
    }
  }
}

export const usageMeter = new UsageMeterComponent();
