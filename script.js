/* ═══════════════════════════════════════════════════════
   CHRISTIAN HARVEY IRENEA — Portfolio JavaScript
   script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initHeroRule();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();
  initContactForm();
  initFooterYear();
});

/* ── STICKY NAV ──────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE MENU ─────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const open = () => {
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const toggle = () => mobileMenu.classList.contains('open') ? close() : open();

  hamburger.addEventListener('click', toggle);
  mobileMenu.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      close();
      hamburger.focus();
    }
  });
}

/* ── HERO RULE ANIMATION ─────────────────────────────── */
function initHeroRule() {
  const rule = document.getElementById('hero-rule');
  if (!rule) return;
  setTimeout(() => rule.classList.add('animate'), 600);
}

/* ── SCROLL ANIMATIONS ───────────────────────────────── */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.rule-line').forEach(el => el.classList.add('animate'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('rule-line')) {
          entry.target.classList.add('animate');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .rule-line').forEach(el => observer.observe(el));
}

/* ── ANIMATED COUNTERS ───────────────────────────────── */
function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-target]').forEach(el => {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
    return;
  }
  const DURATION = 1500;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));
}

/* ── SMOOTH SCROLL ───────────────────────────────────── */
function initSmoothScroll() {
  const NAV_OFFSET = 68;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', href);
    });
  });
}

/* ── CONTACT FORM ────────────────────────────────────── */
function initContactForm() {
  const submitBtn = document.getElementById('form-submit');
  const feedback  = document.getElementById('form-feedback');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', handleSubmit);
  ['fname', 'lname', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubmit(); });
  });

  function getField(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function setFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
  }
  function clearFeedback() {
    if (!feedback) return;
    feedback.textContent = '';
    feedback.className   = 'form-feedback';
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function resetForm() {
    ['fname', 'lname', 'email', 'service', 'message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const sel = document.getElementById('service');
    if (sel) sel.selectedIndex = 0;
  }

  async function handleSubmit() {
    clearFeedback();
    const fname   = getField('fname');
    const email   = getField('email');
    const message = getField('message');

    if (!fname) {
      setFeedback('Please enter your first name.', 'error');
      document.getElementById('fname')?.focus();
      return;
    }
    if (!email || !isValidEmail(email)) {
      setFeedback('Please enter a valid email address.', 'error');
      document.getElementById('email')?.focus();
      return;
    }
    if (!message) {
      setFeedback('Please describe what you need.', 'error');
      document.getElementById('message')?.focus();
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      /*
       * ── INTEGRATION POINT ──────────────────────────
       * Replace the simulated delay below with your
       * real form handler. Example — Formspree:
       *
       * const res = await fetch('https://formspree.io/f/YOUR_ID', {
       *   method: 'POST',
       *   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
       *   body: JSON.stringify({ name: fname, email, message })
       * });
       * if (!res.ok) throw new Error('Network error');
       * ────────────────────────────────────────────── */
      await new Promise(resolve => setTimeout(resolve, 1000));

      submitBtn.textContent      = 'Message Sent ✓';
      submitBtn.style.background = 'var(--green-ok)';
      submitBtn.style.color      = '#fff';
      setFeedback("Thanks! Christian will be in touch within 24 hours.", 'success');
      resetForm();

      setTimeout(() => {
        submitBtn.textContent      = 'Send Message →';
        submitBtn.style.background = '';
        submitBtn.style.color      = '';
        submitBtn.disabled         = false;
        clearFeedback();
      }, 5000);

    } catch (err) {
      console.error('Form error:', err);
      submitBtn.textContent = 'Send Message →';
      submitBtn.disabled    = false;
      setFeedback('Something went wrong. Please email chmirenea@gmail.com directly.', 'error');
    }
  }
}

/* ── FOOTER YEAR ─────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
