// WPilot AI — OTO1 (Unlimited) Sales Page

// ── FOOTER YEAR ──
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// ── REVEAL ON SCROLL ──
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
})();

// ── SCROLL REVEAL ──
(function () {
  const solo = [
    '.section-tag', '.section-title', '.section-sub',
    '.hero-cta', '.hero-sub',
    '.cta-card', '.cta-card-title',
    '.product-cover', '.product-content',
    '.step-block', '.timeline-item',
    '.feature-card', '.stat-card', '.marketer-card',
    '.funnel-block', '.prize-card', '.prize-total-banner',
    '.video-slot',
    '.reciprocate-img', '.connect-card',
    '.faq-item', '.footer-inner', '.countdown-wrap',
    '.demo-video-wrap',
  ].join(', ');

  document.querySelectorAll(solo).forEach((el) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    const siblings = parent ? [...parent.children].filter(c => c.classList.contains(el.classList[0])) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 6) * 0.07}s`;
  });

  // Hero pills — stagger
  document.querySelectorAll('.hero-pill').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();



// ── HERO RIPPLE GRID (vanilla port of background-ripple-effect) ──
(function () {
  const grid = document.getElementById('rippleGrid');
  const base = document.getElementById('rippleBase');
  const spot = document.getElementById('rippleSpot');
  const hero = document.getElementById('hero');
  if (!grid || !base || !spot || !hero) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CELL = 54;
  let cells = [];

  function build() {
    const cols = Math.ceil(grid.clientWidth / CELL) + 1;
    const rows = Math.ceil(grid.clientHeight / CELL) + 1;
    base.style.gridTemplateColumns = `repeat(${cols}, ${CELL}px)`;
    base.style.gridAutoRows = `${CELL}px`;
    const frag = document.createDocumentFragment();
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'ripple-cell';
        frag.appendChild(cell);
        cells.push(cell);
      }
    }
    base.innerHTML = '';
    base.appendChild(frag);
  }

  // Click ripple — a smooth, continuous ring of cyan grid that expands from the
  // click point and fades out, animated frame-by-frame (a real water-ripple feel).
  const DUR = 900;      // ms
  const MAX_R = 300;    // px — how far the wave travels before it dissolves
  const BAND = 60;      // px — softness/thickness of the ring

  function ripple(px, py) {
    if (reduce) return;
    const el = document.createElement('div');
    el.className = 'ripple-pulse';
    grid.appendChild(el);
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / DUR);
      const ease = 1 - Math.pow(1 - t, 3);              // ease-out cubic — fast then settling
      const r = ease * MAX_R;
      const inner = Math.max(0, r - BAND);
      const opacity = Math.pow(1 - t, 1.6) * 0.75;      // smooth fade to nothing
      const m = `radial-gradient(circle at ${px}px ${py}px,
        transparent ${inner}px,
        rgba(0,0,0,0.55) ${r - BAND * 0.5}px,
        #000 ${r}px,
        rgba(0,0,0,0.55) ${r + BAND * 0.5}px,
        transparent ${r + BAND}px)`;
      el.style.webkitMaskImage = m;
      el.style.maskImage = m;
      el.style.opacity = opacity.toFixed(3);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(frame);
  }

  // Ripple on any click inside the hero (text stays fully selectable), except on
  // interactive controls like the CTA button or nav links.
  hero.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    const rect = grid.getBoundingClientRect();
    ripple(e.clientX - rect.left, e.clientY - rect.top);
  });

  // Mouse-following cyan spotlight — eased for smooth trailing motion
  let tx = -999, ty = -999, cx = -999, cy = -999, raf = null, active = false;

  function follow() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    spot.style.setProperty('--mx', cx.toFixed(1) + 'px');
    spot.style.setProperty('--my', cy.toFixed(1) + 'px');
    if (active || Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
      raf = requestAnimationFrame(follow);
    } else {
      raf = null;
    }
  }

  hero.addEventListener('mouseenter', e => {
    const rect = grid.getBoundingClientRect();
    tx = cx = e.clientX - rect.left;   // snap on entry, then ease on move
    ty = cy = e.clientY - rect.top;
    active = true;
    spot.style.opacity = '1';
    if (!raf) raf = requestAnimationFrame(follow);
  });
  hero.addEventListener('mousemove', e => {
    const rect = grid.getBoundingClientRect();
    tx = e.clientX - rect.left;
    ty = e.clientY - rect.top;
    active = true;
    if (!raf) raf = requestAnimationFrame(follow);
  });
  hero.addEventListener('mouseleave', () => {
    active = false;
    spot.style.opacity = '0';
  });

  build();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
})();

