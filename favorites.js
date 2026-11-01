/**
 * MR.SALL AI — Favorites & Bookmarks Page
 */

import { storage } from '../services/storage.js';
import { toast } from '../components/toast.js';

export class FavoritesPage {
  render(container) {
    const favs = storage.getFavorites();

    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block">
          <h1 class="page-main-title" data-i18n="favorites.title">Bookmarked Favorites</h1>
          <p class="page-main-subtitle" data-i18n="favorites.subtitle">
            Quick access to your saved prompts, code snippets, and generated masterpieces.
          </p>
        </div>

        <div id="favorites-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:18px;">
          ${this.buildFavoritesHtml(favs)}
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  buildFavoritesHtml(favs) {
    if (favs.length === 0) {
      return `
        <div class="apple-card" style="grid-column:1/-1; padding:48px 24px; text-align:center; color:var(--apple-text-secondary);">
          <div style="font-size:36px; margin-bottom:10px;">★</div>
          <div style="font-weight:600; font-size:16px; margin-bottom:4px;">No Favorites Saved</div>
          <p style="font-size:13.5px;">Click the star icon on any AI response or tool output to save it here for quick access.</p>
        </div>
      `;
    }

    return favs.map(f => `
      <div class="apple-card" style="display:flex; flex-direction:column; justify-content:space-between; gap:12px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h3 style="font-size:14.5px; font-weight:700; color:var(--apple-text);">${f.title}</h3>
          <button class="btn-fav-remove" data-id="${f.id}" style="color:var(--apple-red); font-size:14px; cursor:pointer;" title="Remove favorite">✕</button>
        </div>
        <div style="font-size:13px; color:var(--apple-text-secondary); line-height:1.5; max-height:160px; overflow-y:auto; background:var(--apple-surface-secondary); padding:10px; border-radius:8px; white-space:pre-wrap;">${f.content}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--apple-border); padding-top:8px;">
          <span style="font-size:11px; color:var(--apple-text-tertiary);">${new Date(f.createdAt).toLocaleDateString()}</span>
          <button class="btn-ghost btn-fav-copy" data-content="${encodeURIComponent(f.content)}" style="font-size:11.5px;">Copy</button>
        </div>
      </div>
    `).join('');
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-fav-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        storage.removeFavorite(id);
        toast.info('Item removed from favorites.');
        this.render(container);
      });
    });

    container.querySelectorAll('.btn-fav-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = decodeURIComponent(btn.getAttribute('data-content'));
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      });
    });
  }
}

export const favoritesPage = new FavoritesPage();
