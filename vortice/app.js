'use strict';

// ── Config ─────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '5527999953518'; // Vórtice Multimarcas — Guarapari/ES


const CATEGORIES = [
    { key: 'all', label: 'Todos', icon: 'ph-squares-four' },
    { key: 'vestidos', label: 'Vestidos', icon: 'ph-dress' },
    { key: 'blusas', label: 'Blusas', icon: 'ph-t-shirt' },
    { key: 'conjuntos', label: 'Conjuntos', icon: 'ph-stack' },
    { key: 'calcados', label: 'Calçados', icon: 'ph-sneaker' },
];

// ── Catálogo — somente fotos e categorias ──────────────────────────────
// Atribua a categoria correta a cada foto conforme o seu estoque.
const products = [
    { id: 1, imgPrefix: '02', categories: ['vestidos'] },
    { id: 2, imgPrefix: '03', categories: ['vestidos'] },
    { id: 3, imgPrefix: '04', categories: ['vestidos'] },
    { id: 4, imgPrefix: '08', categories: ['vestidos'] },
    { id: 5, imgPrefix: '09', categories: ['vestidos'] },
    { id: 6, imgPrefix: '11', categories: ['blusas'] },
    { id: 7, imgPrefix: '12', categories: ['blusas'] },
    { id: 8, imgPrefix: '05', categories: ['conjuntos'] },
    { id: 9, imgPrefix: '06', categories: ['conjuntos'] },
    { id: 10, imgPrefix: '07', categories: ['conjuntos'] },
    { id: 11, imgPrefix: '10', categories: ['conjuntos'] },
    { id: 12, imgPrefix: '13', categories: ['conjuntos'] },
    { id: 13, imgPrefix: '14', categories: ['conjuntos'] },
    { id: 14, imgPrefix: '15', categories: ['conjuntos'] },
    { id: 15, imgPrefix: '16', categories: ['conjuntos'] },
    { id: 16, imgPrefix: '01', categories: ['calcados'] },
];

// ── State ──────────────────────────────────────────────────────────────
let activeCategory = 'all';
let currentObserver = null;

// ── DOM ────────────────────────────────────────────────────────────────
const feedContainer = document.getElementById('feed-container');
const swipeIndicator = document.getElementById('swipe-indicator');
const slideCounterEl = document.getElementById('slide-counter');

// ── Helpers ────────────────────────────────────────────────────────────
function updateCounter(current, total) {
    if (!slideCounterEl) return;
    slideCounterEl.textContent = total > 0 ? `${current} / ${total}` : '—';
}

function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('visible')));
    setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 350); }, 2600);
}

// ── Category Pills ─────────────────────────────────────────────────────
function renderCategoryPills() {
    const container = document.getElementById('category-pills');
    if (!container) return;
    container.innerHTML = '';
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-pill' + (cat.key === activeCategory ? ' active' : '');
        btn.dataset.category = cat.key;
        btn.setAttribute('aria-pressed', String(cat.key === activeCategory));
        btn.innerHTML = `<i class="ph ${cat.icon}"></i>${cat.label}`;
        btn.addEventListener('click', () => setCategory(cat.key));
        container.appendChild(btn);
    });
}

function setCategory(key) {
    activeCategory = key;
    renderCategoryPills();
    renderFeed();
    feedContainer.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll('.sidebar-filter-btn[data-category]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === key);
    });
}

function getFiltered() {
    return activeCategory === 'all'
        ? products
        : products.filter(p => p.categories.includes(activeCategory));
}

// ── Render Feed ────────────────────────────────────────────────────────
function renderFeed() {
    if (currentObserver) { currentObserver.disconnect(); currentObserver = null; }
    feedContainer.innerHTML = '';

    const filtered = getFiltered();

    if (filtered.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-feed">
                <i class="ph ph-image-broken"></i>
                <p>Nenhuma foto nesta categoria.</p>
            </div>`;
        updateCounter(0, 0);
        return;
    }

    filtered.forEach((product, index) => {
        const slide = document.createElement('article');
        slide.className = 'product-slide' + (index === 0 ? ' active' : '');
        slide.dataset.productId = String(product.id);

        slide.innerHTML = `
            <div class="product-image-container">
                <picture>
                    <source srcset="images/fotos/${product.imgPrefix}.avif" type="image/avif">
                    <source srcset="images/fotos/${product.imgPrefix}.webp" type="image/webp">
                    <img
                        src="images/fotos/${product.imgPrefix}.webp"
                        alt="Foto ${product.imgPrefix}"
                        class="product-image"
                        loading="${index === 0 ? 'eager' : 'lazy'}"
                        decoding="async">
                </picture>
                <div class="slide-gradient-bottom"></div>
            </div>

            <div class="slide-bottom-bar">
                <button class="btn-ask-wa" data-id="${product.id}" data-action="ask">
                    <i class="ph ph-whatsapp-logo"></i> Pedir Informações
                </button>
            </div>`;

        feedContainer.appendChild(slide);
    });

    updateCounter(1, filtered.length);
    setupObserver(filtered);
}

// ── IntersectionObserver ───────────────────────────────────────────────
function setupObserver(filtered) {
    const slides = feedContainer.querySelectorAll('.product-slide');

    currentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            slides.forEach(s => s.classList.remove('active'));
            entry.target.classList.add('active');
            if (swipeIndicator && !swipeIndicator.classList.contains('hidden')) {
                swipeIndicator.classList.add('hidden');
            }
            updateCounter([...slides].indexOf(entry.target) + 1, filtered.length);
        });
    }, { root: feedContainer, rootMargin: '0px', threshold: 0.6 });

    slides.forEach(s => currentObserver.observe(s));
}

// ── Feed Click Delegation ──────────────────────────────────────────────
feedContainer.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="ask"]');
    if (!btn) return;
    const product = products.find(p => p.id === parseInt(btn.dataset.id, 10));
    if (product) askOnWhatsApp(product);
});

// ── WhatsApp — link da pagina do produto ──────────────────────────────
//
// Gera a URL do produto com base no endereco atual do site.
// Quando hospedado em HTTPS, o WhatsApp le o og:image da pagina
// e exibe a foto como card de preview na conversa automaticamente.
//
function getProductUrl(product) {
    // Deriva a URL base do endereco atual (funciona local e em producao)
    const href = window.location.href;
    const base = href.substring(0, href.lastIndexOf('/'));
    return `${base}/p/${product.imgPrefix}.html`;
}

function askOnWhatsApp(product) {
    const productUrl = getProductUrl(product);
    const msg = 'Ola Vortice!\n\nTenho interesse neste produto:\n' + productUrl;

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        '_blank',
        'noopener,noreferrer'
    );
}

// ── Mobile Menu ────────────────────────────────────────────────────────
window.toggleMenu = function () {
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', String(!isOpen));
};

window.showStoreInfo = function () {
    document.getElementById('store-info-panel').classList.remove('hidden');
};

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryPills();
    renderFeed();
    document.querySelectorAll('.sidebar-filter-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', () => setCategory(btn.dataset.category));
    });
});
