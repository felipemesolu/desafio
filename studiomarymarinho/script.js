

// ── HEADER SCROLL ─────────────────────────────────────────────
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── MOBILE MENU ───────────────────────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = mobileOverlay.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on mobile link click
mobileOverlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

// (Treatment tabs logic removed as sections are now separated)

// ── GALLERY LIGHTBOX ─────────────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lb-img');
const lbCaption    = document.getElementById('lb-caption');
const lbClose      = document.getElementById('lb-close');
const lbPrev       = document.getElementById('lb-prev');
const lbNext       = document.getElementById('lb-next');

// Build image data array from gallery items
const galleryData = Array.from(galleryItems).map(item => {
  const img = item.querySelector('img');
  const cap = item.querySelector('.gallery-item-overlay span');
  return {
    src: img.src,
    alt: img.alt,
    caption: cap ? cap.textContent : ''
  };
});

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const { src, alt, caption } = galleryData[index];
  lbImg.src = src;
  lbImg.alt = alt;
  lbCaption.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  const { src, alt, caption } = galleryData[currentIndex];
  lbImg.style.opacity = '0';
  setTimeout(() => { lbImg.src = src; lbImg.alt = alt; lbCaption.textContent = caption; lbImg.style.opacity = '1'; }, 200);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryData.length;
  const { src, alt, caption } = galleryData[currentIndex];
  lbImg.style.opacity = '0';
  setTimeout(() => { lbImg.src = src; lbImg.alt = alt; lbCaption.textContent = caption; lbImg.style.opacity = '1'; }, 200);
}

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// Close on backdrop click
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PARALLAX HERO BG TEXT ────────────────────────────────────
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBgText.style.transform = `translateY(calc(-50% + ${y * 0.3}px))`;
  }, { passive: true });
}

// ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObs.observe(s));

// Add active nav style dynamically
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active { opacity: 1; }
.nav-link.active::after { content:''; display:block; width:100%; height:1px; background:var(--sage); margin-top:2px; }`;
document.head.appendChild(navStyle);

// ── WHATSAPP DYNAMIC MESSAGES ─────────────────────────────────
const waBaseUrl = 'https://wa.me/5527988193633?text=';

// Funções utilitárias para codificar o texto
const encodeMsg = (msg) => encodeURIComponent(msg);

// 1. Float Button
const waFloat = document.getElementById('whatsapp-float');
if (waFloat) waFloat.href = waBaseUrl + encodeMsg('Olá, Mary! Estava navegando no site e gostaria de tirar uma dúvida.');

// 2. Nav CTA (Desktop & Mobile)
const navCta = document.getElementById('nav-cta');
if (navCta) navCta.href = waBaseUrl + encodeMsg('Olá, Mary! Gostaria de agendar um horário.');

const mobCta = document.querySelector('.mob-cta');
if (mobCta) mobCta.href = waBaseUrl + encodeMsg('Olá, Mary! Gostaria de agendar um horário.');

// 3. Hero CTA & Footer Banner CTA
const heroCta = document.getElementById('hero-cta');
if (heroCta) heroCta.href = waBaseUrl + encodeMsg('Olá, Mary! Gostaria de agendar um horário.');

const ctaMain = document.getElementById('cta-main');
if (ctaMain) ctaMain.href = waBaseUrl + encodeMsg('Olá, Mary! Gostaria de agendar um horário.');

const midCta = document.getElementById('mid-cta');
if (midCta) midCta.href = waBaseUrl + encodeMsg('Olá, Mary! Gostaria de conversar sobre o melhor tratamento para o meu caso.');

// 4. Service Cards
document.querySelectorAll('.service-card').forEach(card => {
  const cta = card.querySelector('.card-cta');
  const title = card.querySelector('h3');
  if (cta && title) {
    const treatmentName = title.textContent.trim();
    cta.href = waBaseUrl + encodeMsg(`Olá, Mary! Gostaria de saber mais sobre o tratamento: ${treatmentName}`);
  }
});
