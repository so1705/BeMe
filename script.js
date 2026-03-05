// =======================================
// INITIALIZATION
// =======================================
gsap.registerPlugin(ScrollTrigger, TextPlugin);

let lenis;

function initLenis() {
    lenis = new Lenis({
        duration: 2.0, // High-end slow silky scroll
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

// =======================================
// MASTER ANIMATION CONTROLLER
// =======================================
function initAnimations() {

    // 1. Text Stagger Reveal
    gsap.utils.toArray('.gs-reveal-stagger').forEach(elem => {
        const texts = elem.querySelectorAll('.reveal-text');
        gsap.fromTo(texts,
            { y: "110%", rotate: "2deg" },
            {
                y: "0%",
                rotate: "0deg",
                duration: 1.2,
                stagger: 0.15,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 2. Fade Up & Complex Entry Logic (with Data Delay)
    gsap.utils.toArray('.gs-fade-up').forEach(elem => {
        const delay = elem.getAttribute('data-delay') || 0;
        gsap.fromTo(elem,
            { y: 60, opacity: 0, scale: 0.98 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.5,
                delay: Number(delay),
                ease: "power4.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 3. Image Parallax Check
    gsap.utils.toArray('.gs-parallax').forEach(elem => {
        const speed = elem.getAttribute('data-speed') || 0.5;
        const img = elem.querySelector('.hero-img');
        if (img) {
            gsap.to(img, {
                y: () => `${gsap.getProperty(elem, "height") * speed}px`,
                ease: "none",
                scrollTrigger: {
                    trigger: elem,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });

    // Image Parallax Subtle (for Process/Vision glass boxes)
    gsap.utils.toArray('.parallax-img-subtle').forEach(img => {
        gsap.to(img, {
            y: "-15%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // =======================================
    // CONTINUOUS BACKGROUND MOVEMENT
    // =======================================
    gsap.to(".bg-marble", {
        y: "-5vh",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });
}

// =======================================
// INTERACTIVE ELEMENTS
// =======================================
function initInteractions() {

    // 1. Magnetic Hover Effects
    const magneticElements = document.querySelectorAll('.magnetic, .magnetic-container');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            // Calculate center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Adjust pulling strength based on size
            const strength = elem.classList.contains('magnetic-container') ? 15 : 30;

            gsap.to(elem, {
                x: x / rect.width * strength,
                y: y / rect.height * strength,
                duration: 1,
                ease: "power3.out"
            });
        });

        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 2. Hero Brush Stroke Mask Animation
    const brushMask = document.querySelector('.gs-brush-mask');
    if (brushMask) {
        let brushTl = gsap.timeline({
            scrollTrigger: {
                trigger: brushMask,
                start: "top 85%",
                once: true
            }
        });

        brushTl.set(brushMask, { opacity: 1 })
            .to(brushMask, {
                clipPath: "polygon(0 0, 110% 0, 110% 100%, -10% 100%)",
                duration: 2.2, // Silk smooth ink reveal
                ease: "power2.inOut"
            });
    }

    // 3. Navigation Toggle & Overlay
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-item a');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.contains('open');
            navToggle.classList.toggle('open');
            navOverlay.classList.toggle('active');

            if (!isOpen) {
                lenis.stop(); // Disable scroll
            } else {
                lenis.start(); // Enable scroll
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navOverlay.classList.remove('active');
                lenis.start();

                // Smooth scroll to target using Lenis
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    setTimeout(() => {
                        lenis.scrollTo(targetId, { offset: -100, duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
                    }, 500);
                }
            });
        });
    }

    // Header Blur on Scroll
    const header = document.querySelector('.master-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                header.classList.remove('mix-blend');
            } else {
                header.classList.remove('scrolled');
                header.classList.add('mix-blend');
            }
        }, { passive: true });
    }

    // 4. Elite Parallax & Blur for Hero
    const heroContent = document.querySelector('.hero-content');
    const heroBgWrapper = document.querySelector('.hero-bg-wrapper');
    if (heroContent && heroBgWrapper) {
        gsap.to(heroContent, {
            y: "20vh",
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
        gsap.to(heroBgWrapper, {
            clipPath: "polygon(0% 0, 100% 0, 100% 100%, 0% 100%)",
            opacity: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // 5. Team Grid Stagger Reveal
    gsap.fromTo(".team-member",
        { autoAlpha: 0, y: 50 },
        {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".team-grid",
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
}

// =======================================
// DOM READY BOOTSTRAP
// =======================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Init Scroll
    initLenis();

    // 2. Init GSAP Animations
    // Small delay to ensure render tree is ready
    setTimeout(() => {
        initAnimations();
    }, 100);

    // 3. Init UI Interactions
    initInteractions();

    // Smooth scroll to top on reload
    window.scrollTo(0, 0);
});
