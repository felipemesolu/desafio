const text = document.getElementById("text");
const textContent = text.innerText.trim();
text.innerHTML = "";

for (let i = 0; i < textContent.length; i++) {
    const span = document.createElement("span");
    span.innerText = textContent[i];
    const angle = i * (360 / textContent.length);
    span.style.transform = `rotate(${angle}deg)`;
    text.appendChild(span);
}

// ── Ticker Strip Animation ────────────────────────
const track = document.querySelector('.ticker-track');

if (track) {
    // Duplicate the content a few times to cover wide screens seamlessly
    const trackContent = track.innerHTML;
    track.innerHTML = trackContent + trackContent + trackContent + trackContent;

    // Start GSAP Animation
    gsap.to('.ticker-track', {
        xPercent: -50,
        ease: 'none',
        repeat: -1,
        duration: 80
    });
}

// ── Scroll Reveals (Simplified) ───────────────────
// Animations removed as per user request to avoid overlap/errors with section stacking.
// ── Accordion ─────────────────────────────────────
document.querySelectorAll('.acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.acc-item');
        const body = item.querySelector('.acc-body');
        const isOpen = item.classList.contains('open');
        
        // close all
        document.querySelectorAll('.acc-item.open').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.acc-body').style.maxHeight = '0';
            i.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        });
        
        if (!isOpen) {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Initialize Lucide Icons
lucide.createIcons();

// ── Vertical Stacking Panels (GSAP ScrollTrigger) ─────
gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray("section, footer");

panels.forEach((panel, i) => {
    // Definimos o z-index dinamicamente para garantir o empilhamento correto (última por cima)
    gsap.set(panel, { zIndex: i + 10 });

    // Não precisamos fixar a última seção pois não há nada para rolar sobre ela
    if (i < panels.length - 1) {
        ScrollTrigger.create({
            trigger: panel,
            // Se a seção for maior que a tela, esperamos ela rolar até o fim ("bottom bottom") antes de fixar.
            // Se couber na tela, fixamos logo que bater no topo ("top top").
            start: () => panel.offsetHeight > window.innerHeight ? "bottom bottom" : "top top",
            pin: true,
            pinSpacing: false, // Isso permite que a próxima seção deslize por cima da atual
            invalidateOnRefresh: true, // Recalcula os tamanhos caso a tela mude de tamanho
        });
    }
});