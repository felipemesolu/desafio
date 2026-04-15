// v3/script.js

document.addEventListener('DOMContentLoaded', () => {

  // ===== LIGHTBOX GALERIA COM SWIPER =====
  const triggers = document.querySelectorAll('.gallery-trigger');
  const galleryModal = document.getElementById('gallery-modal');
  const galleryClose = document.getElementById('gallery-close');
  const galleryCounter = document.getElementById('gallery-counter');

  let modalSwiper;

  // Inicializar o swiper
  if (typeof Swiper !== 'undefined') {
    modalSwiper = new Swiper('.modal-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: false,
      grabCursor: true,
      keyboard: {
        enabled: true,
      },
      navigation: {
        nextEl: '.modal-swiper-next',
        prevEl: '.modal-swiper-prev',
      },
      on: {
        slideChange: function () {
          updateCounter(this.activeIndex);
        }
      }
    });
  }

  function updateCounter(index) {
    if (galleryCounter && modalSwiper) {
      galleryCounter.textContent = `${index + 1} / ${modalSwiper.slides.length}`;
    }
  }

  function openGallery(index) {
    if (!galleryModal) return;
    
    // Mostra o modal e trava scroll
    galleryModal.classList.add('is-open');
    galleryModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Vai para a imagem que a pessoa clicou e atualiza counter
    if (modalSwiper) {
      modalSwiper.slideTo(index, 0); // O '0' faz com pule para a imagem na hora
      updateCounter(index);
    }
  }

  function closeGallery() {
    if (!galleryModal) return;
    galleryModal.classList.remove('is-open');
    galleryModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Evento em cada imagem da grid
  triggers.forEach((img, index) => {
    img.addEventListener('click', () => {
      openGallery(index);
    });
  });

  // Fechar clicando no "X"
  if (galleryClose) {
    galleryClose.addEventListener('click', closeGallery);
  }

  // Esc para fechar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal && galleryModal.classList.contains('is-open')) {
      closeGallery();
    }
  });

  // ===== ANIMAÇÃO DE SCROLL (Intersection Observer Limpo) =====
  const blocks = document.querySelectorAll('.content-block, .outro');
  
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Adiciona visível e remove observer para animar só 1 vez
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12, // Aciona quando 12% do bloco aparece
      rootMargin: '0px 0px -40px 0px' 
    });

    blocks.forEach((block, index) => {
      // O Javascript adiciona a classe inicial pra não quebrar quem tem JS desativado
      block.classList.add('scroll-reveal');
      // Delay dinâmico para seções que carregam juntas não piscarem simultaneamente
      block.style.transitionDelay = `${index * 60}ms`;
      observer.observe(block);
    });
  }

});
