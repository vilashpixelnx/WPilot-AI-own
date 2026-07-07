(function () {
  'use strict';

  /* ── SCROLL-REVEAL ──────────────────────────────────────── */
  const revealSelectors = [
    '.section-head',
    '.pain-card', '.feat-row', '.marketer-card', '.proof-card', '.story-card',
    '.math-fact', '.ms', '.j-step',
    '.stack-bad', '.stack-good', '.stack-vs',
    '.hero-flow', '.hero-cta-row', '.hero-trust', '.hero-video',
    '.eyebrow', '.hero-h1', '.hero-sub',
    '.intro-split', '.steps4 > .step4',
    '.ptable-wrap', '.ptotal',
    '.guar-wrap', '.price-card', '.stack-box', '.journey',
    '.disc-block', '.disc-foot',
    '.final-h', '.final-sub', '.section-final .btn'
  ];

  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── STICKY HEADER (NEW) ───────────────────────────────── */
  const header = document.querySelector(".rec-header-wrapper");

  if (header) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;

      if (scrollTop > 300) {
        header.classList.add("header-visible");
      } else {
        header.classList.remove("header-visible");
      }
    });
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

  /* ── FAQ ACCORDION ─────────────────────────────────────── */
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

      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    btn.setAttribute('aria-expanded', 'false');
  });

  /* ── COUNTDOWN TIMER ───────────────────────────────────── */
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

  /* ── SMOOTH SCROLL ─────────────────────────────────────── */
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

  /* ── PAUSE MARQUEE ON HOVER ───────────────────────────── */
  document.querySelectorAll('.m-row').forEach(row => {
    const tracks = row.querySelectorAll('.m-track');

    row.addEventListener('mouseenter', () => {
      tracks.forEach(t => t.style.animationPlayState = 'paused');
    });

    row.addEventListener('mouseleave', () => {
      tracks.forEach(t => t.style.animationPlayState = 'running');
    });
  });

})();