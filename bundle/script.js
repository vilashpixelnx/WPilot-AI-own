// WPilot AI — Bundle Deal Page

// ── STICKY TOP BAR ──
(function () {
  var topBar = document.querySelector('.top-bar');
  if (!topBar) return;

  var placeholder = document.createElement('div');
  placeholder.className = 'top-bar-placeholder';
  topBar.parentNode.insertBefore(placeholder, topBar);

  var heroEl = document.querySelector('.hero');
  var stickAt = 100;
  function computeThreshold() {
    if (heroEl) stickAt = heroEl.getBoundingClientRect().bottom + window.scrollY;
  }
  computeThreshold();
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(computeThreshold, 150);
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isSticky = false;
  var ticking = false;
  var hideTimer = null;

  function makeSticky() {
    if (isSticky) return;
    isSticky = true;
    clearTimeout(hideTimer);
    placeholder.style.height = topBar.offsetHeight + 'px';
    topBar.classList.add('tb-no-anim');
    topBar.classList.add('tb-fixed');
    void topBar.offsetHeight;
    topBar.classList.remove('tb-no-anim');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        topBar.classList.add('tb-visible');
      });
    });
  }

  function removeSticky() {
    if (!isSticky) return;
    isSticky = false;
    topBar.classList.remove('tb-visible');
    var duration = reduceMotion ? 0 : 380;
    hideTimer = setTimeout(function () {
      topBar.classList.remove('tb-fixed');
      placeholder.style.height = '0px';
    }, duration);
  }

  function onScroll() {
    if (window.scrollY > stickAt) {
      makeSticky();
    } else {
      removeSticky();
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
})();

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
