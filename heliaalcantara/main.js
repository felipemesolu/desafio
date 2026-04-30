const productSlugs = [
    "avon-desodorante-roll-on",
    "avon-kit-far-away",
    "avon-perfumes-pur-blanca",
    "avon-perfumes-signo",
    "avon-protetor-solar-fator50",
    "boticario-nativa-spa-ameixa-negra",
    "boticario-nativa-spa-ameixa",
    "boticario-nativa-spa-cereja",
    "boticario-nativa-spa-lilac",
    "boticario-nativa-spa-morango-ruby",
    "boticario-nativa-spa-orquidea-noire",
    "boticario-perfumes-arbo",
    "boticario-perfumes-coffee-woman-addictive",
    "boticario-perfumes-egeo-spicy-vibe",
    "boticario-perfumes-uomini-spirit",
    "creme-para-o-corpo-amora-e-flor-de-pessego",
    "creme-para-o-corpo-flor-de-maca",
    "natura-creme-para-o-corpo-ameixa-e-flor-de-baunilha",
    "natura-creme-para-o-corpo-cereja-e-avela",
    "natura-creme-para-o-corpo-cha-de-camomila-e-lavanda",
    "natura-creme-para-o-corpo-jasmin-e-flor-de-pessego",
    "natura-creme-para-o-corpo-morango-e-baunilha-dourada",
    "natura-creme-para-o-corpo-refil-capim-limao",
    "natura-creme-para-o-corpo-refil-flor-de-gengibre",
    "natura-creme-para-o-corpo-refil-morango-e-baunilha-dourada",
    "natura-creme-para-o-corpo-refil-tamara-e-canela",
    "natura-diversos-humor",
    "natura-kit-sabonete-e-perfume-luna",
    "natura-mamae-bebe",
    "natura-perfumes-essencial-atrai",
    "natura-perfumes-essencial-desejos",
    "natura-perfumes-essencial-exclusivo-floral",
    "natura-perfumes-essencial-exclusivo",
    "natura-perfumes-essencial-mirra",
    "natura-perfumes-essencial-palo-santo-1",
    "natura-perfumes-essencial-palo-santo-2",
    "natura-perfumes-essencial-supreme",
    "natura-perfumes-homem-dom",
    "natura-perfumes-homem-emocione",
    "natura-perfumes-homem-madeiras",
    "natura-perfumes-homem-neo",
    "natura-perfumes-homem-tato",
    "natura-perfumes-homem-verum",
    "natura-perfumes-kaiak-feminino",
    "natura-perfumes-kaiak-pulso",
    "natura-perfumes-luna-coragem-e-nuit",
    "natura-sabonete-diversos-1",
    "natura-sabonete-diversos-2",
    "natura-sabonete-feliz-dia",
    "natura-sabonete-liquido-para-o-corpo-kryska",
    "natura-sabonetes-ekos-1",
    "natura-sabonetes-ekos-2",
    "natura-sabonetes-ekos-3",
    "natura-sabonetes-ekos-4",
    "natura-sabonetes-ekos-5",
    "natura-sabonetes-ekos-6",
    "natura-sabonetes-ekos-maracuja-e-castanha",
    "natura-sabonetes-ekos-maracuja",
    "produtos-diversos-pomada-fisio-fort-preta-e-verde"
];

function parseProduct(slug) {
    let brand = "Outros";
    let category = "";
    let nameParts = [];

    const parts = slug.split('-');
    
    if (parts[0] === "natura" || parts[0] === "avon" || parts[0] === "boticario") {
        brand = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        if (brand === "Boticario") brand = "Boticário";
        
        if (parts[1] === "perfumes" || parts[1] === "sabonete" || parts[1] === "sabonetes" || parts[1] === "kit" || parts[1] === "desodorante") {
            category = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
            nameParts = parts.slice(2);
        } else if (parts[1] === "nativa" && parts[2] === "spa") {
            category = "Nativa Spa";
            nameParts = parts.slice(3);
        } else if (parts[1] === "creme" && parts[2] === "para" && parts[3] === "o" && parts[4] === "corpo") {
            category = "Creme Corpo";
            nameParts = parts.slice(5);
        } else {
            nameParts = parts.slice(1);
        }
    } else if (parts[0] === "produtos" && parts[1] === "diversos") {
        brand = "Diversos";
        nameParts = parts.slice(2);
    } else if (parts[0] === "creme" && parts[1] === "para" && parts[2] === "o" && parts[3] === "corpo") {
        brand = "Natura"; 
        category = "Creme Corpo";
        nameParts = parts.slice(4);
    } else {
        brand = "Diversos";
        nameParts = parts;
    }

    const cleanName = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        .replace(/ E /g, ' e ')
        .replace(/ O /g, ' o ');

    const finalName = category ? `${category} ${cleanName}` : cleanName;

    return {
        id: slug,
        brand: brand,
        name: finalName.trim(),
        imageBase: `images/produtos/${slug}`
    };
}

const allProducts = productSlugs.map(parseProduct);
const brands = ["Todos", ...new Set(allProducts.map(p => p.brand))];
let activeBrand = "Todos";

