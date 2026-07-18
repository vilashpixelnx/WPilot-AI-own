/* =====================================================================
   WPilot AI — Landing Page Scripts
   ---------------------------------------------------------------------
   - Scroll-triggered reveal animations (GSAP + ScrollTrigger)
   - Count-up number animations
   - 3D tilt on plugin cards
   - Flash-sale countdown timer
   - Sticky-on-scroll top bar
   - Social proof popup dismissal
   - Graceful fallback if GSAP fails to load
   ===================================================================== */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  var hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';

  /* --- Sticky top bar --------------------------------------------------
     Stays in normal flow until the user has scrolled past the full height
     of the hero/banner section. Then it's switched to position:fixed
     while still translated fully off-screen
     (transform: translateY(-100%)) in the SAME tick that a placeholder
     takes over its height — so nothing below it jumps — and only on the
     next animation frame do we add .tb-visible, which slides it down via
     a CSS transition. Reversing does the same in reverse: the slide-up
     transition plays first, and only once it's finished do we drop
     position:fixed and collapse the placeholder back to 0.
  ---------------------------------------------------------------------- */
  (function initStickyTopBar() {
    var topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    var placeholder = document.createElement('div');
    placeholder.className = 'top-bar-placeholder';
    topBar.parentNode.insertBefore(placeholder, topBar);

    // Sticky only kicks in once the hero/banner has been fully scrolled past —
    // recomputed on resize since the hero's height is responsive.
    var heroEl = document.querySelector('.hero');
    var stickAt = 100; // fallback if there's no .hero on the page
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
      // .tb-no-anim disables the transition so the jump from "normal flow"
      // to "fixed + translated off-screen" is instant — without it, that
      // jump itself would animate (fighting the slide-down we add next).
      topBar.classList.add('tb-no-anim');
      topBar.classList.add('tb-fixed');
      void topBar.offsetHeight; // force the browser to commit + paint that frame
      topBar.classList.remove('tb-no-anim');
      // Double rAF: the first guarantees the "no-anim, off-screen" frame has
      // actually painted before we re-enable the transition and trigger the
      // slide-down on the frame after — a single rAF can still land before
      // that paint and skip the animation.
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

  /* --- Flash-sale countdown ------------------------------------------
     Ticking loop for the top-bar countdown (#cd-hours/#cd-mins/#cd-secs).
     No localStorage — the deadline is a globally-synced repeating cycle computed
     purely from Date.now(), so every visitor sees the same countdown at the same
     real-world moment, and it resets automatically every CYCLE_MS forever.
     NOTE: index.html has a small inline script right after the .tb-countdown
     markup that sets the initial values on first paint (this file loads with
     `defer` + waits on the GSAP CDN, so without it the placeholders would
     flash on refresh). That inline script runs once; this one keeps ticking
     every second. Keep CYCLE_MS and ANCHOR_UTC identical in both.
  ---------------------------------------------------------------------- */
  (function initCountdown() {
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-mins');
    var sEl = document.getElementById('cd-secs');
    if (!hEl) return;

    var CYCLE_MS = 4 * 60 * 60 * 1000; // 4-hour repeating cycle
    var ANCHOR_UTC = 15 * 3600 * 1000; // phase anchor (15:00 UTC)

    var pad = function (n) { return String(n).padStart(2, '0'); };

    var tick = function () {
      var now = Date.now();
      var elapsed = ((now - ANCHOR_UTC) % CYCLE_MS + CYCLE_MS) % CYCLE_MS;
      var diff = CYCLE_MS - elapsed;
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      hEl.textContent = pad(h);
      mEl.textContent = pad(m);
      sEl.textContent = pad(s);
    };

    tick();
    function runTimer() {
      tick();
      setTimeout(runTimer, 1000);
    }
    runTimer();
  })();

  /* --- Social proof popup: rotating worldwide purchase notifications --
     customerData -> shuffle-bag history -> weighted time -> render/show
  ---------------------------------------------------------------------- */
  (function initSocialProof() {
    var root = document.getElementById('socialProof');
    if (!root) return;

    var nameEl = root.querySelector('.spp-name');
    var locEl = root.querySelector('.spp-loc');
    var timeEl = root.querySelector('.spp-time');
    var closeBtn = root.querySelector('.spp-close');
    if (!nameEl || !locEl || !timeEl) return;

    /* ---- customerData: worldwide name/city pools, built once ------- */
    var COUNTRY_POOLS = [
      { country: 'USA', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Austin'], names: ['Michael', 'Jennifer', 'James', 'Ashley', 'Robert', 'Jessica', 'John', 'Amanda', 'David', 'Sarah', 'Christopher', 'Emily', 'Matthew', 'Megan', 'Daniel', 'Brittany'] },
      { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'], names: ['Noah', 'Olivia', 'Liam', 'Emma', 'Ethan', 'Sophia', 'Jacob', 'Ava', 'Lucas', 'Mia', 'Benjamin', 'Chloe'] },
      { country: 'UK', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Glasgow'], names: ['Oliver', 'Emma', 'George', 'Amelia', 'Harry', 'Isla', 'Jack', 'Ava', 'Charlie', 'Grace', 'Jacob', 'Freya'] },
      { country: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'], names: ['Lukas', 'Anna', 'Leon', 'Mia', 'Finn', 'Emma', 'Paul', 'Sophie', 'Felix', 'Laura', 'Jonas', 'Lena'] },
      { country: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse'], names: ['Lucas', 'Emma', 'Louis', 'Chloe', 'Hugo', 'Manon', 'Gabriel', 'Camille', 'Nathan', 'Lea', 'Adam', 'Ines'] },
      { country: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'], names: ['Hugo', 'Sofia', 'Martin', 'Lucia', 'Mateo', 'Martina', 'Leo', 'Paula', 'Daniel', 'Valeria', 'Alvaro', 'Julia'] },
      { country: 'Italy', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'], names: ['Leonardo', 'Giulia', 'Francesco', 'Sofia', 'Alessandro', 'Aurora', 'Lorenzo', 'Alice', 'Mattia', 'Ginevra', 'Andrea', 'Emma'] },
      { country: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague'], names: ['Daan', 'Emma', 'Sem', 'Julia', 'Lucas', 'Tess', 'Levi', 'Sara', 'Finn', 'Zoe'] },
      { country: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmo'], names: ['William', 'Alice', 'Liam', 'Maja', 'Noah', 'Elsa', 'Oscar', 'Wilma', 'Hugo', 'Alma'] },
      { country: 'Norway', cities: ['Oslo', 'Bergen', 'Trondheim'], names: ['Jakob', 'Emma', 'Noah', 'Sofie', 'Oliver', 'Nora', 'William', 'Ella', 'Filip', 'Maja'] },
      { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'], names: ['Oliver', 'Charlotte', 'William', 'Olivia', 'Jack', 'Ava', 'Noah', 'Mia', 'Thomas', 'Amelia', 'Lucas', 'Isla'] },
      { country: 'New Zealand', cities: ['Auckland', 'Wellington', 'Christchurch'], names: ['Oliver', 'Isla', 'Jack', 'Charlotte', 'James', 'Amelia', 'William', 'Mia', 'Lucas', 'Ruby'] },
      { country: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'], names: ['Priya', 'Rahul', 'Ananya', 'Vikram', 'Neha', 'Arjun', 'Divya', 'Karan', 'Sneha', 'Aditya', 'Pooja', 'Rohan'] },
      { country: 'Singapore', cities: ['Singapore'], names: ['Wei Jie', 'Hui Ying', 'Jun Kai', 'Mei Ling', 'Zhi Hao', 'Xin Yi', 'Kai Xuan', 'Li Wen'] },
      { country: 'Malaysia', cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru'], names: ['Amir', 'Siti', 'Farid', 'Nurul', 'Hafiz', 'Aisyah', 'Zul', 'Aina'] },
      { country: 'UAE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'], names: ['Ahmed', 'Fatima', 'Omar', 'Mariam', 'Khalid', 'Layla', 'Saeed', 'Noor'] },
      { country: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Mecca'], names: ['Abdullah', 'Noura', 'Faisal', 'Sara', 'Yousef', 'Reem', 'Turki', 'Lama'] },
      { country: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'], names: ['Sipho', 'Thandiwe', 'Johan', 'Zanele', 'Lerato', 'Pieter', 'Naledi', 'Kabelo'] },
      { country: 'Brazil', cities: ['Sao Paulo', 'Rio de Janeiro', 'Brasilia', 'Curitiba'], names: ['Lucas', 'Maria', 'Pedro', 'Ana', 'Gabriel', 'Julia', 'Matheus', 'Beatriz', 'Rafael', 'Camila'] },
      { country: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey'], names: ['Santiago', 'Valentina', 'Mateo', 'Camila', 'Diego', 'Sofia', 'Alejandro', 'Ximena', 'Emiliano', 'Regina'] },
      { country: 'Japan', cities: ['Tokyo', 'Osaka', 'Yokohama', 'Kyoto'], names: ['Haruto', 'Yui', 'Sota', 'Aoi', 'Ren', 'Hina', 'Yuto', 'Rin', 'Sora', 'Yuna'] },
      { country: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon'], names: ['Min-jun', 'Seo-yeon', 'Ji-ho', 'Ha-eun', 'Jun-seo', 'Ji-woo', 'Do-yun', 'Soo-ah'] },
      { country: 'Thailand', cities: ['Bangkok', 'Chiang Mai', 'Phuket'], names: ['Somchai', 'Suda', 'Anucha', 'Ratana', 'Kiet', 'Malee', 'Nattapong', 'Kanya'] },
      { country: 'Vietnam', cities: ['Hanoi', 'Ho Chi Minh City', 'Da Nang'], names: ['Minh', 'Linh', 'Hieu', 'Huong', 'Duc', 'Mai', 'Tuan', 'Thao'] },
      { country: 'Indonesia', cities: ['Jakarta', 'Surabaya', 'Bandung'], names: ['Budi', 'Siti', 'Agus', 'Dewi', 'Andi', 'Putri', 'Eko', 'Rina'] },
      { country: 'Philippines', cities: ['Manila', 'Cebu', 'Davao'], names: ['Juan', 'Maria', 'Jose', 'Angelica', 'Mark', 'Kristine', 'Paolo', 'Bea'] },
      { country: 'Turkey', cities: ['Istanbul', 'Ankara', 'Izmir'], names: ['Mehmet', 'Elif', 'Ahmet', 'Zeynep', 'Emre', 'Ayse', 'Can', 'Deniz'] },
      { country: 'Poland', cities: ['Warsaw', 'Krakow', 'Wroclaw'], names: ['Jakub', 'Julia', 'Szymon', 'Zuzanna', 'Filip', 'Maja', 'Antoni', 'Zofia'] },
      { country: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel'], names: ['Noah', 'Mia', 'Liam', 'Emma', 'Luca', 'Lea', 'Elias', 'Sina'] },
      { country: 'Ireland', cities: ['Dublin', 'Cork', 'Galway'], names: ['Conor', 'Aoife', 'Sean', 'Saoirse', 'Cian', 'Niamh', 'Darragh', 'Ciara'] }
    ];
    var LAST_INITIALS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W'];

    function buildCustomerData() {
      var list = [];
      COUNTRY_POOLS.forEach(function (pool) {
        pool.names.forEach(function (name) {
          pool.cities.forEach(function (city) {
            list.push({
              name: name,
              city: city,
              country: pool.country,
              lastInitial: LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)]
            });
          });
        });
      });
      return list;
    }

    var customerData = buildCustomerData(); // loaded once — 1000+ entries, no API calls

    /* ---- history tracking: shuffle-bag so nothing repeats until the
       dataset is (almost) exhausted, and never consecutively -------- */
    var bag = [];
    var lastShown = null;

    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }

    function refillBag() {
      bag = shuffle(customerData);
      if (lastShown && bag.length > 1 && bag[0] === lastShown) {
        var swapIdx = 1 + Math.floor(Math.random() * (bag.length - 1));
        var tmp = bag[0]; bag[0] = bag[swapIdx]; bag[swapIdx] = tmp;
      }
    }

    function nextCustomer() {
      if (bag.length === 0) refillBag();
      var customer = bag.pop();
      lastShown = customer;
      return customer;
    }

    /* ---- random selection: weighted "time ago" so recent purchases
       show up far more often than older ones ------------------------ */
    var TIME_BUCKETS = [
      { label: 'Just now', weight: 10 },
      { label: '1 minute ago', weight: 9 },
      { label: '2 minutes ago', weight: 9 },
      { label: '5 minutes ago', weight: 8 },
      { label: '8 minutes ago', weight: 7 },
      { label: '12 minutes ago', weight: 6 },
      { label: '17 minutes ago', weight: 5 },
      { label: '23 minutes ago', weight: 4 },
      { label: '34 minutes ago', weight: 3 },
      { label: '46 minutes ago', weight: 2 },
      { label: '1 hour ago', weight: 2 },
      { label: '2 hours ago', weight: 1 }
    ];
    var TIME_TOTAL_WEIGHT = TIME_BUCKETS.reduce(function (sum, b) { return sum + b.weight; }, 0);

    function randomTimeAgo() {
      var r = Math.random() * TIME_TOTAL_WEIGHT;
      for (var i = 0; i < TIME_BUCKETS.length; i++) {
        r -= TIME_BUCKETS[i].weight;
        if (r <= 0) return TIME_BUCKETS[i].label;
      }
      return TIME_BUCKETS[TIME_BUCKETS.length - 1].label;
    }

    /* ---- timer generation: random delay in a range, in ms ---------- */
    function randomDelayMs(minSec, maxSec) {
      return (minSec + Math.random() * (maxSec - minSec)) * 1000;
    }

    var VISIBLE_MS = 6000; // how long a notification stays on screen
    var dismissed = false;
    var pendingTimers = [];

    function clearPendingTimers() {
      pendingTimers.forEach(function (t) { clearTimeout(t); });
      pendingTimers = [];
    }

    /* ---- popup rendering: update text only, never rebuild the DOM -- */
    function render(customer) {
      nameEl.textContent = customer.name + ' ' + customer.lastInitial + '.';
      locEl.textContent = customer.city + ', ' + customer.country;
      timeEl.textContent = '⏰ ' + randomTimeAgo();
    }

    function showPopup() {
      if (dismissed) return;
      render(nextCustomer());
      root.classList.add('is-visible');
      pendingTimers.push(setTimeout(hidePopup, VISIBLE_MS));
    }

    function hidePopup() {
      if (dismissed) return;
      root.classList.remove('is-visible');
      scheduleNext();
    }

    function scheduleNext(delayMs) {
      if (dismissed) return;
      var delay = delayMs != null ? delayMs : randomDelayMs(60, 180);
      pendingTimers.push(setTimeout(showPopup, delay));
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dismissed = true;
        clearPendingTimers();
        root.classList.remove('is-visible');
      });
    }

    scheduleNext(2000); // first appearance ~2s after load
  })();

  /* --- Exit-intent offer popup -----------------------------------------
     Desktop only (pointer: fine) — shows once per browser tab session,
     triggered by whichever of these happens first:
       1) the classic exit-intent signal: the mouse leaving the top of the
          viewport toward the browser's tab bar / close button (armed after
          a short delay so a stray cursor flick right after load can't
          trigger it before the visitor has actually read anything), or
       2) a flat 20-second fallback timer, so visitors who never trigger
          exit-intent (e.g. they never move the mouse near the top) still
          see the offer.
     Both share the same "shown" guard, so only the first one to fire
     actually opens it.
  ---------------------------------------------------------------------- */
  (function initExitPopup() {
    var overlay = document.getElementById('exitPopupOverlay');
    if (!overlay) return;
    if (!window.matchMedia('(pointer: fine)').matches) return; // no hover/mouse-leave on touch devices

    var closeBtn = document.getElementById('exitPopupClose');
    var STORAGE_KEY = 'wpilot_exit_popup_shown';
    var shown = false;
    var armed = false;

    try {
      if (sessionStorage.getItem(STORAGE_KEY)) shown = true;
    } catch (_) {}

    function openPopup() {
      if (shown) return;
      shown = true;
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
    }

    function closePopup() {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }

    document.documentElement.addEventListener('mouseleave', function (e) {
      if (armed && !shown && e.clientY <= 0) openPopup();
    });

    setTimeout(function () { armed = true; }, 3000);
    setTimeout(function () { if (!shown) openPopup(); }, 20000); // 20s fallback trigger

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-visible')) closePopup();
    });
  })();

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
