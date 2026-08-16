/* ============================================================
   WEBSIGHT — main.js
   GSAP 3 + ScrollTrigger animations & interactivity
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   NAV — scroll-aware background
   ============================================================ */
const nav = document.getElementById('nav');
if (nav) {
  ScrollTrigger.create({
    start: 'top -60',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
}

/* Active nav link on scroll (in-page sections only) */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
if (sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => navObserver.observe(s));
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   SMOOTH SCROLL (in-page anchors)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   HERO ANIMATIONS
   ============================================================ */
if (document.querySelector('.hero')) {
  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.hero-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
      .fromTo('.hero-line-inner', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.12 }, 0.4)
      .fromTo('.hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75 }, 0.9)
      .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1)
      .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.6);
  } else {
    gsap.set(['.hero-tag', '.hero-line-inner', '.hero-sub', '.hero-actions', '.hero-scroll'],
      { opacity: 1, y: 0, yPercent: 0 });
  }
}

/* ============================================================
   SCROLL REVEALS (generic)
   ============================================================ */
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) { gsap.set(el, { opacity: 1 }); return; }
      const fromX = el.classList.contains('reveal-left') ? -40 : el.classList.contains('reveal-right') ? 40 : 0;
      const fromY = el.classList.contains('reveal-up') ? 36 : 0;
      gsap.fromTo(el,
        { opacity: 0, y: fromY, x: fromX },
        { opacity: 1, y: 0, x: 0, duration: 0.8, ease: 'power3.out' }
      );
    },
  });
});

/* ============================================================
   STAGGERED GRID REVEALS
   ============================================================ */
function staggerReveal(triggerSelector, itemSelector, opts = {}) {
  const trigger = document.querySelector(triggerSelector);
  if (!trigger) return;
  ScrollTrigger.create({
    trigger: triggerSelector,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) return;
      gsap.fromTo(itemSelector,
        { opacity: 0, y: opts.y ?? 40 },
        { opacity: 1, y: 0, duration: opts.duration ?? 0.75, stagger: opts.stagger ?? 0.1, ease: 'power3.out' }
      );
    },
  });
}
staggerReveal('.work-grid', '.work-card', { stagger: 0.08 });
staggerReveal('.process-grid', '.process-card', { stagger: 0.08 });

/* ============================================================
   STAT COUNTERS
   ============================================================ */
document.querySelectorAll('.stat-number').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (Number.isNaN(target)) return;
  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (prefersReducedMotion) { el.textContent = target; return; }
      gsap.fromTo({ val: 0 }, { val: 0 }, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString(); },
      });
    },
  });
});

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.16, y: y * 0.16, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ============================================================
   FORM VALIDATION / SUCCESS STATE
   No backend wired yet — the form shows a success state locally
   until a real submission endpoint (e.g. Formspree, EmailJS) is
   configured.
   ============================================================ */
function shakeField(el) {
  if (!el) return;
  if (prefersReducedMotion) { el.focus(); return; }
  gsap.fromTo(el, { x: 0 }, {
    x: 9, duration: 0.07, repeat: 5, yoyo: true, ease: 'power2.inOut',
    onComplete: () => { gsap.set(el, { x: 0 }); el.focus(); },
  });
  el.style.borderColor = '#ff6b6b';
}

function wireForm(formId, successId, requiredIds) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;
    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(`${id}-error`);
      if (!el) return;
      const bad = !el.value.trim();
      el.toggleAttribute('aria-invalid', bad);
      if (errEl) errEl.textContent = bad ? 'This field is required.' : '';
      if (bad && !firstBad) firstBad = el;
      if (!bad) el.style.borderColor = '';
    });
    if (firstBad) { shakeField(firstBad); return; }

    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Sending…';
    }
    setTimeout(() => {
      form.style.display = 'none';
      if (success) {
        success.classList.remove('hidden');
        if (!prefersReducedMotion) {
          gsap.fromTo(success, { opacity: 0, y: 10, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
        }
      }
    }, 700);
  });

  requiredIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      el.style.borderColor = '';
      el.removeAttribute('aria-invalid');
      const errEl = document.getElementById(`${id}-error`);
      if (errEl) errEl.textContent = '';
    });
  });
}

wireForm('contact-form', 'form-success', ['ct-name', 'ct-email']);
