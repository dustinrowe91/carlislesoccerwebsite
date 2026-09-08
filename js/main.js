// Shared site behavior: loads header/footer partials, wires up nav, and
// renders any JSON-driven content blocks present on the current page.

async function includePartial(targetId, url) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const res = await fetch(url);
  target.innerHTML = await res.text();
}

function highlightActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.site-nav a[data-nav]').forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function wireNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

function formatDate(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

async function renderNewsPreview(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = await fetchJSON('data/news.json');
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
  const slice = typeof count === 'number' ? sorted.slice(0, count) : sorted;
  container.innerHTML = slice
    .map(
      (item) => `
      <article class="card">
        <div class="meta">${formatDate(item.date)}</div>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </article>`
    )
    .join('');
}

async function renderGallery(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = await fetchJSON('data/gallery.json');
  container.innerHTML = items
    .map(
      (item) => `
      <figure class="gallery-item">
        <div class="gallery-placeholder" style="background:${item.color};">${item.alt}</div>
        <figcaption class="gallery-caption">${item.caption}</figcaption>
      </figure>`
    )
    .join('');
}

async function renderSponsors(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const tiers = await fetchJSON('data/sponsors.json');
  container.innerHTML = tiers
    .map(
      (tier) => `
      <div class="sponsor-tier">
        <h3>${tier.tier}</h3>
        <div class="sponsor-grid">
          ${tier.sponsors
            .map(
              (s) => `
            <a class="sponsor-logo" href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`
            )
            .join('')}
        </div>
      </div>`
    )
    .join('');
}

async function initSite() {
  await Promise.all([
    includePartial('site-header', 'partials/header.html'),
    includePartial('site-footer', 'partials/footer.html'),
  ]);
  highlightActiveNav();
  wireNavToggle();
  setFooterYear();
}

document.addEventListener('DOMContentLoaded', initSite);
