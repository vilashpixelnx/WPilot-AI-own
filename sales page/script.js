/* =====================================================================
   WPilot AI — Landing Page Scripts
   ---------------------------------------------------------------------
   - Scroll-triggered reveal animations (GSAP + ScrollTrigger)
   - Count-up number animations
   - 3D tilt on plugin cards
   - Flash-sale countdown timer
   - Social proof popup dismissal
   - Graceful fallback if GSAP fails to load
   ===================================================================== */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';

  /* --- Reveal animations --------------------------------------------- */
  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero reveals play immediately on load
    gsap.to('.hero .reveal', {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.15
    });

    // Every other section reveals on scroll
    document.querySelectorAll('section').forEach(function (section) {
      if (section.classList.contains('hero')) return;
      var reveals = section.querySelectorAll('.reveal');
      if (!reveals.length) return;
      gsap.to(reveals, {
        scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none none' },
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out'
      });
    });
  }

  /* --- Count-up numbers ---------------------------------------------- */
  var easeOutQuart = function (t) { return 1 - Math.pow(1 - t, 4); };

  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    var duration = 1800;
    var start = performance.now();
    var step = function (now) {
      var p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * easeOutQuart(p)).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  document.querySelectorAll('.count-up').forEach(function (el) {
    var hasAnimated = false;
    var run = function () {
      if (hasAnimated) return;
      hasAnimated = true;
      animateCount(el);
    };
    if (hasScrollTrigger) {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', onEnter: run });
    } else {
      run();
    }
  });

  /* --- 3D tilt on plugin cards --------------------------------------- */
  if (hasGSAP && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.plugin-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
        var rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
        gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
      });
      card.addEventListener('mouseleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
      });
    });
  }

  /* --- Flash-sale countdown ------------------------------------------ */
  (function initCountdown() {
    var dEl = document.getElementById('cd-days');
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-mins');
    var sEl = document.getElementById('cd-secs');
    if (!dEl) return;

    var base = (2 * 24 * 60 * 60) + (14 * 60 * 60) + (36 * 60);
    var totalSec = base + 48; // 2d 14h 36m 48s from page load
    var pad = function (n) { return String(n).padStart(2, '0'); };

    function tick() {
      if (totalSec <= 0) totalSec = base; // roll over so it never hits zero
      dEl.textContent = pad(Math.floor(totalSec / 86400));
      hEl.textContent = pad(Math.floor((totalSec % 86400) / 3600));
      mEl.textContent = pad(Math.floor((totalSec % 3600) / 60));
      sEl.textContent = pad(totalSec % 60);
      totalSec--;
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* --- Social proof popup dismissal ---------------------------------- */
  var socialProof = document.getElementById('socialProof');
  if (socialProof) {
    var closeBtn = socialProof.querySelector('.spp-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { socialProof.style.display = 'none'; });
    }
  }

  /* --- Fallback: force reveals visible if GSAP failed ---------------- */
  window.setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (parseFloat(getComputedStyle(el).opacity) === 0) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }, 3500);
})();
