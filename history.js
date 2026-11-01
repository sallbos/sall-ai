/**
 * MR.SALL AI — Activity & History Management
 */

import { storage } from '../services/storage.js';
import { toast } from '../components/toast.js';

export class HistoryPage {
  constructor() {
    this.filter = 'all';
  }

  render(container) {
    const convs = storage.getConversations();
    const tools = storage.getToolHistory();

    container.innerHTML = `
      <div class="page-inner">
        <div class="page-header-block" style="display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <h1 class="page-main-title" data-i18n="history.title">My Activity & History</h1>
            <p class="page-main-subtitle" data-i18n="history.subtitle">
              Access your previous chat sessions and generated tool results.
            </p>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="btn-export-history" class="btn-secondary" style="font-size:12.5px;">Export JSON</button>
            <button id="btn-clear-history" class="btn-ghost" style="font-size:12.5px; color:var(--apple-red);">Clear All</button>
          </div>
        </div>

        <!-- Filter Pills -->
        <div style="display:flex; gap:8px; margin-bottom:20px;">
          <button class="btn-ghost hist-filter-btn active-tab" data-filter="all">All (${convs.length + tools.length})</button>
          <button class="btn-ghost hist-filter-btn" data-filter="chat">Conversations (${convs.length})</button>
          <button class="btn-ghost hist-filter-btn" data-filter="tool">Tools & Utilities (${tools.length})</button>
        </div>

        <!-- History List -->
        <div id="history-items-list" style="display:flex; flex-direction:column; gap:12px;">
          ${this.buildListHtml(convs, tools, this.filter)}
        </div>
      </div>
    `;

    this.bindEvents(container, convs, tools);
  }

  buildListHtml(convs, tools, filter) {
    let items = [];

    if (filter === 'all' || filter === 'chat') {
      convs.forEach(c => {
        items.push({
          type: 'chat',
          id: c.id,
          title: c.title || 'Chat Conversation',
          subtitle: `${c.messages?.length || 0} messages`,
          date: c.updatedAt || new Date().toISOString()
        });
      });
    }

    if (filter === 'all' || filter === 'tool') {
      tools.forEach(t => {
        items.push({
          type: 'tool',
          id: t.id,
          title: t.toolName,
          subtitle: t.inputSnippet || t.outputSnippet || '',
          date: t.createdAt
        });
      });
    }

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (items.length === 0) {
      return `
        <div class="apple-card" style="padding:48px 24px; text-align:center; color:var(--apple-text-secondary);">
          <div style="font-size:32px; margin-bottom:8px;">📁</div>
          <div style="font-weight:600; font-size:15px; margin-bottom:4px;">No Activity Found</div>
          <p style="font-size:13px;">Start a conversation or run an AI tool to record activity.</p>
        </div>
      `;
    }

    return items.map(item => `
      <div class="apple-card" style="padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:36px; height:36px; border-radius:10px; background:${item.type === 'chat' ? 'var(--apple-blue-light)' : 'rgba(99,102,241,0.1)'}; display:flex; align-items:center; justify-content:center; font-size:16px;">
            ${item.type === 'chat' ? '💬' : '⚡'}
          </div>
          <div>
            <div style="font-weight:600; font-size:14px; color:var(--apple-text);">${item.title}</div>
            <div style="font-size:12px; color:var(--apple-text-secondary); max-width:540px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.subtitle}</div>
          </div>
        </div>
        <div style="font-size:11.5px; color:var(--apple-text-tertiary);">
          ${new Date(item.date).toLocaleDateString()}
        </div>
      </div>
    `).join('');
  }

  bindEvents(container, convs, tools) {
    const list = container.querySelector('#history-items-list');
    container.querySelectorAll('.hist-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.hist-filter-btn').forEach(b => b.classList.remove('active-tab'));
        btn.classList.add('active-tab');
        this.filter = btn.getAttribute('data-filter');
        list.innerHTML = this.buildListHtml(convs, tools, this.filter);
      });
    });

    container.querySelector('#btn-export-history').addEventListener('click', () => {
      const data = { conversations: convs, toolHistory: tools };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `mrsall-history-${Date.now()}.json`;
      a.click();
      toast.success('History exported successfully!');
    });

    container.querySelector('#btn-clear-history').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all history?')) {
        localStorage.removeItem('mrsall_conversations');
        storage.clearToolHistory();
        toast.info('All history cleared.');
        this.render(container);
      }
    });
  }
}

export const historyPage = new HistoryPage();
