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

// ── REGISTRATION FORM (pixelnx.com lead-sync → GetResponse + GoToWebinar) ──
// POSTs first_name/last_name/email + autoresponder_id/webinar_id to the PixelNX
// form handler, then redirects to the thank-you page. No access token needed.
(function () {
  const FORM_ENDPOINT = 'https://pixelnx.com/form-handler';
  const THANKYOU_URL = 'https://wpilot-sales.pixalab.ai/webinar-thankyou/';

  const form = document.getElementById('registerForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  const firstInput = document.getElementById('regFirstName');
  const lastInput = document.getElementById('regLastName');
  const emailInput = document.getElementById('regEmail');
  const firstError = document.getElementById('firstNameError');
  const lastError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailError');
  const submitError = document.getElementById('submitError');
  const submitBtn = form.querySelector('.form-submit');
  const submitBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, errorEl, message) {
    if (message) {
      input.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      input.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const first = firstInput.value.trim();
    const last = lastInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    if (first.length < 2) {
      setError(firstInput, firstError, 'Please enter your first name.');
      valid = false;
    } else {
      setError(firstInput, firstError, '');
    }

    if (last.length < 2) {
      setError(lastInput, lastError, 'Please enter your last name.');
      valid = false;
    } else {
      setError(lastInput, lastError, '');
    }

    if (!EMAIL_RE.test(email)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (!valid) return;

    submitError.textContent = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Submitting…';
    }

    try {
      const jsonData = JSON.stringify(Object.fromEntries(new FormData(form)));
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      });
      const res = await response.json();

      if (res.status === true) {
        form.style.display = 'none';
        success.classList.add('show');
        setTimeout(() => { window.location.href = THANKYOU_URL; }, 1500);
      } else {
        submitError.textContent = res.msg || 'Submission failed. Please try again.';
      }
    } catch (error) {
      console.error('Lead-sync error:', error);
      submitError.textContent = 'Network error. Please try again.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtnHTML;
      }
    }
  });

  [firstInput, lastInput, emailInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errorEl = input === firstInput ? firstError : input === lastInput ? lastError : emailError;
      errorEl.textContent = '';
    });
  });
})();
