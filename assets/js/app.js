(function() {
  'use strict';

  const i18n = {
    en: {
      'hero.title': "Arch's Gif Library",
      'hero.subtitle': "Your collection of hand-picked GIFs for Discord, social media & more",
      'stats.gifs': "GIFs",
      'stats.categories': "Categories",
      'stats.tags': "Tags",
      'search.placeholder': "Search GIFs by title, tags...",
      'search.hint': "Press <kbd>/</kbd> to focus",
      'filter.label': "Filter by category",
      'filter.all': "All",
      'filter.turkish': "Turkish",
      'filter.english': "English",
      'submit.title': "Submit GIF",
      'gallery.title': "GIF Gallery",
      'nav.discord': "Discord",
      'empty.title': "No GIFs found",
      'empty.subtitle': "Try adjusting your search or filter",
      'empty.clear': "Clear filters",
      'loading': "Loading GIFs...",
      'gif.copy': "Copy Link",
      'gif.open': "Open",
      'gif.copied': "Copied!",
      'footer.made': "Made with {heart} by Arch",
      'footer.github': "GitHub",
      'footer.discord': "Discord",
      'footer.submit': "Submit GIF",
      'modal.title': "Submit a GIF",
      'modal.fields.title': "Title",
      'modal.fields.category': "Category",
      'modal.fields.url': "GIF URL",
      'modal.fields.tags': "Tags",
      'modal.fields.description': "Description (optional)",
      'modal.placeholders.title': "e.g., Sun Tzu Quote",
      'modal.placeholders.category': "Select category",
      'modal.placeholders.url': "https://example.com/animation.gif",
      'modal.placeholders.tags': "funny, meme, discord",
      'modal.placeholders.description': "Brief description...",
      'modal.hints.url': "Direct link to a .gif file (raw URL)",
      'modal.hints.tags': "Comma separated: funny, meme, discord",
      'modal.cancel': "Cancel",
      'modal.submit': "Submit for Review",
      'modal.submitting': "Submitting...",
      'toast.copied': "Link copied to clipboard!",
      'toast.copyFailed': "Failed to copy link. Try the Open button.",
      'toast.saved': "Submitted! It will be reviewed.",
      'toast.failed': "Submission failed",
      'toast.loaded': "Failed to load GIFs",
      'toast.toggleTheme': "Theme switched to",
      'toast.toggleLang': "Language switched to",
      'gallery.found': "found",
      'gallery.found_one': "GIF found",
      'gallery.found_many': "GIFs found",
      'shortcut.search': "Search",
      'shortcut.close': "Close"
    },
    tr: {
      'hero.title': "Arch'ın Gif Kütüphanesi",
      'hero.subtitle': "Discord, sosyal medya ve daha fazlası için el seçilmiş GIF koleksiyonunuz",
      'stats.gifs': "GIFler",
      'stats.categories': "Kategoriler",
      'stats.tags': "Etiketler",
      'search.placeholder': "Başlık veya etikete göre GIF ara...",
      'search.hint': "Odaklanmak için <kbd>/</kbd>",
      'filter.label': "Kategoriye göre filtrele",
      'filter.all': "Hepsi",
      'filter.turkish': "Türkçe",
      'filter.english': "İngilizce",
      'submit.title': "GIF Gönder",
      'gallery.title': "GIF Galerisi",
      'nav.discord': "Discord",
      'empty.title': "GIF bulunamadı",
      'empty.subtitle': "Aramanızı veya filtrelerinizi değiştirmeyi deneyin",
      'empty.clear': "Filtreleri temizle",
      'loading': "GIFler yükleniyor...",
      'gif.copy': "Linki Kopyala",
      'gif.open': "Aç",
      'gif.copied': "Kopyalandı!",
      'footer.made': "Arch tarafından {heart} ile yapıldı",
      'footer.github': "GitHub",
      'footer.discord': "Discord",
      'footer.submit': "GIF Gönder",
      'modal.title': "GIF Gönder",
      'modal.fields.title': "Başlık",
      'modal.fields.category': "Kategori",
      'modal.fields.url': "GIF URL'si",
      'modal.fields.tags': "Etiketler",
      'modal.fields.description': "Açıklama (isteğe bağlı)",
      'modal.placeholders.title': "örn., Sun Tzu Alıntısı",
      'modal.placeholders.category': "Kategori seçin",
      'modal.placeholders.url': "https://ornek.com/animasyon.gif",
      'modal.placeholders.tags': "eğlence, meme, discord",
      'modal.placeholders.description': "Kısa açıklama...",
      'modal.hints.url': "Doğrudan .gif dosyasına link (ham URL)",
      'modal.hints.tags': "Virgülle ayrılmış: eğlence, meme, discord",
      'modal.cancel': "İptal",
      'modal.submit': "İnceleme İçin Gönder",
      'modal.submitting': "Gönderiliyor...",
      'toast.copied': "Link panoya kopyalandı!",
      'toast.copyFailed': "Link kopyalanamadı. Aç butonunu deneyin.",
      'toast.saved': "Gönderildi! İncelenecek.",
      'toast.failed': "Gönderim başarısız",
      'toast.loaded': "GIFler yüklenemedi",
      'toast.toggleTheme': "Tema değiştirildi:",
      'toast.toggleLang': "Dil değiştirildi:",
      'gallery.found': "bulundu",
      'gallery.found_one': "GIF bulundu",
      'gallery.found_many': "GIF bulundu",
      'shortcut.search': "Ara",
      'shortcut.close': "Kapat"
    }
  };

  const LANG_NAMES = { en: 'English', tr: 'Türkçe' };
  let currentLang = 'en';
  let gifs = [];
  let filteredGifs = [];
  let copiedTimeout = null;

  try { currentLang = localStorage.getItem('agl-lang') || 'en'; } catch (e) {}

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const t = (key) => i18n[currentLang][key] || key;

  function applyI18n() {
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      let text = t(key);
      if (key === 'footer.made') text = text.replace('{heart}', '<span class="heart">❤️</span>');
      el.innerHTML = text;
    });
    $$('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    const lc = $('#langCurrent');
    if (lc) lc.textContent = currentLang.toUpperCase();
    $('#searchHint') && ($('#searchHint').innerHTML = t('search.hint'));
    document.documentElement.lang = currentLang;
    // Update select options
    $$('option[data-i18n]').forEach(opt => { opt.textContent = t(opt.dataset.i18n); });
  }

  /* ---------- THEME ---------- */
  function getTheme() {
    return document.documentElement.dataset.theme || 'light';
  }

  function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('agl-theme', next); } catch (e) {}
    showToast('info', `${t('toast.toggleTheme')} ${next === 'dark' ? '🌙' : '☀️'}`);
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  /* ---------- LANGUAGE ---------- */
  function toggleLang() {
    currentLang = currentLang === 'en' ? 'tr' : 'en';
    try { localStorage.setItem('agl-lang', currentLang); } catch (e) {}
    applyI18n();
    renderGallery();
    showToast('info', `${t('toast.toggleLang')} ${LANG_NAMES[currentLang]}`);
  }

  /* ---------- DATA ---------- */
  async function loadGifs() {
    const loading = $('#loadingState');
    const grid = $('#galleryGrid');
    if (loading) loading.hidden = false;
    try {
      const res = await fetch('gifs.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status');
      gifs = await res.json();
      updateStats();
      renderGallery();
    } catch (err) {
      console.error('Failed to load GIFs:', err);
      grid.innerHTML = '';
      showToast('error', t('toast.loaded'));
    } finally {
      if (loading) loading.hidden = true;
    }
  }

  function updateStats() {
    const cats = new Set(gifs.map(g => g.category));
    const tags = new Set(gifs.flatMap(g => g.tags || []));
    setText('#totalGifs', gifs.length);
    setText('#totalCategories', cats.size);
    setText('#totalTags', tags.size);
  }

  function setText(sel, val) { const el = $(sel); if (el) el.textContent = val; }

  /* ---------- FILTERING ---------- */
  function filterGifs() {
    const search = ($('#searchInput').value || '').toLowerCase().trim();
    const category = ($('#categoryFilter') || {}).value || 'all';

    filteredGifs = gifs.filter(gif => {
      const searchText = [
        gif.title && gif.title[currentLang],
        gif.title && gif.title[currentLang === 'en' ? 'tr' : 'en'],
        gif.description && gif.description[currentLang],
        (gif.tags || []).join(' ')
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = !search || searchText.includes(search);
      const matchesCategory = category === 'all' || gif.category === category;
      return matchesSearch && matchesCategory;
    });

    renderGallery();
  }

  /* ---------- RENDER ---------- */
  function renderGallery() {
    const grid = $('#galleryGrid');
    const empty = $('#emptyState');
    const countEl = $('#galleryCount');
    if (!grid) return;

    if (filteredGifs.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      if (countEl) countEl.textContent = '';
      return;
    }
    if (empty) empty.hidden = true;

    const count = filteredGifs.length;
    const label = count === 1
      ? t('gallery.found_one')
      : `${count} ${t('gallery.found_many')}`;
    if (countEl) countEl.textContent = label;

    grid.innerHTML = filteredGifs.map((gif, i) => `
      <article class="gif-card" role="listitem" data-id="${escapeHtml(gif.id || '')}" style="--card-index:${Math.min(i, 6)}" tabindex="0" aria-label="${escapeHtml(gif.title[currentLang])}">
        <a class="gif-media-link" href="${escapeHtml(gif.url)}" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
          <span class="gif-media">
            <img src="${escapeHtml(gif.preview || gif.url)}" alt="" loading="lazy" ${gif.width ? `width="${gif.width}"` : ''} ${gif.height ? `height="${gif.height}"` : ''}>
            <span class="gif-badge ${gif.category === 'tr' ? 'tr' : 'en'}">${gif.category === 'tr' ? '🇹🇷' : '🇬🇧'}</span>
          </span>
        </a>
        <div class="gif-info">
          <h3 class="gif-title">${escapeHtml(gif.title[currentLang])}</h3>
          ${gif.description && gif.description[currentLang] ? `<p class="gif-description">${escapeHtml(gif.description[currentLang])}</p>` : ''}
          ${(gif.tags && gif.tags.length) ? `<div class="gif-tags">${gif.tags.slice(0, 5).map(tag => `<span class="gif-tag">${escapeHtml(tag)}</span>`).join('')}${gif.tags.length > 5 ? `<span class="gif-tag">+${gif.tags.length - 5}</span>` : ''}</div>` : ''}
        </div>
        <div class="gif-actions">
          <button type="button" class="gif-btn primary copy-btn" data-url="${escapeHtml(gif.url)}" aria-label="${escapeHtml(gif.title[currentLang])} - ${t('gif.copy')}" data-action="copy">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span class="btn-label">${t('gif.copy')}</span>
          </button>
          <a href="${escapeHtml(gif.url)}" target="_blank" rel="noopener noreferrer" class="gif-btn secondary" data-action="open" aria-label="${escapeHtml(gif.title[currentLang])} - ${t('gif.open')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            <span class="btn-label">${t('gif.open')}</span>
          </a>
        </div>
      </article>
    `).join('');

    applyI18n();
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  /* ---------- COPY ---------- */
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }

  async function handleCopy(btn) {
    const url = btn.dataset.url;
    const label = btn.querySelector('.btn-label');
    const ok = await copyToClipboard(url);
    if (ok) {
      btn.classList.add('copied');
      const original = label.textContent;
      label.textContent = t('gif.copied');
      clearTimeout(copiedTimeout);
      copiedTimeout = setTimeout(() => {
        btn.classList.remove('copied');
        label.textContent = original;
      }, 1600);
      showToast('success', t('toast.copied'));
    } else {
      showToast('error', t('toast.copyFailed'));
    }
  }

  /* ---------- TOAST ---------- */
  function showToast(type, message) {
    const container = $('#toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
      success: '<polyline points="20 6 9 17 4 12"></polyline>',
      error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
      info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
    };
    toast.innerHTML = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${icons[type] || icons.info}</svg><span class="toast-message">${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  }

  /* ---------- MODAL ---------- */
  function openModal() {
    const form = $('#submitForm');
    form.reset();
    $('#submitModal').showModal();
    setTimeout(() => $('#gifTitle').focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = $('#submitModal');
    if (modal && modal.open) {
      modal.close();
      document.body.style.overflow = '';
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = $('#modalSubmit');

    const formData = new FormData(form);
    const data = {
      title: (formData.get('title') || '').trim(),
      category: formData.get('category'),
      url: (formData.get('url') || '').trim(),
      tags: (formData.get('tags') || '').split(',').map(s => s.trim()).filter(Boolean),
      description: (formData.get('description') || '').trim()
    };

    if (!data.title || !data.category || !data.url) {
      showToast('error', t('toast.failed'));
      return;
    }

    const body = [
      '**Title:** ' + data.title,
      '**Category:** ' + data.category,
      '**URL:** ' + data.url,
      '**Tags:** ' + (data.tags.join(', ') || 'N/A'),
      '**Description:** ' + (data.description || 'N/A'),
      '',
      '---',
      '_Submitted via AGL website_'
    ].join('\n');

    const issueUrl = 'https://github.com/archsgiflibrary/archsgiflibrary.github.io/issues/new?' +
      new URLSearchParams({
        title: '[GIF Submission] ' + data.title,
        body: body,
        labels: 'gif-submission,' + data.category
      }).toString();

    window.open(issueUrl, '_blank', 'noopener,noreferrer');
    closeModal();
    showToast('success', t('toast.saved'));
  }

  /* ---------- EVENT DELEGATION ---------- */
  function setupEventDelegation() {
    // Gallery actions (works for dynamically added cards)
    const grid = $('#galleryGrid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-action="copy"]');
        if (copyBtn) { e.preventDefault(); e.stopPropagation(); handleCopy(copyBtn); }
      });
      // Card keyboard activation
      grid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('gif-card')) {
          const link = e.target.querySelector('.gif-media-link');
          if (link) { e.preventDefault(); window.open(link.href, '_blank'); }
        }
      });
    }

    // Toolbar & header
    const bind = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', fn); };
    bind('#langToggle', toggleLang);
    bind('#themeToggle', toggleTheme);
    bind('#submitBtn', openModal);
    $('#footerSubmit') && $('#footerSubmit').addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    bind('#modalClose', closeModal);
    bind('#modalCancel', closeModal);
    bind('#clearFilters', clearFilters);
    $('#searchClear') && $('#searchClear').addEventListener('click', () => {
      $('#searchInput').value = '';
      $('#searchClear').hidden = true;
      filterGifs();
      $('#searchInput').focus();
    });

    // Search input
    const searchInput = $('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        $('#searchClear').hidden = !searchInput.value;
        filterGifs();
      });
      // Debounced search
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterGifs, 150);
      });
    }

    // Filter select
    $('#categoryFilter') && $('#categoryFilter').addEventListener('change', filterGifs);

    // Submit form
    $('#submitForm') && $('#submitForm').addEventListener('submit', handleSubmit);

    // Modal close on backdrop click and Esc
    const modal = $('#submitModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-overlay')) closeModal();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // '/' focuses search (when not typing in input)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && document.activeElement.tagName !== 'SELECT') {
        e.preventDefault();
        $('#searchInput').focus();
      }
      // Esc closes modal
      if (e.key === 'Escape') closeModal();
    });
  }

  function clearFilters() {
    const searchInput = $('#searchInput');
    if (searchInput) searchInput.value = '';
    const catFilter = $('#categoryFilter');
    if (catFilter) catFilter.value = 'all';
    const clearBtn = $('#searchClear');
    if (clearBtn) clearBtn.hidden = true;
    filterGifs();
    if (searchInput) searchInput.focus();
  }

  /* ---------- INIT ---------- */
  function init() {
    applyI18n();
    setupEventDelegation();
    loadGifs();
    $('#searchClear').hidden = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();