// WPilot AI — Legal Pages · Shared Script

(function () {
  // ── Current year in footer ──
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // ── Active section highlighting in the TOC ──
  const tocLinks = [...document.querySelectorAll('.toc-links a')];
  const sections = tocLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sections.length) {
    const byId = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    let current = null;

    const setActive = (id) => {
      if (id === current) return;
      current = id;
      tocLinks.forEach(a => a.classList.remove('active'));
      const link = byId.get(id);
      if (link) {
        link.classList.add('active');
        // keep the active item in view within a scrollable (mobile) TOC
        link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      // pick the entry nearest the top that is intersecting
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) {
        setActive(visible[0].target.id);
      }
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));

    // Fallback: set the first as active on load
    setActive(sections[0].id);
  }

  // ── Smooth-scroll anchor clicks (accounts for the sticky header) ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // ── Back-to-top button ──
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const onScroll = () => toTop.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();
