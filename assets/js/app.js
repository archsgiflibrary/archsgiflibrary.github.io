const i18n = {
  en: {
    'hero.title': "Arch's Gif Library",
    'hero.subtitle': "Your collection of hand-picked GIFs for Discord, social media & more",
    'stats.gifs': "GIFs",
    'stats.categories': "Categories",
    'stats.tags': "Tags",
    'search.placeholder': "Search GIFs by title, tags...",
    'filter.label': "Filter by category",
    'filter.all': "All",
    'filter.turkish': "Turkish",
    'filter.english': "English",
    'submit.title': "Submit GIF",
    'gallery.title': "GIF Gallery",
    'empty.title': "No GIFs found",
    'empty.subtitle': "Try adjusting your search or filter",
    'footer.made': "Made with ❤️ by Arch",
    'footer.github': "GitHub Repo",
    'footer.discord': "Discord",
    'discord': "Discord",
    'modal.title': "Submit a GIF",
    'modal.fields.title': "Title",
    'modal.fields.category': "Category",
    'modal.fields.url': "GIF URL (raw .gif link)",
    'modal.fields.tags': "Tags (comma separated)",
    'modal.fields.description': "Description (optional)",
    'modal.placeholders.title': "e.g., Sun Tzu Quote",
    'modal.placeholders.category': "Select category",
    'modal.placeholders.url': "https://example.com/animation.gif",
    'modal.placeholders.tags': "funny, meme, discord, reaction",
    'modal.placeholders.description': "Brief description...",
    'modal.hints.url': "Must be a direct link to a .gif file",
    'modal.hints.tags': "e.g., funny, meme, discord, reaction",
    'modal.cancel': "Cancel",
    'modal.submit': "Submit for Review",
    'modal.submitting': "Submitting..."
  },
  tr: {
    'hero.title': "Arch'ın Gif Kütüphanesi",
    'hero.subtitle': "Discord, sosyal medya ve daha fazlası için el seçilmiş GIF koleksiyonunuz",
    'stats.gifs': "GIFler",
    'stats.categories': "Kategoriler",
    'stats.tags': "Etiketler",
    'search.placeholder': "Başlık, etiketlere göre GIF ara...",
    'filter.label': "Kategoriye göre filtrele",
    'filter.all': "Hepsi",
    'filter.turkish': "Türkçe",
    'filter.english': "İngilizce",
    'submit.title': "GIF Gönder",
    'gallery.title': "GIF Galerisi",
    'empty.title': "GIF bulunamadı",
    'empty.subtitle': "Aramanızı veya filtrelerinizi değiştirmeyi deneyin",
    'footer.made': "Arch tarafından ❤️ ile yapıldı",
    'footer.github': "GitHub Deposu",
    'footer.discord': "Discord",
    'discord': "Discord",
    'modal.title': "GIF Gönder",
    'modal.fields.title': "Başlık",
    'modal.fields.category': "Kategori",
    'modal.fields.url': "GIF URL'si (ham .gif linki)",
    'modal.fields.tags': "Etiketler (virgülle ayrılmış)",
    'modal.fields.description': "Açıklama (isteğe bağlı)",
    'modal.placeholders.title': "örn., Sun Tzu Alıntısı",
    'modal.placeholders.category': "Kategori seçin",
    'modal.placeholders.url': "https://ornek.com/animasyon.gif",
    'modal.placeholders.tags': "eğlence, meme, discord, reaksiyon",
    'modal.placeholders.description': "Kısa açıklama...",
    'modal.hints.url': "Doğrudan .gif dosyasına link olmalı",
    'modal.hints.tags': "örn., eğlence, meme, discord, reaksiyon",
    'modal.cancel': "İptal",
    'modal.submit': "İnceleme İçin Gönder",
    'modal.submitting': "Gönderiliyor..."
  }
};

let currentLang = localStorage.getItem('agl-lang') || 'en';
let gifs = [];
let filteredGifs = [];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function applyI18n() {
  const dict = i18n[currentLang];
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
  $$('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (dict[key]) el.placeholder = dict[key];
  });
  $('#langCurrent').textContent = currentLang.toUpperCase();
  document.documentElement.lang = currentLang;
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'tr' : 'en';
  localStorage.setItem('agl-lang', currentLang);
  applyI18n();
  renderGallery();
}

