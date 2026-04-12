/* ============================
   BonGoût — Script Principal
   ============================ */

/** --- Slider com Rolagem Automática --- **/
function initAutoSlider(slider) {
  if (!slider) return;

  const INTERVAL_MS = 2500;   // tempo entre avanços
  const PAUSE_AFTER_MS = 4000; // pausa após interação do usuário
  let timer = null;
  let isPaused = false;
  let pauseTimeout = null;

  function getSlideWidth() {
    const firstSlide = slider.querySelector('.sp-slide');
    if (!firstSlide) return 260;
    const style = window.getComputedStyle(firstSlide);
    const gap = parseFloat(window.getComputedStyle(slider).gap) || 24;
    return firstSlide.offsetWidth + gap;
  }

  function advance() {
    if (isPaused) return;

    const slideWidth = getSlideWidth();
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // Chegou no final? Volta suavemente ao início
    if (slider.scrollLeft >= maxScroll - 4) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
    }
  }

  function pause() {
    isPaused = true;
    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => { isPaused = false; }, PAUSE_AFTER_MS);
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(advance, INTERVAL_MS);
  }

  // Pausa ao interagir
  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('touchstart', pause, { passive: true });
  slider.addEventListener('scroll', () => {
    // pausa temporariamente quando o usuário rola manualmente
    clearTimeout(pauseTimeout);
    isPaused = true;
    pauseTimeout = setTimeout(() => { isPaused = false; }, PAUSE_AFTER_MS);
  }, { passive: true });

  // Retoma ao sair
  slider.addEventListener('mouseleave', () => {
    clearTimeout(pauseTimeout);
    isPaused = false;
  });

  start();
}

/** --- Formulário (mock) --- **/
function initForm() {
  const form = document.getElementById('premiumForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Enviando... <i class="ph-fill ph-circle-notch"></i>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✅ Recebemos! Em breve entraremos em contato.';
      btn.style.background = '#166534';
      form.reset();
    }, 1800);
  });
}

/** --- Init --- **/
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa todos os sliders da página
  document.querySelectorAll('.sp-slider').forEach(initAutoSlider);
  initForm();
});
