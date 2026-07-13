// WPilot AI — Prelaunch Webinar Page Script

// ── NAV SCROLL STATE ──
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── NAV MOBILE MENU ──
(function () {
  const navbar = document.getElementById('navbar');
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.nav-mobile-panel');
  if (!navbar || !toggle || !panel) return;

  function closeMenu() {
    navbar.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) closeMenu();
  });
})();

// ── HERO RIPPLE GRID (mouse-following spotlight + click ripple over a faint grid) ──
(function () {
  const grid = document.getElementById('rippleGrid');
  const base = document.getElementById('rippleBase');
  const spot = document.getElementById('rippleSpot');
  const hero = document.getElementById('hero');
  if (!grid || !base || !spot || !hero) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CELL = 56;

  function build() {
    const cols = Math.ceil(grid.clientWidth / CELL) + 1;
    const rows = Math.ceil(grid.clientHeight / CELL) + 1;
    base.style.gridTemplateColumns = `repeat(${cols}, ${CELL}px)`;
    base.style.gridAutoRows = `${CELL}px`;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const cell = document.createElement('div');
      cell.className = 'ripple-cell';
      frag.appendChild(cell);
    }
    base.innerHTML = '';
    base.appendChild(frag);
  }

  // Click ripple — a continuous expanding ring of cyan grid that fades out.
  const DUR = 900;
  const MAX_R = 300;
  const BAND = 60;

  function ripple(px, py) {
    if (reduce) return;
    const el = document.createElement('div');
    el.className = 'ripple-pulse';
    grid.appendChild(el);
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / DUR);
      const ease = 1 - Math.pow(1 - t, 3);
      const r = ease * MAX_R;
      const inner = Math.max(0, r - BAND);
      const opacity = Math.pow(1 - t, 1.6) * 0.75;
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

  hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const rect = grid.getBoundingClientRect();
    ripple(e.clientX - rect.left, e.clientY - rect.top);
  });

  // Mouse-following cyan spotlight — eased for smooth trailing motion.
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

  hero.addEventListener('mouseenter', (e) => {
    const rect = grid.getBoundingClientRect();
    tx = cx = e.clientX - rect.left;
    ty = cy = e.clientY - rect.top;
    active = true;
    spot.style.opacity = '1';
    if (!raf) raf = requestAnimationFrame(follow);
  });
  hero.addEventListener('mousemove', (e) => {
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

// ── FOOTER YEAR ──
document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

// ── SCROLL REVEAL ──
(function () {
  const targets = document.querySelectorAll(
    '.hero-copy, .reg-card, ' +
    '.section-tag, .section-title, .section-sub, .wd-card, .pain-card, .compare-card, .stat-item, ' +
    '.agenda-item, .feature-card, .live-card, .replay-note, .foryou-card, ' +
    '.fc-date, .fc-schedule, .fc-warning, .fc-cta'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    const siblings = parent ? [...parent.children].filter((c) => c.classList.contains(el.classList[0])) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 6) * 0.06}s`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach((el) => io.observe(el));
})();

// ── COUNTDOWN TO WEBINAR (July 18, 2026 · 10:00 AM EST) ──
(function () {
  const WEBINAR_TS = new Date('2026-07-18T14:00:00Z').getTime();
  const boxes = document.querySelectorAll('.countdown');
  if (!boxes.length) return;

  function tick() {
    const now = Date.now();
    let diff = WEBINAR_TS - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    boxes.forEach((box) => {
      box.querySelector('[data-cd="days"]').textContent = String(days).padStart(2, '0');
      box.querySelector('[data-cd="hours"]').textContent = String(hours).padStart(2, '0');
      box.querySelector('[data-cd="mins"]').textContent = String(mins).padStart(2, '0');
      box.querySelector('[data-cd="secs"]').textContent = String(secs).padStart(2, '0');
    });
  }

  tick();
  setInterval(tick, 1000);
})();
