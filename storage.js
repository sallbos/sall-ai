/**
 * MR.SALL AI — Persistent Client Storage & State Manager
 * Handles LocalStorage, IndexedDB conversation cache, and Quotas
 */

export class StorageService {
  constructor() {
    this.USER_KEY = 'mrsall_current_user';
    this.TOKEN_KEY = 'mrsall_auth_token';
    this.THEME_KEY = 'mrsall_theme';
    this.CONV_KEY = 'mrsall_conversations';
    this.FAV_KEY = 'mrsall_favorites';
    this.HISTORY_KEY = 'mrsall_tool_history';
    this.API_KEY_GEMINI = 'mrsall_key_gemini';
    this.API_KEY_OPENAI = 'mrsall_key_openai';
    this.USAGE_KEY = 'mrsall_daily_usage';
  }

  // --- Auth & User ---
  getCurrentUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) {
      // Default demo guest / starter user
      return {
        id: 'usr_guest_demo',
        email: 'alex@mrsall.ai',
        fullName: 'Alex Vance',
        tier: 'free',
        role: 'user',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(this.USER_KEY);
    } else {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getAuthToken() {
    return localStorage.getItem(this.TOKEN_KEY) || 'demo_jwt_session_token';
  }

  setAuthToken(token) {
    if (!token) {
      localStorage.removeItem(this.TOKEN_KEY);
    } else {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  // --- Theme ---
  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // --- API Keys ---
  getGeminiKey() {
    return localStorage.getItem(this.API_KEY_GEMINI) || '';
  }

  setGeminiKey(key) {
    localStorage.setItem(this.API_KEY_GEMINI, (key || '').trim());
  }

  getOpenAIKey() {
    return localStorage.getItem(this.API_KEY_OPENAI) || '';
  }

  setOpenAIKey(key) {
    localStorage.setItem(this.API_KEY_OPENAI, (key || '').trim());
  }

  // --- Usage Quotas ---
  getUsage() {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(this.USAGE_KEY);
    let data = { date: today, messages: 0, images: 0, devOps: 0 };
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.date === today) {
          data = parsed;
        }
      } catch (e) {}
    }
    return data;
  }

  incrementUsage(type = 'messages') {
    const usage = this.getUsage();
    if (type === 'messages') usage.messages++;
    else if (type === 'images') usage.images++;
    else if (type === 'dev') usage.devOps++;
    localStorage.setItem(this.USAGE_KEY, JSON.stringify(usage));
    return usage;
  }

  getUsageLimits(tier = 'free') {
    if (tier === 'premium') {
      return { maxMessages: 1000, maxImages: 500, maxDev: 2000 };
    }
    return { maxMessages: 20, maxImages: 10, maxDev: 50 };
  }

  // --- Conversations ---
  getConversations() {
    const raw = localStorage.getItem(this.CONV_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveConversation(conv) {
    const list = this.getConversations();
    const idx = list.findIndex(c => c.id === conv.id);
    if (idx >= 0) {
      list[idx] = conv;
    } else {
      list.unshift(conv);
    }
    localStorage.setItem(this.CONV_KEY, JSON.stringify(list));
  }

  deleteConversation(id) {
    const list = this.getConversations().filter(c => c.id !== id);
    localStorage.setItem(this.CONV_KEY, JSON.stringify(list));
  }

  // --- Tool History ---
  getToolHistory() {
    const raw = localStorage.getItem(this.HISTORY_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addToolHistory(entry) {
    const history = this.getToolHistory();
    const item = {
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...entry
    };
    history.unshift(item);
    if (history.length > 200) history.pop();
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    return item;
  }

  clearToolHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  }

  // --- Favorites ---
  getFavorites() {
    const raw = localStorage.getItem(this.FAV_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  addFavorite(fav) {
    const list = this.getFavorites();
    const item = {
      id: 'fav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
      ...fav
    };
    list.unshift(item);
    localStorage.setItem(this.FAV_KEY, JSON.stringify(list));
    return item;
  }

  removeFavorite(id) {
    const list = this.getFavorites().filter(f => f.id !== id);
    localStorage.setItem(this.FAV_KEY, JSON.stringify(list));
  }
}

export const storage = new StorageService();
