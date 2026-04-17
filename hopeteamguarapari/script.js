$(document).ready(function() {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    const tl = gsap.timeline();
    
    tl.to('.hero-img', {
        scale: 1.05,
        duration: 2,
        ease: "power2.out"
    }, 0)
    .to('.reveal-text', {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out"
    }, 0.2)
    .to('.reveal-up', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
    }, 0.4);

    // Scroll Animations
    
    // Reveal Up Elements
    $('.reveal-up:not(header .reveal-up)').each(function() {
        gsap.to(this, {
            scrollTrigger: {
                trigger: this,
                start: "top 85%",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Reveal Left
    $('.reveal-left').each(function() {
        gsap.to(this, {
            scrollTrigger: {
                trigger: this,
                start: "top 85%",
            },
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Reveal Right
    $('.reveal-right').each(function() {
        gsap.to(this, {
            scrollTrigger: {
                trigger: this,
                start: "top 85%",
            },
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Modality Cards Parallax / Stagger
    gsap.from('.modality-card', {
        scrollTrigger: {
            trigger: '#modalidades',
            start: "top 70%",
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Benefit Items Stagger
    gsap.from('.benefit-item', {
        scrollTrigger: {
            trigger: '#beneficios',
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Parallax Background Effect
    gsap.to('.parallax-bg', {
        scrollTrigger: {
            trigger: '.parallax-bg',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: 200,
        ease: "none"
    });

    // Navbar Background on Scroll
    ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
            if (self.direction === 1) { // Scrolling down
                $('#navbar').addClass('sticky-nav');
            } else if (self.scroll() < 50) { // Near top
                $('#navbar').removeClass('sticky-nav');
            }
        }
    });

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'swing');
        }
    });
});
