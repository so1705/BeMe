// =========================================================
// BeMeキャリア — トップページ用スクリプト (index.html 専用)
// 依存ライブラリなし。下層ページは script.js を使用。
// =========================================================
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initMobileNav();
        initReveal();
        initCountUp();
        initContactForm();
    });

    // ---------- Header: 背景切り替え ----------
    function initHeader() {
        var header = document.getElementById('bm-header');
        if (!header) return;

        var update = function () {
            header.classList.toggle('scrolled', window.scrollY > 24);
        };
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // ---------- モバイルナビ ----------
    function initMobileNav() {
        var btn = document.getElementById('bm-menu-btn');
        var nav = document.getElementById('bm-mobile-nav');
        if (!btn || !nav) return;

        var setOpen = function (open) {
            btn.classList.toggle('open', open);
            nav.classList.toggle('open', open);
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        btn.addEventListener('click', function () {
            setOpen(!nav.classList.contains('open'));
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setOpen(false);
            });
        });
    }

    // ---------- スクロールリビール ----------
    function initReveal() {
        var targets = document.querySelectorAll('.bm-reveal');
        if (!targets.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { observer.observe(el); });
    }

    // ---------- 数字カウントアップ ----------
    function initCountUp() {
        var counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        var render = function (el, value) {
            el.textContent = value.toLocaleString('ja-JP');
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            counters.forEach(function (el) {
                render(el, parseInt(el.getAttribute('data-count'), 10));
            });
            return;
        }

        var animate = function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 1600;
            var start = null;

            var step = function (ts) {
                if (start === null) start = ts;
                var progress = Math.min((ts - start) / duration, 1);
                // easeOutCubic
                var eased = 1 - Math.pow(1 - progress, 3);
                render(el, Math.round(target * eased));
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { observer.observe(el); });
    }

    // ---------- お問い合わせフォーム ----------
    function initContactForm() {
        var form = document.getElementById('bm-contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            // 送信先が未設定(placeholder)の間は送信を止めて案内を表示する
            if ((form.getAttribute('action') || '').indexOf('placeholder') !== -1) {
                e.preventDefault();
                alert('お問い合わせありがとうございます。現在フォームの送信先を準備中です。お急ぎの場合は info@bemecareer.com までご連絡ください。');
            }
        });
    }
})();
