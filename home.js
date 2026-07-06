// =========================================================
// BeMeキャリア — トップページ演出 (index.html 専用)
// Lenis(慣性スクロール) + GSAP ScrollTrigger
// どちらかが読み込めない環境でも、内容がすべて見える形に劣化します
// =========================================================
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

        initMobileNav();
        initFaqSafety();
        initContactForm();

        if (reduceMotion || !hasGsap) {
            fallbackShowAll();
            initHeaderThemeByScroll();
            if (!reduceMotion) {
                initCountersIO();
            } else {
                finishCounters();
            }
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        var lenis = initLenis();
        initAurora('aurora');
        initAurora('aurora2');
        initLoader(function () {
            initHeroIntro();
        });
        initHeroParallax();
        initIssueLines();
        initReveals();
        initBusinessTheater();
        initNumbers();
        initScenes();
        initClosing();
        initHeaderTheme();
        initAnchors(lenis);
    });

    // ---------- Lenis 慣性スクロール ----------
    function initLenis() {
        if (typeof Lenis === 'undefined') return null;

        var lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        document.documentElement.classList.add('lenis');
        return lenis;
    }

    function initAnchors(lenis) {
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href');
                if (id.length < 2) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -70, duration: 1.4 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ---------- 背景の光(オーロラ) ----------
    function initAurora(id) {
        var canvas = document.getElementById(id);
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var w, h;
        var running = false;
        var t = Math.random() * 100;

        var blobs = [
            { hue: 217, sat: 70, r: 0.55, cx: 0.75, cy: 0.2, sx: 0.16, sy: 0.12, sp: 0.12, a: 0.5 },
            { hue: 200, sat: 60, r: 0.45, cx: 0.2, cy: 0.75, sx: 0.14, sy: 0.1, sp: 0.09, a: 0.4 },
            { hue: 235, sat: 55, r: 0.5, cx: 0.5, cy: 0.55, sx: 0.1, sy: 0.14, sp: 0.07, a: 0.35 }
        ];

        function resize() {
            // 低解像度で描いて引き伸ばす(軽量化)
            w = canvas.width = Math.max(2, Math.floor(canvas.offsetWidth / 3));
            h = canvas.height = Math.max(2, Math.floor(canvas.offsetHeight / 3));
        }
        resize();
        window.addEventListener('resize', resize);

        function frame() {
            if (!running) return;
            t += 0.004;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            blobs.forEach(function (b, i) {
                var x = (b.cx + Math.cos(t * (1 + b.sp * 8) + i * 2.1) * b.sx) * w;
                var y = (b.cy + Math.sin(t * (1 + b.sp * 6) + i * 1.7) * b.sy) * h;
                var r = b.r * Math.max(w, h);
                var g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, 'hsla(' + b.hue + ',' + b.sat + '%,42%,' + b.a * 0.55 + ')');
                g.addColorStop(1, 'hsla(' + b.hue + ',' + b.sat + '%,42%,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(frame);
        }

        // 画面内にあるときだけ描画
        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var next = entry.isIntersecting;
                if (next && !running) {
                    running = true;
                    requestAnimationFrame(frame);
                } else if (!next) {
                    running = false;
                }
            });
        }).observe(canvas);
    }

    // ---------- ローディング画面 ----------
    function initLoader(onDone) {
        var loader = document.getElementById('loader');
        if (!loader) {
            onDone();
            return;
        }

        document.body.classList.add('is-loading');

        var logo = loader.querySelector('.loader-logo');
        var logoSmall = logo ? logo.querySelector('small') : null;
        var chars = [];
        if (logo) {
            // small以外のテキストノードを文字分割
            var textNode = logo.firstChild;
            var text = textNode ? textNode.textContent : '';
            if (textNode) logo.removeChild(textNode);
            var frag = document.createDocumentFragment();
            Array.from(text).forEach(function (ch) {
                var span = document.createElement('span');
                span.className = 'char';
                span.textContent = ch;
                frag.appendChild(span);
            });
            logo.insertBefore(frag, logoSmall);
            chars = logo.querySelectorAll('.char');
        }

        var numEl = document.getElementById('loader-num');
        var barEl = document.getElementById('loader-bar');
        var count = { v: 0 };

        var tl = gsap.timeline({
            onComplete: function () {
                loader.classList.add('done');
                document.body.classList.remove('is-loading');
                onDone();
            }
        });

        // ロゴが立ち上がる
        tl.to(chars, {
            y: 0,
            duration: 0.9,
            ease: 'power4.out',
            stagger: 0.06
        }, 0.15);
        if (logoSmall) {
            tl.to(logoSmall, { y: 0, duration: 0.8, ease: 'power4.out' }, 0.45);
        }

        // カウント & プログレスバー
        tl.to(count, {
            v: 100,
            duration: 1.05,
            ease: 'power2.inOut',
            onUpdate: function () {
                if (numEl) numEl.textContent = Math.round(count.v);
                if (barEl) barEl.style.transform = 'scaleX(' + (count.v / 100) + ')';
            }
        }, 0.2);

        // ロゴ・カウントを送り出す
        tl.to('.loader-inner, .loader-count', {
            y: -30,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.in'
        }, '+=0.1');

        // 上下のパネルが開いて本編へ
        tl.to('.loader-panel.p1', { yPercent: -102, duration: 0.9, ease: 'power4.inOut' }, '-=0.1');
        tl.to('.loader-panel.p2', { yPercent: 102, duration: 0.9, ease: 'power4.inOut' }, '<');
    }

    // ---------- ヒーロー:文字が立ち上がる ----------
    function splitChars(el) {
        var text = el.textContent;
        el.textContent = '';
        var frag = document.createDocumentFragment();
        Array.from(text).forEach(function (ch) {
            var span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            frag.appendChild(span);
        });
        el.appendChild(frag);
        return el.querySelectorAll('.char');
    }

    function initHeroIntro() {
        var lines = document.querySelectorAll('.js-hero-line');
        var chars = [];
        lines.forEach(function (line) {
            splitChars(line).forEach(function (c) { chars.push(c); });
        });

        var tl = gsap.timeline({ delay: 0.1 });
        if (chars.length) {
            tl.to(chars, {
                y: 0,
                rotate: 0,
                duration: 1.3,
                ease: 'power4.out',
                stagger: 0.05
            });
        }
        // グラデーション行は行ごと立ち上げ(文字分割するとグラデが途切れるため)
        var blocks = document.querySelectorAll('.hero-title .block-in');
        if (blocks.length) {
            tl.to(blocks, {
                y: 0,
                duration: 1.3,
                ease: 'power4.out'
            }, chars.length ? '-=0.9' : 0);
        }
        tl.to('.js-hero-fade', {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.12
        }, '-=0.7');
    }

    function initHeroParallax() {
        var photo = document.querySelector('.hero-photo img');
        if (photo) {
            gsap.to(photo, {
                yPercent: 14,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        gsap.to('.hero-body', {
            yPercent: -10,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom 30%',
                scrub: true
            }
        });
    }

    // ---------- 問題提起:一行ずつ点灯 ----------
    function initIssueLines() {
        document.querySelectorAll('.issue-line').forEach(function (line) {
            gsap.fromTo(line,
                { opacity: 0.12 },
                {
                    opacity: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 80%',
                        end: 'top 45%',
                        scrub: true
                    }
                });
        });
    }

    // ---------- 汎用リビール ----------
    function initReveals() {
        document.querySelectorAll('.js-reveal, .js-clip').forEach(function (el) {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 86%',
                once: true,
                onEnter: function () {
                    el.classList.add('visible');
                }
            });
        });
    }

    // ---------- 事業内容:横スクロールシアター ----------
    function initBusinessTheater() {
        var mm = gsap.matchMedia();

        mm.add('(min-width: 901px)', function () {
            var track = document.getElementById('biz-track');
            var viewport = document.getElementById('biz-viewport');
            if (!track || !viewport) return;

            var getDist = function () {
                return track.scrollWidth - viewport.offsetWidth;
            };

            var tween = gsap.to(track, {
                x: function () { return -getDist(); },
                ease: 'none',
                scrollTrigger: {
                    trigger: viewport,
                    start: 'top top',
                    end: function () { return '+=' + getDist(); },
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            // パネル内の写真を逆方向に流す(奥行き)
            document.querySelectorAll('.biz-photo img').forEach(function (img) {
                gsap.to(img, {
                    xPercent: -6,
                    ease: 'none',
                    scrollTrigger: {
                        containerAnimation: tween,
                        trigger: img.closest('.biz-panel'),
                        start: 'left right',
                        end: 'right left',
                        scrub: true
                    }
                });
            });

            return function () { };
        });
    }

    // ---------- 実績カウンター ----------
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var obj = { v: 0 };
        gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: function () {
                el.textContent = Math.round(obj.v).toLocaleString('ja-JP');
            }
        });
    }

    function initNumbers() {
        document.querySelectorAll('.js-numrow').forEach(function (row, i) {
            ScrollTrigger.create({
                trigger: row,
                start: 'top 88%',
                once: true,
                onEnter: function () {
                    setTimeout(function () {
                        row.classList.add('visible');
                        var counter = row.querySelector('[data-count]');
                        if (counter) animateCounter(counter);
                    }, i * 90);
                }
            });
        });
    }

    // ---------- シーン写真のパララックス ----------
    function initScenes() {
        document.querySelectorAll('.scene-photo img').forEach(function (img) {
            gsap.fromTo(img,
                { yPercent: -8 },
                {
                    yPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.scene'),
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true
                    }
                });
        });
    }

    // ---------- クロージング:文字の立ち上がり ----------
    function initClosing() {
        var lines = document.querySelectorAll('.js-close-line');
        var blocks = document.querySelectorAll('.closing-title .block-in');
        if (!lines.length && !blocks.length) return;

        var chars = [];
        lines.forEach(function (line) {
            splitChars(line).forEach(function (c) { chars.push(c); });
        });

        var tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.closing',
                start: 'top 60%',
                once: true
            }
        });
        if (chars.length) {
            tl.to(chars, {
                y: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.045
            });
        }
        if (blocks.length) {
            tl.to(blocks, {
                y: 0,
                duration: 1.2,
                ease: 'power4.out'
            }, chars.length ? '-=0.8' : 0);
        }
    }

    // ---------- ヘッダーの明暗切り替え ----------
    function lightSections() {
        return document.querySelectorAll('.about, .scene-student, .team, .faq, .sub-intro, .flow, .basis, .sub-value');
    }

    function initHeaderTheme() {
        var header = document.getElementById('site-header');
        if (!header) return;
        var active = 0;

        lightSections().forEach(function (sec) {
            ScrollTrigger.create({
                trigger: sec,
                start: 'top 78px',
                end: 'bottom 78px',
                onToggle: function (self) {
                    active += self.isActive ? 1 : -1;
                    header.classList.toggle('on-light', active > 0);
                }
            });
        });
    }

    // GSAPなし環境向け:スクロールで判定
    function initHeaderThemeByScroll() {
        var header = document.getElementById('site-header');
        if (!header) return;
        var secs = Array.prototype.slice.call(lightSections());

        var update = function () {
            var y = 78;
            var onLight = secs.some(function (sec) {
                var r = sec.getBoundingClientRect();
                return r.top <= y && r.bottom >= y;
            });
            header.classList.toggle('on-light', onLight);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // ---------- フォールバック(GSAPなし/モーション低減) ----------
    function fallbackShowAll() {
        var loader = document.getElementById('loader');
        if (loader) loader.classList.add('done');
        document.body.classList.remove('is-loading');
        document.querySelectorAll('.hero-title .block-in, .closing-title .block-in').forEach(function (el) {
            el.style.transform = 'none';
        });
        document.querySelectorAll('.js-reveal, .js-clip, .num-row').forEach(function (el) {
            el.classList.add('visible');
        });
        document.querySelectorAll('.js-hero-fade').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        document.querySelectorAll('.issue-line').forEach(function (el) {
            el.style.opacity = '1';
        });
        // char分割前なのでそのまま表示される
    }

    function finishCounters() {
        document.querySelectorAll('[data-count]').forEach(function (el) {
            el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString('ja-JP');
        });
    }

    function initCountersIO() {
        if (!('IntersectionObserver' in window)) {
            finishCounters();
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                io.unobserve(entry.target);
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'), 10);
                var start = null;
                var step = function (ts) {
                    if (start === null) start = ts;
                    var p = Math.min((ts - start) / 1600, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased).toLocaleString('ja-JP');
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
    }

    // ---------- モバイルナビ ----------
    function initMobileNav() {
        var btn = document.getElementById('menu-btn');
        var nav = document.getElementById('mobile-nav');
        if (!btn || !nav) return;

        var setOpen = function (open) {
            btn.classList.toggle('open', open);
            nav.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            nav.setAttribute('aria-hidden', open ? 'false' : 'true');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        btn.addEventListener('click', function () {
            setOpen(!nav.classList.contains('open'));
        });

        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { setOpen(false); });
        });
    }

    // ---------- FAQ:同時に複数開いてもよいが、キーボード操作を保証 ----------
    function initFaqSafety() {
        // details/summaryはネイティブ動作に任せる(追加処理なし)
    }

    // ---------- お問い合わせフォーム ----------
    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            if ((form.getAttribute('action') || '').indexOf('placeholder') !== -1) {
                e.preventDefault();
                alert('お問い合わせありがとうございます。現在フォームの送信先を準備中です。お急ぎの場合は info@bemecareer.com までご連絡ください。');
            }
        });
    }
})();
