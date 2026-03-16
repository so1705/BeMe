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
            // Apply fast fade and slight zoom to Logo instead of old brush animation
            text.classList.add('brushed');

            // Logo animation lasts 1.4s. Split screen exactly matching it for momentum.
            setTimeout(() => {
                loader.classList.add('curtain-up');

                // Allow scrolling again
                document.body.style.overflow = '';

                // Trigger hero text float up with very short delay for high impact
                setTimeout(() => {
                    document.querySelectorAll('.hero-text-animate').forEach(el => {
                        el.classList.add('visible');
                    });

                    // Cleanup loader from DOM
                    setTimeout(() => {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 500);
                    }, 1500);
                    sessionStorage.setItem('beme_loaded', 'true');
                }, 400); // Trigger logo reveal after curtain starts moving
            }, 1300); // 1.3s split trigger

        }, 200); // Faster initial wait time
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

    // Header Background on Scroll
    const header = document.querySelector('.master-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 1. Premium GSAP Scroll Animations (Leverages Style)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // High-end fade-up with subtle blur and scale
        const fadeUps = document.querySelectorAll('.gs-fade-up');
        fadeUps.forEach(elem => {
            const delay = parseFloat(elem.getAttribute('data-delay') || 0);
            gsap.fromTo(elem,
                { opacity: 0, y: 50, scale: 0.98, filter: 'blur(8px)' },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    delay: delay,
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                        onEnter: () => {
                            elem.classList.add('visible');
                        },
                        onEnterBack: () => elem.classList.add('visible')
                    }
                }
            );
            // Disable original css logic to let GSAP take over completely
            elem.style.transition = 'none';
        });

        // Staggered bars for charts
        const bars = document.querySelectorAll('.gs-staggered-bar');
        bars.forEach(bar => {
            gsap.fromTo(bar,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    transformOrigin: 'bottom',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            bar.style.transition = 'none';
        });

        // Parallax Images
        const parallaxImgs = document.querySelectorAll('.parallax-img');
        parallaxImgs.forEach(img => {
            gsap.fromTo(img,
                { scale: 1.15, y: -20 },
                {
                    scale: 1,
                    y: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });

    } else {
        // Fallback for pages that might not load GSAP
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
    }
    // 3. Simple Header Scrolling Check (Consolidated)
    // Removed redundant declaration of 'header' to fix lint error
    
    // Hamburger Menu Logic
    const toggle = document.getElementById('nav-toggle');
    const overlay = document.getElementById('nav-overlay');
    
    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.classList.toggle('nav-active');
            
            // Prevent scrolling when menu is open
            if (overlay.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
                document.body.classList.remove('nav-active');
            });
        });
    }

    // Contact Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // If the action is still placeholder, intercept to show a nice message
            if (this.getAttribute('action').includes('placeholder')) {
                e.preventDefault();
                alert('お問い合わせありがとうございます。現在フォームの送信先を調整中ですが、入力内容は正常に受け付け可能な形式に整えられました。 (This is a preview of the functional form)');
            }
        });
    }
}
