// WPilot AI — JV Page Script

// ── LUCIDE ICONS ──
lucide.createIcons();

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

// ── COUNTDOWN TO CART OPEN — July 18, 2026 · 11:00 AM EST ──
(function () {
  const LAUNCH_TS = new Date('2026-07-18T15:00:00Z').getTime(); // 11:00 AM EDT = 15:00 UTC
  const root = document.getElementById('countdown');
  if (!root) return;

  const els = {
    days:  root.querySelector('[data-cd="days"]'),
    hours: root.querySelector('[data-cd="hours"]'),
    mins:  root.querySelector('[data-cd="mins"]'),
    secs:  root.querySelector('[data-cd="secs"]'),
  };
  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

  function tick() {
    const diff = LAUNCH_TS - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = '00';
      const label = document.querySelector('.countdown-label');
      if (label) { label.innerHTML = '<i data-lucide="zap"></i> Cart Is Live!'; lucide.createIcons(); }
      return;
    }
    els.days.textContent  = pad(Math.floor(diff / 86_400_000));
    els.hours.textContent = pad(Math.floor((diff % 86_400_000) / 3_600_000));
    els.mins.textContent  = pad(Math.floor((diff % 3_600_000) / 60_000));
    els.secs.textContent  = pad(Math.floor((diff % 60_000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

// ── FAQ ACCORDION ──
const faqs = [
  { q: 'What is WPilot AI?', a: 'WPilot AI is an all-in-one bundle of 10 premium WordPress plugins with 50+ AI features built in. It automates the boring work — writing product descriptions, catching fraud orders, chatting with customers 24/7, optimising images, ranking in ChatGPT, running WordPress by chat command, WhatsApp order notifications, security, uptime monitoring and custom checkout — for one low, one-time payment.' },
  { q: 'Who is the target audience?', a: 'WooCommerce store owners (6.5M+ globally), WordPress agencies, freelancers, MMO buyers, and subscription-fatigued AI tool buyers. Anyone running WordPress or WooCommerce who is tired of paying $200+/month across Yoast, Wordfence, Tidio, WPML, AffiliateWP and more will buy this instantly.' },
  { q: 'What are the commission rates?', a: '50% across the entire funnel — the $19 Front End plus all 3 OTOs (Unlimited Sites & Lifetime Updates, Done-For-You Pack, and Reseller & Whitelabel Rights). With a full funnel value of ~$650, top affiliates earn up to $275 per buyer.' },
  { q: 'What does the funnel look like?', a: 'Front End: WPilot AI Bundle at $19 (personal use). OTO 1: Unlimited Sites & Lifetime Updates ($37). OTO 2: Done-For-You Pack ($97). OTO 3: Reseller & Whitelabel Rights ($397). Plus a Complete Bundle Deal ($247) that unlocks the FE and all 3 OTOs in one payment — a $123.50 instant commission per bundle sale.' },
  { q: 'What launch platform is this on?', a: 'WPilot AI launches on LaunchPad with standard affiliate cookie tracking, a real-time leaderboard, and automatic payouts. Click any "Get Affiliate Link" button above to register.' },
  { q: 'When does the cart open and close?', a: 'Cart opens July 18, 2026 at 11:00 AM EST (right after the 10:00 AM live demo) and closes July 23, 2026 at 11:59 PM EST. Use scarcity in your final 48-hour emails' },
  { q: 'Is there a refund policy?', a: 'Yes — a 14-day, no-questions-asked money-back guarantee. Refunds are processed to the original payment method with no support interrogation. One-time payments mean no subscription chargebacks, so refund risk stays contained.' },
  { q: 'What marketing materials are available?', a: 'Full JV Doc, a 5-day email swipe sequence, multiple A/B subject lines, banner ads in multiple sizes, a product demo video, the vendor VSL, sales page preview, and a bonus page generator. All resources link from the CTA sections above and go live before launch.' },
  { q: 'How do I contact the JV team?', a: 'Reach out to Himanshu Mehta directly via Microsoft Teams, Facebook, or WhatsApp — details are in the "Need Help?" section above. Happy to jump on a call to help you plan your promo and discuss custom bonuses.' },
];

const faqList = document.getElementById('faq-list');
const FAQ_ICON_PLUS  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const FAQ_ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

if (faqList) {
  faqs.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q" aria-expanded="false" onclick="toggleFaq(this)">
        <span>${item.q}</span>
        <span class="faq-icon">${FAQ_ICON_PLUS}</span>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
    `;
    faqList.appendChild(el);
  });
}

function toggleFaq(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  document.querySelectorAll('.faq-q').forEach(b => {
    b.setAttribute('aria-expanded', 'false');
    b.querySelector('.faq-icon').innerHTML = FAQ_ICON_PLUS;
    b.nextElementSibling.style.maxHeight = null;
  });
  if (!isOpen) {
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.faq-icon').innerHTML = FAQ_ICON_CLOSE;
    const answer = btn.nextElementSibling;
    requestAnimationFrame(() => { answer.style.maxHeight = answer.scrollHeight + 'px'; });
  }
}

// ── STICKY NAV ──
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');

function closeNavMenu() {
  navbar.classList.remove('nav-open');
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { if (window.innerWidth <= 992) closeNavMenu(); });
  });
  document.addEventListener('click', (event) => {
    if (!navbar.classList.contains('nav-open')) return;
    if (!navbar.contains(event.target)) closeNavMenu();
  });
}

window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
window.addEventListener('resize', () => { if (window.innerWidth > 992) closeNavMenu(); });
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNavMenu(); });

// ── TOAST ──
function showToast(msg) {
  let toast = document.getElementById('geo-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'geo-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('toast-show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('toast-show'), 3000);
}

// ── COMING SOON LINKS ──
document.querySelectorAll('.cta-resource-card[href="#"], .demo-placeholder[href="#"], .nav-coming-soon').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showToast('Coming soon — resources go live before launch!');
  });
});

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

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
