/* =================================================================
   MAI DOCES v2 — script.js
   Navbar scroll · Mobile menu · GSAP animations
   ================================================================= */


/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });


/* ---- MOBILE MENU ---- */
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity  = '';
        spans[2].style.transform = '';
    });
});


/* ---- GSAP ANIMATIONS ---- */
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const heroTl = gsap.timeline({ delay: 0.15 });
    heroTl
        .from('.hero-eyebrow', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.h1-line', {
            y: 80, opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power4.out'
        }, '-=0.3')
        .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from('.hero-actions', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')

        .from('.mosaic-wrapper', {
            scale: 0.9, opacity: 0, duration: 1.1,
            ease: 'power4.out'
        }, 0.3)
        .from('.ms-tr', {
            x: 0, y: 0, duration: 0.8,
            ease: 'back.out(1.7)'
        }, 0.9)
        .from('.mosaic-logo', {
            scale: 0, opacity: 0, duration: 0.7,
            ease: 'back.out(2)'
        }, 1.1)
        .from('.scroll-cue', { opacity: 0, duration: 0.6 }, '-=0.3');

    /* Marquee: no animation needed (CSS handles it) */

    /* Reveal on scroll — generic */
    gsap.utils.toArray('.value-tag').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            y: 56, opacity: 0, duration: 0.8,
            delay: (i % 4) * 0.08,
            ease: 'power3.out'
        });
    });

    /* Section headings */
    gsap.utils.toArray('.section-heading').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
    });

    /* About section */
    gsap.from('.about-img-frame', {
        scrollTrigger: { trigger: '.about-section', start: 'top 75%' },
        x: -60, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.about-text-col > *', {
        scrollTrigger: { trigger: '.about-text-col', start: 'top 80%' },
        y: 32, opacity: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out'
    });


    /* Statement */
    gsap.from('.statement-quote', {
        scrollTrigger: { trigger: '.statement-section', start: 'top 70%' },
        y: 40, opacity: 0, duration: 1, ease: 'power3.out'
    });
    gsap.from('.statement-content .btn-pill', {
        scrollTrigger: { trigger: '.statement-section', start: 'top 65%' },
        y: 24, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out'
    });

    /* Contact */
    gsap.from('.contact-text > *', {
        scrollTrigger: { trigger: '.contact-section', start: 'top 75%' },
        y: 40, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.cvis-1, .cvis-2, .cvis-3', {
        scrollTrigger: { trigger: '.contact-visual', start: 'top 80%' },
        scale: 0.88, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out'
    });
}


/* ---- SMOOTH ANCHOR SCROLL (offset for fixed navbar) ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});



/* ---- SWIPER INITIALIZATION ---- */
if (typeof Swiper !== 'undefined') {
    new Swiper('.flavors-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            /* Desktop */
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
}
