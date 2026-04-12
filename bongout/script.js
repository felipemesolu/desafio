document.addEventListener('DOMContentLoaded', () => {

    /** --- Slider com Rolagem Automática --- **/
    function initAutoSlider(slider) {
        if (!slider) return;

        const INTERVAL_MS = 2500;    // tempo entre avanços
        const PAUSE_AFTER_MS = 4000; // pausa após interação
        let timer = null;
        let isPaused = false;
        let pauseTimeout = null;

        function getSlideWidth() {
            const firstSlide = slider.querySelector('.sp-slide');
            if (!firstSlide) return 260;
            const gap = parseFloat(window.getComputedStyle(slider).gap) || 24;
            return firstSlide.offsetWidth + gap;
        }

        function advance() {
            if (isPaused) return;
            const slideWidth = getSlideWidth();
            const maxScroll = slider.scrollWidth - slider.clientWidth;
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

        slider.addEventListener('mouseenter', pause);
        slider.addEventListener('touchstart', pause, { passive: true });
        slider.addEventListener('scroll', () => {
            clearTimeout(pauseTimeout);
            isPaused = true;
            pauseTimeout = setTimeout(() => { isPaused = false; }, PAUSE_AFTER_MS);
        }, { passive: true });
        slider.addEventListener('mouseleave', () => {
            clearTimeout(pauseTimeout);
            isPaused = false;
        });

        timer = setInterval(advance, INTERVAL_MS);
    }

    document.querySelectorAll('.sp-slider').forEach(initAutoSlider);

    /** --- Smooth scroll para links internos --- **/
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /** --- Form Handling (Mock) --- **/
    const premiumForm = document.getElementById('premiumForm');
    if (premiumForm) {
        premiumForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = premiumForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-circle-notch"></i> Enviando...';
            btn.style.opacity = '0.7';
            setTimeout(() => {
                btn.innerHTML = '✅ Recebemos! Em breve entraremos em contato.';
                btn.style.background = '#166534';
                btn.style.opacity = '1';
                premiumForm.reset();
            }, 1800);
        });
    }
});
