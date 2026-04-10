let products = [];
let cart = [];
let mainSwiper;
const horizontalSwipers = {};

const brandNames = {
    'eudora': 'Eudora',
    'oui': 'O.U.I Paris',
    'boticario': 'O Boticário',
    'qdb': 'Quem Disse, Berenice?'
};

const brandColors = {
    'eudora': '#652f4a',
    'oui': '#971a2e',
    'boticario': '#49a478',
    'qdb': '#d11450'
};

async function loadProducts() {
    let data = [];
    
    // 1. Tenta carregar da API (Cloudflare KV via Page Function)
    try {
        const response = await fetch('/api/jullya');
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            }
        }
    } catch (apiError) {
        console.warn("API de gerenciamento offline, usando dados estáticos.");
    }
    
    // 2. Fallback: Se o banco estiver vazio ou falhar, usa o JSON local
    if (!data || data.length === 0) {
        try {
            const staticRes = await fetch('products.json');
            if (staticRes.ok) {
                data = await staticRes.json();
            }
        } catch (staticError) {
            console.error("Falha crítica ao carregar base de produtos:", staticError);
        }
    }

    products = data;
    
    // 3. Processamento visual
    renderBrandedSections();
    reorderSections();
    
    // 4. Inicialização do Swiper (essencial para a rolagem funcionar)
    initSwipers();
}

function updateCartBarVisibility(slide) {
    const cartBar = document.querySelector('.fixed.bottom-6');
    if (!cartBar) return;
    
    if (slide.getAttribute('data-hide-cart') === 'true') {
        cartBar.classList.add('opacity-0', 'pointer-events-none');
        cartBar.style.transform = 'translate(-50%, 100px)';
    } else {
        cartBar.classList.remove('opacity-0', 'pointer-events-none');
        cartBar.style.transform = 'translate(-50%, 0)';
    }
}

function initSwipers() {
    mainSwiper = new Swiper('.mainVerticalSwiper', {
        direction: 'vertical',
        mousewheel: true,
        speed: 800,
        edgeSwipeThreshold: 20,
        on: {
            init: function () {
                updateCartBarVisibility(this.slides[this.activeIndex]);
            },
            slideChange: function () {
                updateCartBarVisibility(this.slides[this.activeIndex]);
            }
        }
    });
}

function renderBrandedSections() {
    const brands = ['eudora', 'oui', 'boticario', 'qdb'];
    
    brands.forEach(brand => {
        const container = document.getElementById(`${brand}-products`);
        if (!container) return;
        
        const brandColor = brandColors[brand] || '#0B1320';
        let brandProducts = products.filter(p => p.brand === brand);
        
        brandProducts.sort((a, b) => {
            const aPromo = a.oldPrice && a.oldPrice > a.price ? 1 : 0;
            const bPromo = b.oldPrice && b.oldPrice > b.price ? 1 : 0;
            return bPromo - aPromo;
        });

        const section = container.closest('.swiper-slide');
        
        if (brandProducts.length === 0) {
            section.setAttribute('data-has-stock', 'false');
            section.setAttribute('data-product-count', 0);
            container.innerHTML = `
                <div class="p-8 text-center max-w-sm mx-auto animate-fade-in">
                    <div class="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                    </div>
                    <h3 class="text-accessible-title mb-3">Estoque esgotado</h3>
                    <p class="text-accessible-desc mb-8">
                        No momento não tenho produtos desta marca em pronta entrega, mas você pode escolher qualquer item do catálogo oficial!
                    </p>
                    <button onclick="requestCatalog('${brand}')" style="background-color: ${brandColor}" class="w-full py-5 text-white rounded-2xl text-[12px] uppercase tracking-widest font-black hover:scale-105 transition-transform shadow-lg">
                        Solicitar Catálogo ${brandNames[brand]}
                    </button>
                </div>
            `;
            return;
        }

        section.setAttribute('data-has-stock', 'true');
        section.setAttribute('data-product-count', brandProducts.length);
        container.innerHTML = `
            <div class="swiper ${brand}HorizontalSwiper px-4">
                <div class="swiper-wrapper">
                    ${brandProducts.map(product => {
                        const hasPromo = product.oldPrice && product.oldPrice > product.price;
                        const isExternal = product.image.startsWith('http');
                        const imgPath = isExternal ? product.image : `images/produtos/${product.image}.webp`;
                        
                        return `
                            <div class="swiper-slide bg-white border border-zinc-100 p-5 rounded-[40px] flex flex-col gap-4 relative h-auto shadow-sm">
                                ${hasPromo ? `<div class="absolute top-5 left-5 z-20 bg-rose-gold text-[#0B1320] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">Oferta</div>` : ''}
                                <div class="relative overflow-hidden rounded-[30px] h-60 bg-zinc-50 flex items-center justify-center">
                                    <img src="${imgPath}" alt="${product.name}" class="w-full h-full object-contain p-4" onerror="this.src='https://placehold.co/400x400/0B1320/rose-gold?text=Sem+Foto'">
                                    <div class="absolute bottom-3 right-3 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-zinc-100">
                                        <div class="flex flex-col items-end">
                                            ${hasPromo ? `<span class="text-[10px] text-zinc-400 line-through font-bold">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                                            <span class="text-accessible-price">R$ ${product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col flex-grow px-1">
                                    <h3 class="text-accessible-title mb-2 leading-tight">${product.name}</h3>
                                    <p class="text-accessible-desc mb-6 line-clamp-2">${product.description}</p>
                                    <div class="mt-auto">
                                        <button onclick="addToCart(${product.id})" style="background-color: ${brandColor}" class="w-full py-4 text-white rounded-2xl text-[11px] uppercase tracking-widest font-black transition-all active:scale-95 shadow-lg">
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    
                    <!-- CARD CTA: SOLICITAR CATÁLOGO -->
                    <div class="swiper-slide bg-zinc-50 border-2 border-dashed border-zinc-200 p-8 rounded-[40px] flex flex-col items-center justify-center text-center gap-6 h-auto min-h-[400px]">
                        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg class="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-black text-[#0B1320] uppercase tracking-tighter mb-2">Não encontrou o que procurava?</h3>
                            <p class="text-[11px] text-zinc-500 leading-relaxed px-4 italic">Me peça o catálogo completo da <strong>${brandNames[brand]}</strong> e confira todas as novidades!</p>
                        </div>
                        <button onclick="requestCatalog('${brand}')" style="background-color: ${brandColor}" class="px-8 py-4 text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:scale-105 transition-all active:scale-95 shadow-lg">
                            Solicitar Catálogo
                        </button>
                    </div>
                </div>
            </div>
        `;

        new Swiper(`.${brand}HorizontalSwiper`, {
            slidesPerView: 1.15,
            spaceBetween: 20,
            centeredSlides: false,
            breakpoints: {
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.2 }
            }
        });
    });
}

