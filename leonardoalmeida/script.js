
// Init AOS Initialization
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const navBg = document.getElementById('nav-bg');
    if (window.scrollY > 50) {
        navBg.classList.add('shadow-sm', 'bg-white/95');
        navBg.classList.remove('bg-white/80', 'border-transparent');
    } else {
        navBg.classList.remove('shadow-sm', 'bg-white/95');
        navBg.classList.add('bg-white/80');
    }
});

// Add Parallax behaviors to the Hero area
window.addEventListener('scroll', () => {
    const h = document.getElementById('hero-img');
    const logo = document.getElementById('hero-logo');
    const fachada = document.getElementById('hero-fachada');
    const scroll = window.scrollY;

    if (scroll < window.innerHeight) {
        // Background moves down
        if (h) h.style.transform = `translateY(${scroll * 0.3}px) scale(1.05)`;

        // Logo sumindo com efeito blur
        if (logo) {
            const opacity = Math.max(0, 1 - scroll / 300);
            const blurVal = Math.min(15, scroll / 20); // blur effect max 15px
            logo.style.opacity = opacity;
            logo.style.filter = `blur(${blurVal}px)`;
        }

        // Fachada sobe mais rápido (parallax effect negativo)
        if (fachada) {
            fachada.style.transform = `translateY(-${scroll * 0.5}px)`;
        }
    }
});

