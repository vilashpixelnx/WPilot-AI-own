// RankOnAI — Prelaunch / Webinar page script (Launchpad launch · 7 June 2026)

// ── LUCIDE ICONS ──
lucide.createIcons();

// ── CURRENT YEAR ──
(function () {
  const y = document.getElementById('currentYear');
  if (y) y.textContent = new Date().getFullYear();
})();

// ── COUNTDOWN ── (target: June 7, 2026 · 10:00 AM EST)
(function () {
  const root = document.getElementById('countdown');
  if (!root) return;
  const deadline = new Date(root.dataset.deadline).getTime();
  const elDays = root.querySelector('[data-days]');
  const elHours = root.querySelector('[data-hours]');
  const elMins = root.querySelector('[data-mins]');
  const elSecs = root.querySelector('[data-secs]');
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMins.textContent = elSecs.textContent = '00';
      const eyebrow = root.previousElementSibling;
      if (eyebrow && eyebrow.classList.contains('rc-eyebrow')) eyebrow.textContent = 'The webinar is live now';
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    elDays.textContent = pad(d);
    elHours.textContent = pad(h);
    elMins.textContent = pad(m);
    elSecs.textContent = pad(s);
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

// ── LAZY-LOAD VIMEO IFRAME ──
// Skips the placeholder id (VIMEO_ID) so it doesn't 404 — loads only once a real id is set.
(function () {
  const iframes = document.querySelectorAll('iframe.lazy-iframe');
  if (!iframes.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const iframe = entry.target;
      const src = iframe.dataset.src || '';
      if (src && !src.includes('VIMEO_ID')) {
        iframe.src = src;
      }
      observer.unobserve(iframe);
    });
  });
  iframes.forEach((f) => observer.observe(f));
})();

// ── SCROLL REVEAL ──
(function () {
  const solo = [
    '.section-tag', '.section-title', '.why-copy',
    '.hero-sub', '.hero-grid', '.hero-freebie',
    '.what-intro', '.pillar', '.what-footnote',
    '.learn-card', '.feature-card', '.stat-card',
    '.cta-card', '.faq-item', '.footer-inner',
  ].join(', ');

  document.querySelectorAll(solo).forEach((el) => {
    el.classList.add('reveal');
    const parent = el.parentElement;
    const siblings = parent ? [...parent.children].filter(c => c.classList.contains(el.classList[0])) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── FAQ ACCORDION ──
const faqs = [
  { q: 'What exactly is RankOnAI?', a: 'An all-in-one platform that shows you whether AI engines — ChatGPT, Claude, Perplexity, Gemini, Google AI and Copilot — are citing your website, scores how "AI-ready" your pages are out of 100, and rewrites them to get quoted more. It captures traffic from the hundreds of millions of people now asking AI instead of Google. The webinar walks you through the whole thing, live.' },
  { q: 'Is the webinar really free?', a: 'Yes — it\'s a free live training on June 7, 2026 at 10:00 AM EST. Reserve your seat with the form above and you\'re in. On top of the training, 5 lucky attendees will get RankOnAI completely free, announced live on the call.' },
  { q: 'Do I need to be technical?', a: 'Not at all. If you can copy and paste, you can use everything we cover. The audit runs itself, the rewriter gives you ready-to-paste output, and there\'s nothing to code.' },
  { q: 'Will it work with my website?', a: 'Yes — any website. It works across every platform (custom sites, Webflow, Wix, Shopify, static HTML and more), and WordPress users get a dedicated plugin that does most of the work for them.' },
  { q: 'What if I can\'t make it live?', a: 'Register anyway so we can send you reminders — but do try to show up live. The live demo and the 5 free licenses only happen on the call, and the live Q&A is where most attendees get their biggest "aha" moments.' },
];

const faqList = document.getElementById('faq-list');
if (faqList) {
  faqs.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q" aria-expanded="false" onclick="toggleFaq(this)">
        <span>${item.q}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a">${item.a}</div>
    `;
    faqList.appendChild(el);
  });
}

function toggleFaq(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  document.querySelectorAll('.faq-q').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    b.querySelector('.faq-icon').textContent = '+';
    b.nextElementSibling.style.maxHeight = null;
  });
  if (!isOpen) {
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.faq-icon').textContent = '×';
    btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + 'px';
  }
}

// ── STICKY NAV ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── SMOOTH SCROLL (anchor links) ──
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
