document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav (burger) ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('navOverlay');

  function openNav() {
    nav.classList.add('open');
    overlay.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger && nav && overlay) {
    burger.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
    overlay.addEventListener('click', closeNav);
    nav.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', closeNav);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 960) closeNav();
    });
  }

  /* ---------- Carousel dots (reviews + videos) ---------- */
  function setupCarouselDots(trackId, dotsId, label) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;

    const cards = Array.from(track.children);

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `${label} ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = cards.indexOf(entry.target);
          dots.forEach(d => d.classList.remove('active'));
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    }, { root: track, threshold: 0.6 });

    cards.forEach(card => observer.observe(card));
  }

  setupCarouselDots('reviewsTrack', 'reviewsDots', 'Отзыв');
  setupCarouselDots('videosTrack', 'videosDots', 'Видео');

  /* ---------- Pause other videos when one starts playing ---------- */
  const videos = document.querySelectorAll('#videosTrack video');
  videos.forEach(v => {
    v.addEventListener('play', () => {
      videos.forEach(other => { if (other !== v) other.pause(); });
    });
  });

  /* ---------- Program details modal ---------- */
  const WHATSAPP_NUMBER = '996557784477';
  const modalOverlay = document.getElementById('programModalOverlay');
  const modalClose = document.getElementById('programModalClose');
  const modalIcon = document.getElementById('programModalIcon');
  const modalTitle = document.getElementById('programModalTitle');
  const modalMeta = document.getElementById('programModalMeta');
  const modalBody = document.getElementById('programModalBody');
  const modalCta = document.getElementById('programModalCta');

  let lastModalTrigger = null;

  function openProgramModal(card, trigger) {
    if (!modalOverlay) return;

    const title = card.querySelector('h3')?.textContent.trim() || '';
    const icon = card.querySelector('.program-icon')?.textContent.trim() || '';
    const age = card.querySelector('.program-age')?.textContent.trim() || '';
    const metaItems = Array.from(card.querySelectorAll('.program-meta li')).map(li => li.textContent.trim());
    const metaText = [age, ...metaItems].filter(Boolean).join(' · ');
    const descTemplate = card.querySelector('template.program-desc');

    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMeta.textContent = metaText;

    modalBody.innerHTML = '';
    if (descTemplate) {
      modalBody.appendChild(descTemplate.content.cloneNode(true));
    }

    const message = `Здравствуйте! Можно получить консультацию по «${title}»?`;
    modalCta.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    lastModalTrigger = trigger || null;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeProgramModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (lastModalTrigger) lastModalTrigger.focus();
  }

  document.querySelectorAll('.program-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.program-card');
      if (card) openProgramModal(card, btn);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProgramModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProgramModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeProgramModal();
    }
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Close mobile nav when a hash link is clicked (in case of same-section) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (nav && nav.classList.contains('open')) closeNav();
    });
  });

});
