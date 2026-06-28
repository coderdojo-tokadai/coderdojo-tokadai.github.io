/* ─── 桃花台コードクラブ — i18n runtime ─── */
const LANG_LABELS = { ja:'日本語', en:'English', pt:'Português', vi:'Tiếng Việt', es:'Español', zh:'中文', id:'Bahasa Indonesia' };
const LANG_FLAGS  = { ja:'🇯🇵', en:'🇬🇧', pt:'🇧🇷', vi:'🇻🇳', es:'🇪🇸', zh:'🇨🇳', id:'🇮🇩' };

const _cache = {};

async function loadLang(lang) {
  if (_cache[lang]) return _cache[lang];
  const res = await fetch(`i18n/${lang}.json`);
  _cache[lang] = await res.json();
  return _cache[lang];
}

function _applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });
}

async function applyLang(lang) {
  const t = await loadLang(lang).catch(() => loadLang('ja'));
  document.documentElement.lang = lang;
  _applyTranslations(t);
  // events.js から参照する現在の翻訳辞書を公開し、イベント表示の再描画を促す
  window.__i18nDict = t;
  document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang, t } }));
  const display = document.getElementById('langDisplay');
  if (display) display.textContent = LANG_FLAGS[lang] + ' ' + LANG_LABELS[lang];
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('lang-active', btn.dataset.lang === lang);
  });
}

function setLang(lang) {
  localStorage.setItem('cd-lang', lang);
  applyLang(lang);
  const dd = document.getElementById('langDropdown');
  if (dd) dd.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(localStorage.getItem('cd-lang') || 'ja');
  const btn = document.getElementById('langBtn');
  const dd  = document.getElementById('langDropdown');
  if (btn && dd) {
    btn.addEventListener('click', e => { e.stopPropagation(); dd.classList.toggle('open'); });
    document.addEventListener('click', () => dd.classList.remove('open'));
  }
});