function initTheme() {
  const saved = localStorage.getItem('agl-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('agl-theme', theme);
}

async function loadGifs() {
  try {
    const res = await fetch('gifs.json');
    if (!res.ok) throw new Error('Failed to load gifs.json');
    gifs = await res.json();
    updateStats();
    renderGallery();
  } catch (err) {
    console.error(err);
    showToast('error', currentLang === 'en' ? 'Failed to load GIFs' : 'GIFler yüklenemedi');
  }
}

function updateStats() {
  const categories = new Set(gifs.map(g => g.category));
  const tags = new Set(gifs.flatMap(g => g.tags));
  $('#totalGifs').textContent = gifs.length;
  $('#totalCategories').textContent = categories.size;
  $('#totalTags').textContent = tags.size;
}

function filterGifs() {
  const search = $('#searchInput').value.toLowerCase().trim();
  const category = $('#categoryFilter').value;

  filteredGifs = gifs.filter(gif => {
    const matchesSearch = !search ||
      gif.title[currentLang].toLowerCase().includes(search) ||
      gif.title[gif.category === 'tr' ? 'en' : 'tr'].toLowerCase().includes(search) ||
      gif.description[currentLang].toLowerCase().includes(search) ||
      gif.tags.some(t => t.toLowerCase().includes(search));

    const matchesCategory = category === 'all' || gif.category === category;
    return matchesSearch && matchesCategory;
  });

  renderGallery();
}

function renderGallery() {
  const grid = $('#galleryGrid');
  const empty = $('#emptyState');
  const countEl = $('#galleryCount');

  if (filteredGifs.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    countEl.textContent = '';
    return;
  }

  empty.hidden = true;
  countEl.textContent = `${filteredGifs.length} ${currentLang === 'en' ? 'GIFs' : 'GIF'} found`;

  grid.innerHTML = filteredGifs.map(gif => `
    <article class="gif-card" role="listitem" data-id="${gif.id}">
      <div class="gif-media">
        <img src="${gif.preview}" alt="" loading="lazy" width="${gif.width}" height="${gif.height}">
        <span class="gif-badge ${gif.category}">${gif.category.toUpperCase()}</span>
      </div>
      <div class="gif-info">
        <h3 class="gif-title">${escapeHtml(gif.title[currentLang])}</h3>
        <p class="gif-description">${escapeHtml(gif.description[currentLang])}</p>
        <div class="gif-tags">
          ${gif.tags.slice(0, 5).map(tag => `<span class="gif-tag">${escapeHtml(tag)}</span>`).join('')}
          ${gif.tags.length > 5 ? `<span class="gif-tag">+${gif.tags.length - 5}</span>` : ''}
        </div>
      </div>
      <div class="gif-actions">
        <button class="gif-btn primary copy-btn" data-url="${escapeHtml(gif.url)}" aria-label="${currentLang === 'en' ? 'Copy link' : 'Linki kopyala'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span data-i18n="gif.copy">${currentLang === 'en' ? 'Copy Link' : 'Linki Kopyala'}</span>
        </button>
        <a href="${escapeHtml(gif.url)}" target="_blank" rel="noopener noreferrer" class="gif-btn" aria-label="${currentLang === 'en' ? 'Open GIF' : 'GIF'i aç'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          <span data-i18n="gif.open">${currentLang === 'en' ? 'Open' : 'Aç'}</span>
        </a>
      </div>
    </article>
  `).join('');

  $$('.copy-btn', grid).forEach(btn => {
    btn.addEventListener('click', () => copyToClipboard(btn.dataset.url));
  });

  applyI18n();
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": ''' }[c]));
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('success', currentLang === 'en' ? 'Link copied!' : 'Link kopyalandı!');
  } catch {
    showToast('error', currentLang === 'en' ? 'Failed to copy' : 'Kopyalanamadı');
  }
}

function showToast(type, message) {
  const toast = $('#toast');
  const msg = $('#toastMessage');
  toast.className = `toast ${type}`;
  toast.querySelector('.toast-icon').innerHTML = type === 'success'
    ? '<polyline points="20 6 9 17 4 12"></polyline>'
    : type === 'error'
    ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
  msg.textContent = message;
  $('#toastModal').showModal();
  setTimeout(() => $('#toastModal').close(), 3000);
}

function openModal() {
  $('#submitForm').reset();
  $('#submitModal').showModal();
  $('#gifTitle').focus();
}

function closeModal() {
  $('#submitModal').close();
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = $('#modalSubmit');
  const btnText = $('.btn-text', submitBtn);
  const btnLoading = $('.btn-loading', submitBtn);

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;

  const formData = new FormData(form);
  const data = {
    title: formData.get('title').trim(),
    category: formData.get('category'),
    url: formData.get('url').trim(),
    tags: formData.get('tags').split(',').map(t => t.trim()).filter(Boolean),
    description: formData.get('description').trim()
  };

  try {
    const token = localStorage.getItem('agl-github-token');
    if (!token) {
      const entered = prompt(currentLang === 'en'
        ? 'Enter GitHub Personal Access Token (repo scope) to submit:'
        : 'GitHub Personal Access Token (repo scope) girin:');
      if (!entered) throw new Error('cancelled');
      localStorage.setItem('agl-github-token', entered.trim());
    }

    const res = await fetch('https://api.github.com/repos/archziwski/Arch-s-Gif-Library/issues', {
      method: 'POST',
      headers: {
        'Authorization': `token ${localStorage.getItem('agl-github-token')}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `[GIF Submission] ${data.title}`,
        body: `**Title:** ${data.title}\n**Category:** ${data.category}\n**URL:** ${data.url}\n**Tags:** ${data.tags.join(', ')}\n**Description:** ${data.description || 'N/A'}\n\n---\n*Submitted via AGL website*`,
        labels: ['gif-submission', data.category]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Submission failed');
    }

    showToast('success', currentLang === 'en' ? 'Submitted! It will be reviewed.' : 'Gönderildi! İncelenecek.');
    closeModal();
  } catch (err) {
    if (err.message !== 'cancelled') {
      showToast('error', currentLang === 'en' ? `Failed: ${err.message}` : `Başarısız: ${err.message}`);
    }
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
}

function initEventListeners() {
  $('#langToggle').addEventListener('click', toggleLang);
  $('#themeToggle').addEventListener('click', toggleTheme);
  $('#searchInput').addEventListener('input', filterGifs);
  $('#searchClear').addEventListener('click', () => {
    $('#searchInput').value = '';
    $('#searchClear').hidden = true;
    filterGifs();
  });
  $('#searchInput').addEventListener('input', () => {
    $('#searchClear').hidden = !$('#searchInput').value;
  });
  $('#categoryFilter').addEventListener('change', filterGifs);
  $('#submitBtn').addEventListener('click', openModal);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#submitForm').addEventListener('submit', handleSubmit);
  $('#submitModal').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); $('#toastModal').close(); } });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  applyI18n();
  initEventListeners();
  loadGifs();
});