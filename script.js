// =======================================
// INITIALIZATION
// =======================================
document.addEventListener('DOMContentLoaded', () => {
    initLoaderSequence();
    initLightweightInteractions();
});

// =======================================
// LOADER & SOUND EFFECTS
// =======================================
function playBrushSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Create noise buffer
        const bufferSize = ctx.sampleRate * 2; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Pseudo-pink noise for brush character
            data[i] = (Math.random() * 2 - 1) * 0.8;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;

        // Low-pass filter to make it sound like paper/brush friction
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.2);

        // Envelope for swish dynamics
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        noiseSource.start();
        noiseSource.stop(ctx.currentTime + 1.5);
    } catch (e) {
        // Silently fail if audio context blocked
        console.warn('Audio Context blocked or unsupported', e);
    }
}

function initLoaderSequence() {
    // Avoid re-running loader if already loaded in this session
    if (sessionStorage.getItem('beme_loaded')) {
        const loader = document.getElementById('global-loader');
        if (loader) loader.style.display = 'none';

        document.body.style.overflow = 'auto'; // Re-enable scrolling
        document.body.style.position = 'static';

        // Assuming gsap is defined elsewhere for this early return path
        if (typeof gsap !== 'undefined') {
            gsap.to('.hero-text-animate', {
                y: 0,
                opacity: 1,
                duration: 0.1,
                stagger: 0.1
            });
        } else {
            document.querySelectorAll('.hero-text-animate').forEach(el => el.classList.add('visible'));
        }

        // Assuming initScrollInteractions is defined elsewhere
        if (typeof initScrollInteractions === 'function') {
            initScrollInteractions();
        }
        initLightweightInteractions();
        return;
    }

    const loader = document.getElementById('global-loader');
    const text = document.querySelector('.loader-text');

    if (loader && text) {
        setTimeout(() => {
            playBrushSound();
            text.classList.add('brushed');

            // After text reveals, wait a bit, then pull up curtain
            setTimeout(() => {
                loader.classList.add('curtain-up');

                // Allow scrolling again
                document.body.style.overflow = '';

                // Trigger hero text float up elegantly with delay
                setTimeout(() => {
                    document.querySelectorAll('.hero-text-animate').forEach(el => {
                        el.classList.add('visible');
                    });
                    sessionStorage.setItem('beme_loaded', 'true'); // Set session storage on completion
                }, 600); // 幕が開いてから文字が浮き上がる
            }, 1800);

        }, 500);
    } else {
        document.body.style.overflow = '';
        document.querySelectorAll('.hero-text-animate').forEach(el => el.classList.add('visible'));
        sessionStorage.setItem('beme_loaded', 'true'); // Set session storage even if loader elements are missing
    }
}

// =======================================
// LIGHTWEIGHT ANIMATION & INTERACTION
// =======================================
function initLightweightInteractions() {

    // Simple Parallax for Watermarks (Native JS)
    const watermarks = document.querySelectorAll('.watermark-bg');
    if (watermarks.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            watermarks.forEach(wm => {
                const speed = wm.getAttribute('data-speed') || 0.3;
                wm.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }

    // 1. Intersection Observer for high-performance fade-ups & staggered bars
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                if (delay > 0) {
                    setTimeout(() => entry.target.classList.add('visible'), delay * 1000);
                } else {
                    entry.target.classList.add('visible');
                }
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.gs-fade-up, .gs-staggered-bar').forEach(elem => {
        fadeObserver.observe(elem);
    });
    // 2. Navigation Toggle & Overlay (Native JS, no GSAP or Lenis dependencies)
    const navToggle = document.querySelector('.nav-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-item a');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.contains('open');
            navToggle.classList.toggle('open');
            navOverlay.classList.toggle('active');

            if (!isOpen) {
                document.body.style.overflow = 'hidden'; // Stop native scrolling
            } else {
                document.body.style.overflow = '';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navToggle.classList.remove('open');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';

                // Handle smooth scroll natively if on same page
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#') || targetId.startsWith('index.html#')) {
                    const id = targetId.includes('#') ? targetId.split('#')[1] : null;
                    if (id) {
                        const targetElem = document.getElementById(id);
                        if (targetElem) {
                            e.preventDefault();
                            targetElem.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    }

    // 3. Simple Header Scrolling Check
    const header = document.querySelector('.master-header');
    if (header && !window.location.pathname.includes('index.html')) {
        // Sub-pages handled inline dynamically if needed, but safe fallback
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