// Data for Units (Combined array from data)
const unitsData = [
    // Bloco 01
    { b: 1, ref: "Apto 01", type: "Tipo", area: "109,43", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 01 bloco 01.png" },
    { b: 1, ref: "Apto 02", type: "Tipo", area: "110,84", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 02 bloco 01.png" },
    { b: 1, ref: "Apto 03", type: "Tipo", area: "105,03", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 03 bloco 01.png" },
    { b: 1, ref: "Apto 04", type: "Tipo", area: "95,00", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 04 bloco 01.png" },
    { b: 1, ref: "Apto 05", type: "Tipo", area: "110,08", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 05 bloco 01.png" },
    { b: 1, ref: "Apto 06", type: "Tipo", area: "107,21", config: "3 Q (1 Suíte)", img: "images/bloco01/apto 06 bloco 01.png" },
    { b: 1, ref: "Garden 01", type: "Garden", area: "151,64", config: "Premium", img: "images/bloco01/garden 01 bloco 01.png" },
    { b: 1, ref: "Garden 05", type: "Garden", area: "131,41", config: "Premium", img: "images/bloco01/garden 05 bloco 01.png" },
    { b: 1, ref: "Garden 06", type: "Garden", area: "214,72", config: "Super Premium", img: "images/bloco01/garden 06 bloco 01.png" },

    // Bloco 02
    { b: 2, ref: "Apto 01", type: "Tipo", area: "113,35", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 01 bloco 02.png" },
    { b: 2, ref: "Apto 02", type: "Tipo", area: "113,71", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 02 bloco 02.png" },
    { b: 2, ref: "Apto 03", type: "Tipo", area: "105,43", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 03 bloco 02.png" },
    { b: 2, ref: "Apto 04", type: "Tipo", area: "106,66", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 04 bloco 02.png" },
    { b: 2, ref: "Apto 05", type: "Tipo", area: "105,17", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 05 bloco 02.png" },
    { b: 2, ref: "Apto 06", type: "Tipo", area: "98,95", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 06 bloco 02.png" },
    { b: 2, ref: "Apto 07", type: "Tipo", area: "100,62", config: "3 Q (1 Suíte)", img: "images/bloco02/apto 07 bloco 02.png" },
    { b: 2, ref: "Garden 01", type: "Garden", area: "286,09", config: "Super Premium", img: "images/bloco02/garden 01 bloco 02.png" },
    { b: 2, ref: "Garden 02", type: "Garden", area: "282,32", config: "Super Premium", img: "images/bloco02/garden 02 bloco 02.png" },
    { b: 2, ref: "Garden 06", type: "Garden", area: "138,55", config: "Premium", img: "images/bloco02/garden 06 bloco 02.png" },
    { b: 2, ref: "Garden 07", type: "Garden", area: "176,30", config: "Premium", img: "images/bloco02/garden 07 bloco 02.png" }
];

let swiperInstance = null;

function renderSwiperInstance(n) {
    const wrapper = document.getElementById('swiper-wrapper-units');
    const data = unitsData.filter(u => u.b === n);

    wrapper.innerHTML = data.map(u => `
                <div class="swiper-slide w-[340px] md:w-[420px]">
                    <div class="h-full bg-white rounded-3xl overflow-hidden border border-white/10 group cursor-grab active:cursor-grabbing hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col">
                        
                        <div class="p-6 md:p-8 bg-white border-b border-gray-100 flex justify-between items-center z-10 relative">
                            <div>
                                <h3 class="font-serif text-2xl text-navy font-bold leading-none mb-1">${u.ref}</h3>
                                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400">${u.area}m² • ${u.config}</p>
                            </div>
                            <span class="inline-flex px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${u.type === 'Garden'
            ? (u.area > 200 ? 'bg-navy text-gold' : 'bg-gold text-white')
            : 'bg-gray-100 text-gray-500'
        }">${u.type}</span>
                        </div>
                        
                        <div class="p-10 md:p-14 bg-gray-50 flex items-center justify-center flex-grow overflow-hidden relative">
                            <div class="absolute inset-0 bg-white/40"></div>
                            <img src="${u.img}" alt="Planta ${u.ref}" class="w-full max-h-[300px] object-contain relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.15]" loading="lazy">
                        </div>
                    </div>
                </div>
            `).join('');

    if (swiperInstance) {
        swiperInstance.destroy(true, true);
    }

    swiperInstance = new Swiper('.unit-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 32,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-btn-next',
            prevEl: '.swiper-btn-prev',
        },
        breakpoints: {
            320: { spaceBetween: 16 },
            768: { spaceBetween: 32 }
        }
    });
}

// Tab System
window.blockTab = function (n) {
    const b1 = document.getElementById('bnav-1');
    const b2 = document.getElementById('bnav-2');

    if (n === 1) {
        b1.className = "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-gold text-white shadow-md";
        b2.className = "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all text-white/50 hover:text-white bg-transparent";
    } else {
        b2.className = "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all bg-gold text-white shadow-md";
        b1.className = "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all text-white/50 hover:text-white bg-transparent";
    }

    renderSwiperInstance(n);
}

const coberturaData = [
    { title: "Piscina Infinita", desc: "Piscina adulto com borda infinita e vista panorâmica para a praia e montanhas." },
    { title: "Piscina Infantil", desc: "Espaço aquático seguro e raso, projetado especialmente para a diversão contínua." },
    { title: "Deck Molhado", desc: "Área perfeita para banho de sol parcial, integrando conforto térmico e descanso." },
    { title: "Sauna Úmida", desc: "Ambiente termal sofisticado para relaxamento muscular e cuidado com a mente e corpo." },
    { title: "Spa Premium", desc: "Espaço dedicado ao seu bem-estar profundo, com hidromassagem e tranquilidade." },
    { title: "Pergolado", desc: "Área sombreada elegante e aconchegante para leitura, bate-papo ou descanso ao ar livre." },
    { title: "Área Gourmet", desc: "Infraestrutura completa e estruturada para reunir amigos em um ambiente aberto e rico." },
    { title: "Gourmet Fechado", desc: "Salão privativo climatizado para jantares íntimos e celebrações muito sofisticadas." },
    { title: "Winebar Exclusivo", desc: "Espaço intimista e requintado, equipado propriamente para a degustação de rótulos." },
    { title: "Espaço Mulher", desc: "Ambiente iluminado inspirado em centros de bem-estar pensado para o autocuidado." },
    { title: "Coworking", desc: "Estação silenciosa com infraestrutura de escritório profissional para produtividade total." },
    { title: "Salão de Jogos", desc: "Diversão imersiva e garantida para jovens e adultos com mesas de alto padrão." },
    { title: "Espaço Fitness", desc: "Academia climatizada completa com vista panorâmica para inspirar o seu treino." }
];

const terreoData = [
    { title: "Quadra Esportiva", desc: "Quadra moderna de alta absorção para a prática de diversos esportes no dia a dia da família." },
    { title: "Beach Tennis", desc: "Quadra de areia perfeitamente qualificada para você praticar o esporte sem sair de casa." },
    { title: "Pista de Cooper", desc: "Circuito contínuo e arborizado excelente para caminhadas matinais e também corridas." },
    { title: "Beach Point", desc: "Ponto higiênico de apoio na chegada da praia para limpeza e facilidade diária." },
    { title: "Salão de Festas", desc: "Salão nobre com alta capacidade técnica no térreo para celebrações memoráveis." },
    { title: "Playground", desc: "Parquinho infantil externo com piso emborrachado para máximo desenvolvimento." },
    { title: "Brinquedoteca", desc: "Sala lúdica e viva rigorosamente desenhada para a imaginação das crianças menores." },
    { title: "Car Wash", desc: "Espaço coberto e equipado para manutenção estética regular dos seus veículos." },
    { title: "Lavanderia", desc: "Serviço eficiente industrializado que traz o mais alto nível de praticidade à rotina." },
    { title: "Bicicletário", desc: "Organização acessível e protegida para os equipamentos de mobilidade dos moradores." },
    { title: "Mini-mercado", desc: "Conveniência automatizada para comprar aquele item esquecido e se resolver rápido." }
];

function renderLazerCards() {
    const cobWrapper = document.getElementById('cobertura-wrapper');
    const terWrapper = document.getElementById('terreo-wrapper');

    const createCard = (item, index, total) => `
                <div class="swiper-slide w-[280px] md:w-[350px]">
                    <div class="bg-white p-10 h-full min-h-[340px] flex flex-col justify-center items-center text-center transition-all duration-300 border border-gray-100 hover:border-gold group shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)] rounded-sm">
                        <div class="w-10 h-[1px] bg-gold/50 mb-8 group-hover:w-16 transition-all duration-500"></div>
                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 transition-colors">Ambiente ${String(index + 1).padStart(2, '0')}/${total}</span>
                        <h4 class="font-serif text-2xl lg:text-3xl text-navy mb-4 leading-tight group-hover:text-gold transition-colors">${item.title}</h4>
                        <p class="text-sm text-text-muted font-light leading-relaxed">${item.desc}</p>
                    </div>
                </div>
            `;

    if (cobWrapper) {
        cobWrapper.innerHTML = coberturaData.map((d, i) => createCard(d, i, coberturaData.length)).join('');
        new Swiper('.lazer-swiper-cobertura', {
            slidesPerView: 'auto',
            spaceBetween: 24,
            grabCursor: true,
            freeMode: true
        });
    }

    if (terWrapper) {
        terWrapper.innerHTML = terreoData.map((d, i) => createCard(d, i, terreoData.length)).join('');
        new Swiper('.lazer-swiper-terreo', {
            slidesPerView: 'auto',
            spaceBetween: 24,
            grabCursor: true,
            freeMode: true
        });
    }
}

// Setup Projeto Image Gallery (Automatic Slider)
function renderProjetoGallery() {
    const wrapper = document.getElementById('projeto-gallery-wrapper');
    if (!wrapper) return;

    // Galeria Cênica do Projeto
    const galleryImgs = [
        "images/fachada/foto (4).jpeg",
        "images/areas-de-lazer/foto (1).jpeg",
        "images/areas-de-lazer/foto (15).jpeg",
        "images/areas-de-lazer/foto (26).jpeg"
    ];

    wrapper.innerHTML = galleryImgs.map(img => `
        <div class="swiper-slide w-[85%] md:w-[60%] h-full">
            <div class="w-full h-full bg-gray-100 overflow-hidden relative shadow-sm">
                <img src="${img}" class="w-full h-full object-cover" alt="Visão Arquitetônica" loading="lazy">
                <!-- Efeito Overlay Transparente -->
                <div class="absolute inset-0 bg-transparent transition-colors duration-1000"></div>
            </div>
        </div>
    `).join('');

    new Swiper('.projeto-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 32,
        centeredSlides: true,
        loop: true,
        speed: 1200,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        allowTouchMove: false // Requirement: "sem clique" / "sem arrastar"
    });
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    blockTab(1);
    renderLazerCards();
    renderProjetoGallery();
});
