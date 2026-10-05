/* =====================================================
   MANIFEST RESTAURANT — script.js
   ===================================================== */
(function () {
  'use strict';

  /* ── SKIP LINK ──────────────────────────────────── */
  var skip = document.createElement('a');
  skip.href = '#hero';
  skip.textContent = 'Skip to main content';
  skip.style.cssText = 'position:absolute;top:-100%;left:1rem;background:#C9A96E;color:#0A0A08;padding:0.65rem 1.2rem;font-size:0.78rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;z-index:9999;transition:top 0.2s;border-radius:2px;';
  skip.addEventListener('focus', function () { skip.style.top = '0'; });
  skip.addEventListener('blur', function () { skip.style.top = '-100%'; });
  document.body.insertBefore(skip, document.body.firstChild);

  /* ── HEADER SCROLL ──────────────────────────────── */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ────────────────────────────────── */
  var burgerBtn  = document.getElementById('burger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.removeAttribute('hidden');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var first = mobileMenu.querySelector('a');
      if (first) first.focus();
    }, 80);
  }
  function closeMenu() {
    mobileMenu.setAttribute('hidden', '');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    burgerBtn.focus();
  }

  burgerBtn.addEventListener('click', function () {
    if (mobileMenu.hasAttribute('hidden')) openMenu();
    else closeMenu();
  });
  mobileLinks.forEach(function (l) { l.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) closeMenu();
  });

  /* ── SMOOTH ANCHOR SCROLL ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '70', 10);
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - hh,
        behavior: 'smooth'
      });
      if (id !== '#hero') closeMenu();
    });
  });

  /* ── ACTIVE NAV HIGHLIGHTING ────────────────────── */
  var sections  = document.querySelectorAll('section[id]');
  var navLinks  = document.querySelectorAll('.desktop-nav a');
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var href = '#' + entry.target.id;
        navLinks.forEach(function (l) {
          l.removeAttribute('aria-current');
          if (l.getAttribute('href') === href) l.setAttribute('aria-current', 'page');
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(function (s) { secObs.observe(s); });

  /* ── REVEAL ON SCROLL ───────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(function (el) { revObs.observe(el); });

  /* ── STAGGERED FADE-IN ──────────────────────────── */
  var fadeTargets = document.querySelectorAll(
    '.course-card, .review-card, .strip-item, .hours-row, .mosaic-item'
  );
  var fadeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = (parseInt(el.dataset.idx || '0', 10) % 6) * 80;
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        fadeObs.unobserve(el);
      }
    });
  }, { threshold: 0.08 });

  fadeTargets.forEach(function (el, i) {
    el.dataset.idx = i;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObs.observe(el);
  });

  /* ── HERO IMAGE KEN-BURNS ───────────────────────── */
  var heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    if (heroBgImg.complete) heroBgImg.classList.add('loaded');
    else heroBgImg.addEventListener('load', function () { heroBgImg.classList.add('loaded'); });
  }

  /* ── HERO PARALLAX ──────────────────────────────── */
  if (heroBgImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      if (window.scrollY < window.innerHeight * 1.2) {
        var offset = window.scrollY * 0.2;
        heroBgImg.style.transform = 'translateY(' + offset + 'px) scale(1.08)';
      }
    }, { passive: true });
  }

  /* ── GALLERY LIGHTBOX ───────────────────────────── */
  var galleryImgs = document.querySelectorAll('.mosaic-item img');
  galleryImgs.forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.style.cursor = 'zoom-in';
    function openLb() {
      var lb = document.createElement('div');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Image viewer');
      lb.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(10,10,8,0.97);display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:2rem;';
      var lbImg = document.createElement('img');
      lbImg.src = img.src; lbImg.alt = img.alt;
      lbImg.style.cssText = 'max-width:90vw;max-height:88vh;object-fit:contain;filter:none;';
      var closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close image');
      closeBtn.style.cssText = 'position:absolute;top:1.5rem;right:1.5rem;background:rgba(201,169,110,0.15);border:1px solid rgba(201,169,110,0.3);color:#C9A96E;font-size:1.75rem;width:46px;height:46px;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;';
      closeBtn.addEventListener('mouseenter', function () { this.style.background = 'rgba(201,169,110,0.3)'; });
      closeBtn.addEventListener('mouseleave', function () { this.style.background = 'rgba(201,169,110,0.15)'; });
      lb.appendChild(lbImg);
      lb.appendChild(closeBtn);
      document.body.appendChild(lb);
      document.body.style.overflow = 'hidden';
      closeBtn.focus();

      function closeLb() {
        document.body.removeChild(lb);
        document.body.style.overflow = '';
      }
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      closeBtn.addEventListener('click', closeLb);
      document.addEventListener('keydown', function escFn(e) {
        if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', escFn); }
      });
    }
    img.addEventListener('click', openLb);
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); }
    });
  });

  /* ── SCROLL CUE FADE ────────────────────────────── */
  var scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      var opacity = Math.max(0, 1 - window.scrollY / 300);
      scrollIndicator.style.opacity = opacity;
    }, { passive: true });
  }

  /* ── MAP IFRAME LAZY LOAD ───────────────────────── */
  var mapIframe = document.querySelector('.visit-map iframe');
  if (mapIframe && 'IntersectionObserver' in window) {
    var src = mapIframe.getAttribute('src');
    mapIframe.removeAttribute('src');
    var mapObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        mapIframe.setAttribute('src', src);
        mapObs.disconnect();
      }
    }, { rootMargin: '200px' });
    mapObs.observe(mapIframe);
  }

})();
