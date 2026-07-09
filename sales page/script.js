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
