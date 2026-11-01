/**
 * MR.SALL AI — Premium Subscription & Pricing Page
 */

import { storage } from '../services/storage.js';
import { modal } from '../components/modal.js';
import { toast } from '../components/toast.js';

export class PremiumPage {
  constructor() {
    this.isAnnual = false;
  }

  render(container) {
    const user = storage.getCurrentUser();
    const isPro = user?.tier === 'premium';
    const usage = storage.getUsage();
    const limits = storage.getUsageLimits(user?.tier);

    container.innerHTML = `
      <div class="page-inner" style="max-width:1080px;">
        <div class="page-header-block" style="text-align:center; margin-bottom:36px;">
          <div style="display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:99px; background:var(--brand-gradient); color:#fff; font-size:12px; font-weight:700; margin-bottom:12px;">
            <span>★</span> PRO SUBSCRIPTION TIERS
          </div>
          <h1 class="page-main-title" style="font-size:36px;" data-i18n="premium.title">Upgrade to Premium</h1>
          <p class="page-main-subtitle" style="margin:0 auto;" data-i18n="premium.subtitle">
            Supercharge your productivity with unlimited high-speed AI, cutting-edge models, and advanced tools.
          </p>

          <!-- Billing Period Toggle -->
          <div style="display:inline-flex; align-items:center; gap:12px; background:var(--apple-surface-secondary); padding:4px; border-radius:99px; margin-top:24px; border:1px solid var(--apple-border);">
            <button id="toggle-monthly" class="btn-ghost ${!this.isAnnual ? 'active-tab' : ''}" style="border-radius:99px; font-size:13px; font-weight:600; padding:6px 16px;">
              Monthly Billing
            </button>
            <button id="toggle-annual" class="btn-ghost ${this.isAnnual ? 'active-tab' : ''}" style="border-radius:99px; font-size:13px; font-weight:600; padding:6px 16px;">
              Annual Billing <span style="font-size:10px; font-weight:800; color:var(--apple-green); background:rgba(52,199,89,0.15); padding:2px 6px; border-radius:99px; margin-left:4px;">SAVE 20%</span>
            </button>
          </div>
        </div>

        <!-- Plan Pricing Cards Grid -->
        <div class="pricing-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:40px;">
          <!-- Standard Free Card -->
          <div class="apple-card" style="display:flex; flex-direction:column; justify-content:space-between; border:${!isPro ? '2px solid var(--apple-blue)' : '1px solid var(--apple-border)'};">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="font-size:20px; font-weight:700;">Standard Free</h3>
                ${!isPro ? `<span style="font-size:11px; font-weight:700; background:var(--apple-blue-light); color:var(--apple-blue); padding:3px 8px; border-radius:6px;">CURRENT PLAN</span>` : ''}
              </div>
              <div style="font-size:36px; font-weight:800; color:var(--apple-text); margin-bottom:4px;">
                $0
              </div>
              <p style="font-size:13px; color:var(--apple-text-secondary); margin-bottom:20px;">
                Essential AI capabilities for casual exploration and standard utility.
              </p>

              <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:13.5px;">
                <li style="display:flex; gap:8px;">✔ 20 AI Messages per day</li>
                <li style="display:flex; gap:8px;">✔ 10 Image Studio operations per day</li>
                <li style="display:flex; gap:8px;">✔ Standard Gemini 1.5 Flash model</li>
                <li style="display:flex; gap:8px;">✔ Core Developer & Cyber tools</li>
                <li style="display:flex; gap:8px; color:var(--apple-text-tertiary);">✖ Priority GPU cluster execution</li>
                <li style="display:flex; gap:8px; color:var(--apple-text-tertiary);">✖ High-resolution 4x image upscaling</li>
              </ul>
            </div>

            <div style="margin-top:28px;">
              <button class="btn-secondary" style="width:100%; padding:12px;" ${!isPro ? 'disabled' : ''}>
                ${!isPro ? 'Active Plan' : 'Downgrade to Free'}
              </button>
            </div>
          </div>

          <!-- MR.SALL PRO Card -->
          <div class="apple-card" style="display:flex; flex-direction:column; justify-content:space-between; border:${isPro ? '2px solid var(--apple-green)' : '2px solid var(--apple-purple)'}; position:relative; box-shadow:var(--brand-glow);">
            <div style="position:absolute; top:-12px; right:20px; background:var(--brand-gradient); color:#fff; font-size:10px; font-weight:800; padding:3px 10px; border-radius:99px; letter-spacing:0.5px;">
              RECOMMENDED
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="font-size:20px; font-weight:700; color:var(--apple-purple);">MR.SALL PRO</h3>
                ${isPro ? `<span style="font-size:11px; font-weight:700; background:rgba(52,199,89,0.15); color:var(--apple-green); padding:3px 8px; border-radius:6px;">ACTIVE</span>` : ''}
              </div>
              <div style="font-size:36px; font-weight:800; color:var(--apple-text); margin-bottom:4px;">
                ${this.isAnnual ? '$15' : '$19'}
                <span style="font-size:14px; font-weight:500; color:var(--apple-text-secondary);">/ user / mo</span>
              </div>
              <p style="font-size:13px; color:var(--apple-text-secondary); margin-bottom:20px;">
                Full-throttle intelligence for developers, architects, and power creators.
              </p>

              <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:13.5px;">
                <li style="display:flex; gap:8px; font-weight:600;"><span style="color:var(--apple-green);">✔</span> Unlimited AI Messages & Reasoning</li>
                <li style="display:flex; gap:8px; font-weight:600;"><span style="color:var(--apple-green);">✔</span> Unlimited 4x AI Upscale & Background Removal</li>
                <li style="display:flex; gap:8px; font-weight:600;"><span style="color:var(--apple-green);">✔</span> Priority Edge Worker routing with sub-second latency</li>
                <li style="display:flex; gap:8px; font-weight:600;"><span style="color:var(--apple-green);">✔</span> Full Cloudflare D1 history persistence & export</li>
                <li style="display:flex; gap:8px; font-weight:600;"><span style="color:var(--apple-green);">✔</span> Early access to new neural models & cyber modules</li>
              </ul>
            </div>

            <div style="margin-top:28px;">
              <button id="btn-pricing-upgrade-pro" class="btn-primary" style="width:100%; padding:12px;">
                ${isPro ? 'Manage Active Pro Subscription' : 'Upgrade to MR.SALL PRO'}
              </button>
            </div>
          </div>
        </div>

        <!-- Current Usage Telemetry -->
        <div class="apple-card" style="padding:24px;">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:14px;" data-i18n="premium.usageTitle">Your Usage Today</h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                <span data-i18n="premium.dailyMessages">Daily AI Messages</span>
                <strong>${usage.messages} / ${limits.maxMessages}</strong>
              </div>
              <div class="usage-bar-bg">
                <div class="usage-bar-fill" style="width: ${Math.min(100, (usage.messages / limits.maxMessages) * 100)}%;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                <span data-i18n="premium.dailyImages">Daily Image Operations</span>
                <strong>${usage.images} / ${limits.maxImages}</strong>
              </div>
              <div class="usage-bar-bg">
                <div class="usage-bar-fill" style="width: ${Math.min(100, (usage.images / limits.maxImages) * 100)}%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const tMonthly = container.querySelector('#toggle-monthly');
    const tAnnual = container.querySelector('#toggle-annual');

    tMonthly.addEventListener('click', () => {
      this.isAnnual = false;
      this.render(container);
    });

    tAnnual.addEventListener('click', () => {
      this.isAnnual = true;
      this.render(container);
    });

    const upgradeBtn = container.querySelector('#btn-pricing-upgrade-pro');
    upgradeBtn.addEventListener('click', () => {
      modal.showUpgradeModal();
    });
  }
}

export const premiumPage = new PremiumPage();
