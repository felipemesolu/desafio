/* ============================================================
   LU MODA V2 — script.js
   Animações: fios, agulha, scroll reveal, navbar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ════════════════════════════════════════════════════════
       1. CANVAS — Fios de costura animados
    ════════════════════════════════════════════════════════ */
    const canvas  = document.getElementById('thread-canvas');
    const ctx     = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* Configuração dos fios */
    const THREAD_COUNT = 12;
    const threads = [];

    function randomHSL() {
        // tons de lavanda/roxo
        const hues = [260, 270, 280, 290, 295, 300];
        const h = hues[Math.floor(Math.random() * hues.length)];
        const s = 40 + Math.random() * 40;
        const l = 60 + Math.random() * 25;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    class Thread {
        constructor() { this.init(); }
        init() {
            this.x   = Math.random() * W;
            this.y   = Math.random() * H;
            this.len = 80 + Math.random() * 200;
            this.angle = Math.random() * Math.PI * 2;
            this.speed = 0.002 + Math.random() * 0.005;
            this.waveAmp   = 20 + Math.random() * 40;
            this.waveFreq  = 0.008 + Math.random() * 0.012;
            this.wavePhase = Math.random() * Math.PI * 2;
            this.color = randomHSL();
            this.alpha = 0.05 + Math.random() * 0.2;
            this.width = 0.5 + Math.random() * 1.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.life = 0;
            this.maxLife = 300 + Math.random() * 400;
        }

        update() {
            this.life++;
            this.wavePhase += this.speed;
            this.x += this.vx;
            this.y += this.vy;
            if (this.life > this.maxLife) this.init();
        }

        draw() {
            const progress = this.life / this.maxLife;
            const alpha    = this.alpha * Math.sin(progress * Math.PI);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = this.color;
            ctx.lineWidth   = this.width;
            ctx.lineCap     = 'round';

            ctx.beginPath();
            for (let i = 0; i <= this.len; i += 2) {
                const t  = i / this.len;
                const nx = this.x + Math.cos(this.angle) * i
                         + Math.sin(this.wavePhase + i * this.waveFreq) * this.waveAmp * Math.sin(t * Math.PI);
                const ny = this.y + Math.sin(this.angle) * i
                         + Math.cos(this.wavePhase + i * this.waveFreq) * (this.waveAmp * 0.5) * Math.sin(t * Math.PI);
                i === 0 ? ctx.moveTo(nx, ny) : ctx.lineTo(nx, ny);
            }
            ctx.stroke();

            /* Nos / pontos de costura a cada ~30px */
            ctx.fillStyle = this.color;
            for (let i = 0; i <= this.len; i += 30) {
                const t  = i / this.len;
                const nx = this.x + Math.cos(this.angle) * i
                         + Math.sin(this.wavePhase + i * this.waveFreq) * this.waveAmp * Math.sin(t * Math.PI);
                const ny = this.y + Math.sin(this.angle) * i
                         + Math.cos(this.wavePhase + i * this.waveFreq) * (this.waveAmp * 0.5) * Math.sin(t * Math.PI);
                ctx.beginPath();
                ctx.arc(nx, ny, this.width * 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < THREAD_COUNT; i++) threads.push(new Thread());

    /* Dashed stitch lines (horizontais fixas discretas) */
    function drawStitchLines() {
        ctx.save();
        ctx.setLineDash([8, 10]);
        ctx.lineWidth   = 0.6;
        ctx.strokeStyle = 'rgba(155,119,209,0.07)';
        for (let y = 100; y < H; y += 80) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        drawStitchLines();
        threads.forEach(t => { t.update(); t.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    /* ════════════════════════════════════════════════════════
       2. FABRIC PARTICLES
    ════════════════════════════════════════════════════════ */
    const particleContainer = document.getElementById('fabric-particles');
    const PARTICLE_COUNT = 24;

    function createParticle() {
        const el  = document.createElement('div');
        el.className = 'fp';
        const size = 4 + Math.random() * 12;
        const left = Math.random() * 100;
        const dur  = 6 + Math.random() * 14;
        const del  = Math.random() * 10;
        el.style.cssText = `
            width:${size}px; height:${size}px;
            left:${left}%;
            bottom:${-size}px;
            animation-duration:${dur}s;
            animation-delay:${del}s;
        `;
        particleContainer.appendChild(el);
    }
    for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

    /* ════════════════════════════════════════════════════════
       3. MOUSE — Fios seguem o cursor (sutil)
    ════════════════════════════════════════════════════════ */
    let mouseX = W / 2, mouseY = H / 2;
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        // Repele levemente os fios próximos ao cursor
        threads.forEach(t => {
            const dx = t.x - mouseX;
            const dy = t.y - mouseY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                t.vx += dx / dist * 0.4;
                t.vy += dy / dist * 0.4;
                // Amortece para não explodir
                t.vx *= 0.85;
                t.vy *= 0.85;
            }
        });
    });

    /* ════════════════════════════════════════════════════════
       4. NAVBAR — aparece ao scroll
    ════════════════════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('inicio');

    function checkNavbar() {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < window.innerHeight * 0.5) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', checkNavbar, { passive: true });

    /* ════════════════════════════════════════════════════════
       5. MOBILE MENU
    ════════════════════════════════════════════════════════ */
    const mobileToggle  = document.getElementById('mobile-menu');
    const sidebar       = document.getElementById('sidebar');
    const sidebarOverlay= document.getElementById('sidebar-overlay');
    const sidebarClose  = document.getElementById('sidebar-close');

    mobileToggle?.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    sidebarClose?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);
    sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSidebar));

    /* ════════════════════════════════════════════════════════
       6. SCROLL REVEAL
    ════════════════════════════════════════════════════════ */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ════════════════════════════════════════════════════════
       7. SMOOTH SCROLL
    ════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ════════════════════════════════════════════════════════
       8. LAZY LOAD — Vídeos da galeria
    ════════════════════════════════════════════════════════ */
    const lazyVideos = document.querySelectorAll('video');

    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source[data-src]');
                    if (source) {
                        source.src = source.dataset.src;
                        video.load();
                    }
                    videoObserver.unobserve(video);
                }
            });
        }, { rootMargin: '200px' });

        lazyVideos.forEach(video => {
            const hasLazySource = video.querySelector('source[data-src]');
            if (hasLazySource) videoObserver.observe(video);
        });
    }

    /* ════════════════════════════════════════════════════════
       9. LIGHTBOX — Galeria
    ════════════════════════════════════════════════════════ */
    const lightbox = document.getElementById('lightbox');
    const lightboxPic = document.getElementById('lightbox-picture');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galItems = document.querySelectorAll('.gal-item');

    galItems.forEach(item => {
        item.addEventListener('click', () => {
            const originalPic = item.querySelector('picture');
            if (!originalPic) return;

            // Limpa o conteúdo anterior
            lightboxPic.innerHTML = '';

            // Clona o picture original para manter AVIF + WebP
            const clonedPic = originalPic.cloneNode(true);
            
            // Remove atributos de lazy load se houver, para abrir rápido no modal
            const clonedImg = clonedPic.querySelector('img');
            clonedImg.removeAttribute('loading');
            clonedImg.removeAttribute('fetchpriority');

            lightboxPic.appendChild(clonedPic);

            // Abre o lightbox
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Destrava o scroll
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

});