function reorderSections() {
    const wrapper = document.querySelector('.mainVerticalSwiper > .swiper-wrapper');
    const hero = wrapper.children[0];
    const brandSlides = Array.from(wrapper.children).filter(s => s.hasAttribute('data-has-stock'));
    const otherSlides = Array.from(wrapper.children).filter(s => !s.hasAttribute('data-has-stock') && s !== hero);
    
    brandSlides.sort((a, b) => {
        const aStock = a.getAttribute('data-has-stock') === 'true' ? 1 : 0;
        const bStock = b.getAttribute('data-has-stock') === 'true' ? 1 : 0;
        
        // Critério 1: Tem Estoque
        if (aStock !== bStock) return bStock - aStock;
        
        // Critério 2: Quantidade de Produtos (Maior primeiro)
        const aCount = parseInt(a.getAttribute('data-product-count') || 0);
        const bCount = parseInt(b.getAttribute('data-product-count') || 0);
        return bCount - aCount;
    });
    
    wrapper.innerHTML = '';
    wrapper.appendChild(hero);
    brandSlides.forEach(slide => wrapper.appendChild(slide));
    otherSlides.forEach(slide => wrapper.appendChild(slide));
}

window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({...product, cartId: Date.now()});
        updateCartUI();
        const btn = event.currentTarget;
        const originalText = btn.innerText;
        btn.innerText = "Adicionado";
        btn.style.backgroundColor = '#16a34a';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = brandColors[product.brand];
        }, 1500);
    }
};

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(c => c.innerText = `${cart.length} itens selecionados`);
    
    const showCartBtn = document.getElementById('btn-show-cart');
    if (cart.length > 0) {
        showCartBtn.classList.remove('opacity-50', 'pointer-events-none');
        showCartBtn.classList.add('bg-[#16a34a]');
    } else {
        showCartBtn.classList.add('opacity-50', 'pointer-events-none');
        showCartBtn.classList.remove('bg-[#16a34a]');
    }
}

window.toggleModal = () => {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderCartItems();
    }
};

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalElem = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `<p class="text-center text-zinc-400 py-10 font-medium">Sua lista está vazia.</p>`;
        totalElem.innerText = "R$ 0,00";
        return;
    }

    container.innerHTML = cart.map(item => {
        const isExternal = item.image.startsWith('http');
        const imgPath = isExternal ? item.image : `images/produtos/${item.image}.webp`;
        return `
            <div class="flex items-center gap-4 bg-zinc-50 p-4 rounded-3xl border border-zinc-100">
                <div class="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${imgPath}" class="w-full h-full object-contain p-1" onerror="this.src='https://placehold.co/400x400/0B1320/rose-gold?text=SF'">
                </div>
                <div class="flex-grow">
                    <h4 class="text-sm font-bold text-[#0B1320] leading-tight">${item.name}</h4>
                    <p class="text-xs text-accessible-price">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.cartId})" class="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        `;
    }).join('');

    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    totalElem.innerText = `R$ ${total.toFixed(2)}`;
}

window.removeFromCart = (cartId) => {
    cart = cart.filter(item => item.cartId !== cartId);
    renderCartItems();
    updateCartUI();
};

window.requestCatalog = (brand) => {
    const phone = "5527996364467";
    const brandName = brandNames[brand];
    const message = `Olá Jullya! Vi que os itens de pronta entrega da *${brandName}* acabaram. Você poderia me enviar o catálogo completo para eu fazer um pedido?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};

window.sendToWhatsApp = () => {
    if (cart.length === 0) return;
    const phone = "5527996364467"; 
    
    const grouped = cart.reduce((acc, item) => {
        if (!acc[item.brand]) acc[item.brand] = [];
        acc[item.brand].push(item);
        return acc;
    }, {});

    let message = `CATALOGO JULLYA SOUZA\n\n`;
    message += `Olá Jullya! Gostaria de encomendar os seguintes itens:\n\n`;
    
    for (const brand in grouped) {
        message += `*${brandNames[brand].toUpperCase()}*\n`;
        grouped[brand].forEach(item => {
            message += `- ${item.name}: R$ ${item.price.toFixed(2)}\n`;
        });
        message += `\n`;
    }

    const total = cart.reduce((acc, curr) => acc + curr.price, 0);
    message += `*Total Estimado: R$ ${total.toFixed(2)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
};

document.addEventListener('DOMContentLoaded', loadProducts);