document.addEventListener('DOMContentLoaded', () => {

    const createSlideHTML = (product) => `
        <picture class="hero-image">
            <source srcset="${product.imageBase}.avif" type="image/avif">
            <img src="${product.imageBase}.webp" alt="${product.name}" class="hero-image" loading="lazy" onerror="this.src='https://placehold.co/400x400/FCFAF8/C89366?text=Sem+Foto'">
        </picture>
        <button class="drawer-trigger" aria-label="Ver detalhes">
            <i class="ph ph-plus"></i>
        </button>
        <div class="product-drawer">
            <div class="drawer-header">
                <div class="drawer-handle"></div>
                <button class="drawer-close"><i class="ph ph-x"></i></button>
            </div>
            <div class="drawer-content">
                <p style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); text-align: center; margin-bottom: -10px;">${product.brand}</p>
                <h3 class="product-name" style="text-align: center;">${product.name}</h3>
                
                <button class="btn btn-primary btn-full btn-order" style="margin-top: 1rem;" data-name="${product.name}">
                    <i class="ph ph-whatsapp-logo"></i> Pedir pelo WhatsApp
                </button>
            </div>
        </div>
    `;

    // Swiper instances
    let heroSwiper, modalSwiper;

    const renderProducts = (filteredProducts) => {
        const heroWrapper = document.querySelector('.hero-swiper .swiper-wrapper');
        const modalWrapper = document.querySelector('.modal-swiper .swiper-wrapper');
        
        if (heroWrapper) heroWrapper.innerHTML = '';
        if (modalWrapper) modalWrapper.innerHTML = '';

        filteredProducts.forEach((product) => {
            if (heroWrapper) {
                const slide1 = document.createElement('div');
                slide1.className = 'swiper-slide';
                slide1.innerHTML = createSlideHTML(product);
                heroWrapper.appendChild(slide1);
            }
            if (modalWrapper) {
                const slide2 = document.createElement('div');
                slide2.className = 'swiper-slide';
                slide2.innerHTML = createSlideHTML(product);
                modalWrapper.appendChild(slide2);
            }
        });

        if (heroSwiper) heroSwiper.update();
        if (modalSwiper) modalSwiper.update();
        
        if (heroSwiper) heroSwiper.slideTo(0, 0);
        if (modalSwiper) modalSwiper.slideTo(0, 0);
    };

    const renderFilters = () => {
        const filterHTML = brands.map(brand => `
            <button class="filter-chip ${brand === activeBrand ? 'active' : ''}" data-brand="${brand}">
                ${brand}
            </button>
        `).join('');

        const dFilter = document.getElementById('filters-desktop');
        const mFilter = document.getElementById('filters-mobile');
        
        if (dFilter) dFilter.innerHTML = filterHTML;
        if (mFilter) mFilter.innerHTML = filterHTML;
    };

    const applyFilter = (brand) => {
        activeBrand = brand;
        renderFilters();
        const filtered = brand === "Todos" ? allProducts : allProducts.filter(p => p.brand === brand);
        renderProducts(filtered);
    };

    // Drawer Helpers
    const closeAllDrawers = () => {
        document.querySelectorAll('.product-drawer.active').forEach(drawer => {
            drawer.classList.remove('active');
        });
    };

    // Initialize Swipers
    heroSwiper = new Swiper('.hero-swiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        loop: false,
        speed: 800,
        mousewheel: true,
        keyboard: { enabled: true },
        pagination: { el: '.custom-pagination', clickable: true },
        observer: true,
        observeParents: true,
        on: { slideChange: closeAllDrawers }
    });

    modalSwiper = new Swiper('.modal-swiper', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        loop: false,
        speed: 800,
        mousewheel: true,
        keyboard: { enabled: true },
        pagination: { el: '.modal-pagination', clickable: true },
        observer: true,
        observeParents: true,
        on: { slideChange: closeAllDrawers }
    });

    // Initial render
    renderFilters();
    applyFilter("Todos");

    // Catalog Modal Logic (Mobile)
    const catalogModal = document.getElementById('catalogModal');
    const btnCatalog = document.querySelector('.btn-catalog');
    const btnCloseCatalog = document.querySelector('.modal-catalog-close');

    if (catalogModal && btnCatalog && btnCloseCatalog) {
        btnCatalog.addEventListener('click', (e) => {
            e.preventDefault();
            catalogModal.classList.add('active');
            document.body.classList.add('catalog-active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => { modalSwiper.update(); }, 300);
        });

        btnCloseCatalog.addEventListener('click', () => {
            catalogModal.classList.remove('active');
            document.body.classList.remove('catalog-active');
            document.body.style.overflow = '';
        });
    }

    // Global Interaction Handler
    document.addEventListener('click', (e) => {
        // ... (resto do código)
        const trigger = e.target.closest('.drawer-trigger');
        const closeBtn = e.target.closest('.drawer-close');
        const orderBtn = e.target.closest('.btn-order');
        const filterBtn = e.target.closest('.filter-chip');

        if (filterBtn) {
            const brand = filterBtn.getAttribute('data-brand');
            applyFilter(brand);
        }

        if (trigger) {
            closeAllDrawers();
            const drawer = trigger.nextElementSibling;
            drawer.classList.add('active');
        }

        if (closeBtn) {
            const drawer = closeBtn.closest('.product-drawer');
            drawer.classList.remove('active');
        }

        if (orderBtn) {
            const productName = orderBtn.getAttribute('data-name');
            const phoneNumber = "5527996191167";
            const message = `Olá Hélia! Vi o produto *${productName}* no seu catálogo, ele ainda está disponível?`;

            const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
        }
    });

    // Drag to scroll for desktop on filters
    const sliders = document.querySelectorAll('.filters-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    sliders.forEach(slider => {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = 'grab';
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; 
            slider.scrollLeft = scrollLeft - walk;
        });
    });
});
