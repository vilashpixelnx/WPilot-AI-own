// WPilot AI — Prelaunch Webinar Page Script

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

// ── REGISTRATION FORM ──
(function () {
  const form = document.getElementById('registerForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  const nameInput = document.getElementById('regName');
  const emailInput = document.getElementById('regEmail');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    let valid = true;

    if (name.length < 2) {
      setError(nameInput, nameError, 'Please enter your full name.');
      valid = false;
    } else {
      setError(nameInput, nameError, '');
    }

    if (!EMAIL_RE.test(email)) {
      setError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      setError(emailInput, emailError, '');
    }

    if (!valid) return;

    form.style.display = 'none';
    success.classList.add('show');
  });

  [nameInput, emailInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errorEl = input === nameInput ? nameError : emailError;
      errorEl.textContent = '';
    });
  });
})();
