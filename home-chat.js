/**
 * MR.SALL AI — Flagship AI Chat Interface
 * Responsive conversation engine, prompt cards, streaming, markdown, and attachments
 */

import { i18n } from '../services/i18n.js';
import { api } from '../services/api.js';
import { storage } from '../services/storage.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';
import { usageMeter } from '../components/usage-meter.js';

export class ChatPage {
  constructor() {
    this.currentConversationId = null;
    this.messages = [];
    this.isGenerating = false;
    this.abortController = null;
    this.pendingAttachment = null;
  }

  render(container) {
    container.innerHTML = `
      <div class="chat-page-wrapper" style="display:flex; height:100%; width:100%; position:relative; overflow:hidden;">
        <!-- Chat History Mini Sidebar (Desktop) -->
        <aside class="chat-history-sidebar" id="chat-history-sidebar" style="width:260px; border-right:1px solid var(--apple-border); background-color:var(--apple-surface); display:flex; flex-direction:column; padding:16px 12px; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:12px; font-weight:700; color:var(--apple-text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Recent Chats</span>
            <button id="btn-chat-new" class="btn-ghost" style="padding:4px 8px; font-size:12px; font-weight:600; color:var(--apple-blue);">+ New</button>
          </div>
          <div id="chat-conversations-list" style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:4px;">
            <!-- Populated dynamically -->
          </div>
        </aside>

        <!-- Main Chat Center -->
        <main class="chat-main-area" style="flex:1; display:flex; flex-direction:column; height:100%; position:relative; background-color:var(--apple-bg);">
          <!-- Messages Scrollport -->
          <div id="chat-messages-scrollport" style="flex:1; overflow-y:auto; padding:24px 32px 140px; display:flex; flex-direction:column; gap:20px;">
            <!-- Welcome Banner (Shows when conversation is empty) -->
            <div id="chat-welcome-banner" style="text-align:center; max-width:760px; margin:40px auto 20px; animation:fadeIn 0.4s var(--ease-apple);">
              <div style="display:inline-flex; padding:12px; background:var(--brand-gradient); border-radius:24px; box-shadow:var(--brand-glow); margin-bottom:18px;">
                <img src="assets/logo.png" width="56" height="56" alt="MR.SALL" style="object-fit:contain;" />
              </div>
              <h1 class="page-main-title" style="font-size:32px; margin-bottom:10px;" data-i18n="chat.welcomeTitle">
                How can I help you today?
              </h1>
              <p class="page-main-subtitle" style="margin:0 auto 32px; font-size:16px;" data-i18n="chat.welcomeSubtitle">
                Experience the next echelon of artificial intelligence. Ask questions, analyze data, craft code, or synthesize imagery.
              </p>

              <!-- Prompt Suggestion Cards -->
              <div class="chat-suggestions-grid" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:left;">
                <div class="apple-card suggestion-card" data-prompt-key="write" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>✍️</span> <span data-i18n="chat.suggestions.write">Write an article</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">Transform ideas into publication-ready essays and blogs.</div>
                </div>

                <div class="apple-card suggestion-card" data-prompt-key="explain" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>💡</span> <span data-i18n="chat.suggestions.explain">Explain a topic</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">Break down quantum computing, neural nets, or finance.</div>
                </div>

                <div class="apple-card suggestion-card" data-prompt-key="code" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>💻</span> <span data-i18n="chat.suggestions.code">Generate code</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">TypeScript LRU cache with clean architecture & tests.</div>
                </div>

                <div class="apple-card suggestion-card" data-prompt-key="translate" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>🌐</span> <span data-i18n="chat.suggestions.translate">Translate text</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">Nuanced trilingual Arabic, English, and French translation.</div>
                </div>

                <div class="apple-card suggestion-card" data-prompt-key="analyze" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>👁️</span> <span data-i18n="chat.suggestions.analyze">Analyze an image</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">Inspect visuals, chart statistics, and diagram structures.</div>
                </div>

                <div class="apple-card suggestion-card" data-prompt-key="prompt" style="cursor:pointer; padding:16px; border-radius:14px;">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px; display:flex; align-items:center; gap:6px;">
                    <span>⚡</span> <span data-i18n="chat.suggestions.prompt">Create a prompt</span>
                  </div>
                  <div style="font-size:12px; color:var(--apple-text-secondary); line-height:1.4;">Formulate high-performance system instructions.</div>
                </div>
              </div>
            </div>

            <!-- Messages Stream Container -->
            <div id="chat-messages-list" style="display:flex; flex-direction:column; gap:18px; max-width:820px; width:100%; margin:0 auto;">
              <!-- Dynamic Messages Injected Here -->
            </div>
          </div>

          <!-- Bottom Floating Input Bar -->
          <div class="chat-input-container" style="position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top, var(--apple-bg) 75%, transparent); padding:16px 24px 24px;">
            <div class="chat-input-box apple-card" style="max-width:820px; margin:0 auto; padding:10px 14px; display:flex; flex-direction:column; gap:8px; border-radius:20px; box-shadow:var(--shadow-lg); background:var(--apple-surface);">
              <!-- Attachment Preview Area -->
              <div id="chat-attachment-preview" style="display:none; align-items:center; gap:8px; padding:4px 8px; background:var(--apple-surface-secondary); border-radius:10px; font-size:12px;">
                <span id="chat-attachment-name" style="font-weight:600;"></span>
                <button id="chat-attachment-remove" style="color:var(--apple-red); cursor:pointer;">✕</button>
              </div>

              <!-- Textarea & Actions -->
              <div style="display:flex; align-items:flex-end; gap:10px;">
                <textarea id="chat-input-textarea" rows="1" placeholder="Message MR.SALL AI... (Press Enter to send, Shift+Enter for new line)" style="flex:1; border:none; resize:none; max-height:160px; line-height:1.4; padding:8px 0; background:transparent; font-size:15px; box-shadow:none;"></textarea>
                
                <div class="chat-input-actions" style="display:flex; align-items:center; gap:8px;">
                  <!-- File/Image upload button -->
                  <label for="chat-file-input" class="header-icon-btn" style="cursor:pointer;" title="Attach file or image">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <input type="file" id="chat-file-input" style="display:none;" accept="image/*,.txt,.json,.md,.csv,.pdf" />
                  </label>

                  <!-- Send / Stop button -->
                  <button id="chat-send-btn" class="btn-primary" style="border-radius:12px; width:40px; height:40px; padding:0; display:flex; align-items:center; justify-content:center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div style="font-size:11px; color:var(--apple-text-secondary); text-align:center; margin-top:8px;" data-i18n="chat.disclaimer">
              MR.SALL AI can make mistakes. Verify important information.
            </div>
          </div>
        </main>
      </div>
    `;

    this.bindEvents(container);
    this.loadConversations();
    this.startNewConversation();
  }

