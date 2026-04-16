// --- DYNAMIC GALLERY POPULATION ---
const totalImages = 20;
const mosaicTarget = document.getElementById('mosaic-target');
const swiperTarget = document.getElementById('swiper-target');

function populateGalleries() {
    if (!mosaicTarget || !swiperTarget) return;

    for (let i = 1; i <= totalImages; i++) {
        const num = i < 10 ? `0${i}` : i;
        const speed = (1 + Math.random() * 0.5).toFixed(2);
        
        // Mosaic Item
        const mosaicItem = document.createElement('div');
        mosaicItem.className = `mosaic-item item-${i}`;
        mosaicItem.setAttribute('data-speed', speed);
        mosaicItem.innerHTML = `
            <picture>
                <source srcset="images/fotos/${num}.webp" type="image/webp">
                <img src="images/fotos/${num}.jpg" alt="Artesanato DL" loading="lazy">
            </picture>
        `;
        mosaicTarget.appendChild(mosaicItem);

        // Swiper Slide
        const swiperSlide = document.createElement('div');
        swiperSlide.className = 'swiper-slide';
        swiperSlide.innerHTML = `
            <picture>
                <source srcset="images/fotos/${num}.webp" type="image/webp">
                <img src="images/fotos/${num}.jpg" alt="Artesanato" loading="lazy">
            </picture>
        `;
        swiperTarget.appendChild(swiperSlide);
    }
}

populateGalleries();

// Inicialização Lenis - Suave e Leve
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0, 0);

// --- DYNAMIC BACKGROUND HARMONY ---
// Transição suave de fundo ao chegar na seção "Sobre"
gsap.to("body", {
    scrollTrigger: {
        trigger: ".about-delicate",
        start: "top 60%",
        end: "bottom 40%",
        toggleActions: "play reverse play reverse",
    },
    backgroundColor: "#FCEAE1", // Soft Peach
    duration: 1.2,
    ease: "power1.inOut"
});

// --- ANIMATIONS HERO ---
// Logo fade in super soft
gsap.fromTo(".logo-hero", 
    { opacity: 0, scale: 0.95, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 2.5, ease: "power2.out" }
);


// --- ANIMATIONS GALLERY ---

const isMobile = window.innerWidth < 768;

if (!isMobile) {
    gsap.utils.toArray(['.mosaic-item']).forEach((block) => {
        const speed = parseFloat(block.dataset.speed) || 1;
        const trigger = ".mosaic-container";
        
        gsap.to(block, {
            y: () => -150 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: trigger,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
} else {
    gsap.utils.toArray(['.mosaic-item']).forEach((block) => {
        gsap.from(block, {
            y: 40,
            opacity: 0,
            duration: 1.2,
            scrollTrigger: {
                trigger: block,
                start: "top 80%"
            }
        });
    });
}
// Fade in for mosaic header
gsap.from(".mosaic-header", {
    scrollTrigger: {
        trigger: ".collage-mosaic",
        start: "top 70%",
    },
    opacity: 0,
    y: 30,
    duration: 1.5,
    ease: "power2.out"
});

// --- ANIMATIONS ABOUT ---
gsap.from(".soft-heading", {
    scrollTrigger: {
        trigger: ".about-delicate",
        start: "top 75%",
    },
    y: 40,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
});

gsap.from(".text-block p", {
    scrollTrigger: {
        trigger: ".about-delicate",
        start: "top 65%",
    },
    y: 30,
    opacity: 0,
    duration: 1.2,
    delay: 0.2,
    ease: "power2.out"
});

gsap.from(".stat", {
    scrollTrigger: {
        trigger: ".stats-mini",
        start: "top 80%",
    },
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
});

// --- ANIMATIONS CONTACT ---
gsap.from(".text-fade", {
    scrollTrigger: {
        trigger: ".contact-delicate",
        start: "top 75%",
    },
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
});

// Smooth scroll logic for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    });
});

// --- SWIPER MOBILE ---
if (isMobile) {
    new Swiper('.main-slider', {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });
}
