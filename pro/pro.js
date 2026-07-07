/* ══════════════════════════════════════════════════════════════
   RecurHub OTO1 (Pro) — Interactions
   Lean: scroll-reveal + smooth scroll
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ────────────────────────────────────────── */
  const revealSelectors = [
    '.hero-eyebrow', '.hero-h1', '.hero-sub', '.hero-cta', '.hero-trust',
    '.hv-card',
    '.sec-head',
    '.limit-card',
    '.feat-card',
    '.compare-card',
    '.usecase-card',
    '.guarantee-box',
    '.price-card',
    '.disc-text', '.disc-promo', '.disc-bottom'
  ];

  const els = document.querySelectorAll(revealSelectors.join(','));
  els.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add('is-visible'));
  }


   /* ── FAQ ACCORDION ─────────────────────────────────────── */
  // Robust handler: works with type="button" buttons inside .faq-item
  const heroStripes = document.getElementById('heroStripes');
  if (heroStripes && !heroStripes.children.length) {
    const stripeCount = 24;
    for (let i = 0; i < stripeCount; i += 1) {
      const col = document.createElement('div');
      col.className = 'hero-figma-col';
      heroStripes.appendChild(col);
    }
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle this one
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    // Set initial aria
    btn.setAttribute('aria-expanded', 'false');
  });


  /* ── COUNTDOWN TIMER ───────────────────────────────────── */
  // 47-hour rolling launch timer, persists per browser session
  const timerEl = document.getElementById('topTimer');
  if (timerEl) {
    const STORAGE_KEY = 'recurhub_launch_end';
    const HOURS = 47;
    let endAt = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    const now = Date.now();
    if (!endAt || isNaN(endAt) || endAt < now) {
      endAt = now + HOURS * 60 * 60 * 1000;
      try { localStorage.setItem(STORAGE_KEY, endAt); } catch (_) {}
    }
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const diff = Math.max(0, endAt - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      timerEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    };
    tick();
    setInterval(tick, 1000);
  }


  /* ── STICKY OFFER BAR ───────────────────────────────────── */
  const offerBar = document.getElementById('offerBar');
  const offerBarToggle = document.getElementById('offerBarToggle');
  const offerBarPeek = document.getElementById('offerBarPeek');
  if (offerBar) {
    let manuallyHidden = false;

    const syncOfferBar = () => {
      const shouldShow = !manuallyHidden && window.scrollY > 260;
      const bodyOffset = shouldShow ? `${Math.ceil(offerBar.getBoundingClientRect().height)}px` : '0px';

      offerBar.classList.toggle('is-visible', shouldShow);
      offerBar.classList.toggle('is-collapsed', manuallyHidden);
      document.body.style.setProperty('--offer-bar-offset', bodyOffset);

      if (offerBarPeek) {
        offerBarPeek.classList.toggle('show', manuallyHidden);
      }
      if (offerBarToggle) {
        offerBarToggle.classList.toggle('is-collapsed', manuallyHidden);
        offerBarToggle.setAttribute('aria-pressed', String(manuallyHidden));
        offerBarToggle.setAttribute(
          'aria-label',
          manuallyHidden ? 'Show offer bar' : 'Hide offer bar'
        );
      }
    };

    const updateOfferBar = () => {
      syncOfferBar();
    };

    updateOfferBar();
    window.addEventListener('scroll', updateOfferBar, { passive: true });
    window.addEventListener('resize', updateOfferBar);

    if (offerBarToggle) {
      offerBarToggle.addEventListener('click', () => {
        manuallyHidden = true;
        syncOfferBar();
      });
    }

    if (offerBarPeek) {
      offerBarPeek.addEventListener('click', () => {
        manuallyHidden = false;
        syncOfferBar();
      });
    }
  }


  /* ── SMOOTH SCROLL ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    link.addEventListener('click', e => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