  bindEvents(container) {
    const textarea = container.querySelector('#chat-input-textarea');
    const sendBtn = container.querySelector('#chat-send-btn');
    const fileInput = container.querySelector('#chat-file-input');
    const newChatBtn = container.querySelector('#btn-chat-new');
    const attachmentPreview = container.querySelector('#chat-attachment-preview');
    const attachmentName = container.querySelector('#chat-attachment-name');
    const attachmentRemove = container.querySelector('#chat-attachment-remove');

    // Auto-expand textarea
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    });

    // Enter key handling
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });

    sendBtn.addEventListener('click', () => {
      this.handleSend();
    });

    newChatBtn.addEventListener('click', () => {
      this.startNewConversation();
    });

    // File Attachment
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.pendingAttachment = file;
        attachmentName.textContent = `📎 ${file.name} (${Math.round(file.size / 1024)} KB)`;
        attachmentPreview.style.display = 'flex';
      }
    });

    attachmentRemove.addEventListener('click', () => {
      this.pendingAttachment = null;
      fileInput.value = '';
      attachmentPreview.style.display = 'none';
    });

    // Suggestion Cards click
    const cards = container.querySelectorAll('.suggestion-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-prompt-key');
        const promptText = i18n.t(`chat.suggestions.${key}Prompt`);
        if (promptText) {
          textarea.value = promptText;
          textarea.style.height = 'auto';
          textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
          textarea.focus();
        }
      });
    });

    // Global listener for new chat event from sidebar
    window.addEventListener('mrsall:new-chat', () => {
      this.startNewConversation();
    });
  }

  startNewConversation() {
    this.currentConversationId = 'conv_' + Date.now();
    this.messages = [];
    const banner = document.getElementById('chat-welcome-banner');
    const list = document.getElementById('chat-messages-list');
    if (banner) banner.style.display = 'block';
    if (list) list.innerHTML = '';
  }

  loadConversations() {
    const listEl = document.getElementById('chat-conversations-list');
    if (!listEl) return;
    const convs = storage.getConversations();

    if (convs.length === 0) {
      listEl.innerHTML = `
        <div style="font-size:12px; color:var(--apple-text-secondary); padding:10px;">
          No conversations yet.
        </div>
      `;
      return;
    }

    listEl.innerHTML = convs.map(c => `
      <div class="chat-conv-item" data-id="${c.id}" style="padding:8px 10px; border-radius:8px; font-size:13px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; background-color:var(--apple-surface-secondary);">
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;">${c.title || 'Conversation'}</span>
        <button class="conv-del-btn" data-id="${c.id}" style="color:var(--apple-text-tertiary); font-size:12px;">✕</button>
      </div>
    `).join('');

    listEl.querySelectorAll('.chat-conv-item').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('conv-del-btn')) return;
        const id = el.getAttribute('data-id');
        this.loadSpecificConversation(id);
      });
    });

    listEl.querySelectorAll('.conv-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        storage.deleteConversation(id);
        this.loadConversations();
        if (this.currentConversationId === id) this.startNewConversation();
      });
    });
  }

  loadSpecificConversation(id) {
    const convs = storage.getConversations();
    const conv = convs.find(c => c.id === id);
    if (!conv) return;

    this.currentConversationId = conv.id;
    this.messages = conv.messages || [];

    const banner = document.getElementById('chat-welcome-banner');
    if (banner) banner.style.display = this.messages.length === 0 ? 'block' : 'none';

    const list = document.getElementById('chat-messages-list');
    if (list) {
      list.innerHTML = '';
      this.messages.forEach(m => this.appendMessageDOM(m));
    }
  }

  async handleSend() {
    if (this.isGenerating) return;
    const textarea = document.getElementById('chat-input-textarea');
    const content = (textarea.value || '').trim();
    if (!content && !this.pendingAttachment) return;

    const banner = document.getElementById('chat-welcome-banner');
    if (banner) banner.style.display = 'none';

    // Build message
    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      content: content,
      attachment: this.pendingAttachment ? { name: this.pendingAttachment.name, size: this.pendingAttachment.size } : null,
      createdAt: new Date().toISOString()
    };

    this.messages.push(userMsg);
    this.appendMessageDOM(userMsg);

    textarea.value = '';
    textarea.style.height = 'auto';
    this.pendingAttachment = null;
    const preview = document.getElementById('chat-attachment-preview');
    if (preview) preview.style.display = 'none';

    // Create assistant placeholder message
    const assistantMsg = {
      id: 'msg_ai_' + Date.now(),
      sender: 'assistant',
      content: '',
      createdAt: new Date().toISOString()
    };
    this.messages.push(assistantMsg);
    const bubbleEl = this.appendMessageDOM(assistantMsg, true);

    this.isGenerating = true;
    this.updateSendButtonState(true);

    try {
      let accumulated = '';
      const responseStream = api.streamChat(this.messages.slice(0, -1));

      for await (const chunk of responseStream) {
        accumulated += chunk;
        bubbleEl.querySelector('.bubble-content').innerHTML = this.renderMarkdown(accumulated);
        this.scrollToBottom();
      }

      assistantMsg.content = accumulated;

      // Update conversation in storage
      storage.saveConversation({
        id: this.currentConversationId,
        title: this.messages[0]?.content.substring(0, 32) || 'New Conversation',
        messages: this.messages,
        updatedAt: new Date().toISOString()
      });

      this.loadConversations();
      usageMeter.render();
    } catch (err) {
      console.error('Chat error:', err);
      const isConfigError = err.message.includes('CONFIG_REQUIRED');

      bubbleEl.querySelector('.bubble-content').innerHTML = `
        <div style="color:var(--apple-red); background:rgba(255, 59, 48, 0.08); padding:12px; border-radius:10px; border:1px solid rgba(255, 59, 48, 0.2);">
          <div style="font-weight:700; margin-bottom:4px;">⚠️ ${isConfigError ? 'AI Provider Setup Required' : 'Request Failed'}</div>
          <div style="font-size:13px; line-height:1.4;">${err.message}</div>
          ${isConfigError ? `
            <button id="btn-chat-configure-key" class="btn-primary" style="margin-top:10px; font-size:12px; padding:6px 14px;">
              Connect Google Gemini API Key
            </button>
          ` : `
            <button id="btn-chat-retry" class="btn-secondary" style="margin-top:10px; font-size:12px; padding:6px 14px;">
              Retry Request
            </button>
          `}
        </div>
      `;

      if (isConfigError) {
        bubbleEl.querySelector('#btn-chat-configure-key')?.addEventListener('click', () => {
          modal.showApiKeyModal();
        });
      } else {
        bubbleEl.querySelector('#btn-chat-retry')?.addEventListener('click', () => {
          this.messages.pop(); // remove failed
          this.handleSend();
        });
      }
    } finally {
      this.isGenerating = false;
      this.updateSendButtonState(false);
      this.bindMessageCopyButtons(bubbleEl);
    }
  }

  updateSendButtonState(isBusy) {
    const btn = document.getElementById('chat-send-btn');
    if (!btn) return;
    if (isBusy) {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;
      btn.style.background = 'var(--apple-red)';
    } else {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      btn.style.background = 'var(--brand-gradient)';
    }
  }

  appendMessageDOM(msg, isTyping = false) {
    const list = document.getElementById('chat-messages-list');
    if (!list) return null;

    const row = document.createElement('div');
    row.className = `chat-message-row ${msg.sender === 'user' ? 'message-user' : 'message-ai'}`;
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.alignItems = 'flex-start';
    if (msg.sender === 'user') row.style.flexDirection = 'row-reverse';

    const avatar = msg.sender === 'user'
      ? `<div style="width:34px; height:34px; border-radius:50%; background:var(--apple-surface-tertiary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">👤</div>`
      : `<div style="width:34px; height:34px; border-radius:10px; background:var(--brand-gradient); display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:var(--shadow-sm);"><img src="assets/logo.png" width="22" height="22" alt="MR.SALL" style="object-fit:contain;" /></div>`;

    row.innerHTML = `
      ${avatar}
      <div class="message-bubble apple-card" style="max-width:85%; padding:14px 18px; border-radius:18px; ${msg.sender === 'user' ? 'background:var(--apple-surface-secondary);' : 'background:var(--apple-surface);'}">
        ${msg.attachment ? `<div style="font-size:11.5px; color:var(--apple-blue); font-weight:600; margin-bottom:6px;">📎 ${msg.attachment.name}</div>` : ''}
        <div class="bubble-content" style="font-size:14.5px; line-height:1.6; word-break:break-word;">
          ${isTyping ? `<span class="typing-indicator" style="display:inline-block; animation:pulseGlow 1.5s infinite;">Thinking...</span>` : this.renderMarkdown(msg.content)}
        </div>
        ${msg.sender === 'assistant' ? `
          <div class="bubble-footer" style="display:flex; justify-content:flex-end; gap:8px; margin-top:10px; padding-top:8px; border-top:1px solid var(--apple-border);">
            <button class="btn-ghost btn-copy-msg" style="padding:3px 8px; font-size:11px;" title="Copy response">Copy</button>
            <button class="btn-ghost btn-fav-msg" style="padding:3px 8px; font-size:11px;" title="Save to favorites">★ Save</button>
          </div>
        ` : ''}
      </div>
    `;

    list.appendChild(row);
    this.scrollToBottom();
    this.bindMessageCopyButtons(row, msg.content);
    return row;
  }

  bindMessageCopyButtons(row, content) {
    const copyBtn = row.querySelector('.btn-copy-msg');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = row.querySelector('.bubble-content').innerText;
        navigator.clipboard.writeText(text);
        toast.success('Copied response to clipboard!');
      });
    }

    const favBtn = row.querySelector('.btn-fav-msg');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const text = row.querySelector('.bubble-content').innerText;
        storage.addFavorite({
          itemType: 'message',
          title: 'AI Response snippet',
          content: text.substring(0, 300)
        });
        toast.success('Saved to favorites!');
      });
    }

    // Code copy buttons inside rendered blocks
    row.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pre = btn.closest('.code-block-wrapper').querySelector('pre code');
        if (pre) {
          navigator.clipboard.writeText(pre.innerText);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
          toast.success('Code copied to clipboard!');
        }
      });
    });
  }

  renderMarkdown(text) {
    if (!text) return '';
    let html = text
      // Escape HTML tags to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks ```lang ... ```
      .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `
          <div class="code-block-wrapper" style="margin:12px 0; border-radius:10px; overflow:hidden; border:1px solid var(--apple-border); background:var(--apple-surface-secondary);">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 12px; background:var(--apple-surface-tertiary); font-size:11px; font-family:var(--font-mono); font-weight:600;">
              <span>${lang || 'code'}</span>
              <button class="btn-ghost code-copy-btn" style="padding:2px 6px; font-size:11px;">Copy</button>
            </div>
            <pre style="padding:12px; margin:0; overflow-x:auto; font-family:var(--font-mono); font-size:13px; line-height:1.45;"><code class="language-${lang}">${code}</code></pre>
          </div>
        `;
      })
      // Inline code `code`
      .replace(/`([^`]+)`/g, '<code style="background:var(--apple-surface-secondary); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12.5px;">$1</code>')
      // Bold **text**
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\s*-\s+(.*)$/gm, '<li style="margin-left:20px;">$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return html;
  }

  scrollToBottom() {
    const port = document.getElementById('chat-messages-scrollport');
    if (port) {
      port.scrollTop = port.scrollHeight;
    }
  }
}

export const chatPage = new ChatPage();
