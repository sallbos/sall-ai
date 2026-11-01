/**
 * MR.SALL AI — Internationalization (i18n) Service
 * Supports English (LTR), Arabic (RTL), and French (LTR)
 */

class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('mrsall_lang') || 'en';
    this.translations = {};
    this.listeners = [];
  }

  async init() {
    try {
      const [en, ar, fr] = await Promise.all([
        fetch('localization/en.json').then(r => r.json()),
        fetch('localization/ar.json').then(r => r.json()),
        fetch('localization/fr.json').then(r => r.json())
      ]);
      this.translations = { en, ar, fr };
    } catch (err) {
      console.warn('Could not load localization files via fetch; using embedded defaults', err);
      this.translations = { en: {}, ar: {}, fr: {} };
    }
    this.applyLanguage(this.currentLang);
  }

  setTranslations(lang, dict) {
    this.translations[lang] = dict;
  }

  async setLanguage(lang) {
    if (!['en', 'ar', 'fr'].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('mrsall_lang', lang);
    this.applyLanguage(lang);
    this.notify();
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    this.translateDOM();
  }

  t(path, fallback = '') {
    if (!path) return fallback;
    const keys = path.split('.');
    let dict = this.translations[this.currentLang] || this.translations['en'] || {};
    
    for (const key of keys) {
      if (dict && typeof dict === 'object' && key in dict) {
        dict = dict[key];
      } else {
        // Fallback to English
        let enDict = this.translations['en'] || {};
        for (const k of keys) {
          if (enDict && typeof enDict === 'object' && k in enDict) {
            enDict = enDict[k];
          } else {
            return fallback || path;
          }
        }
        return enDict || fallback || path;
      }
    }
    return dict || fallback || path;
  }

  translateDOM(root = document) {
    const elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.getAttribute('placeholder')) {
            el.setAttribute('placeholder', text);
          } else {
            el.value = text;
          }
        } else {
          el.textContent = text;
        }
      }
    });

    const attrElements = root.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(el => {
      const pair = el.getAttribute('data-i18n-attr').split(':');
      if (pair.length === 2) {
        const [attr, key] = pair;
        el.setAttribute(attr, this.t(key));
      }
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => cb(this.currentLang));
  }
}

export const i18n = new I18nService();
