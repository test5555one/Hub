// script.js — interactivity, animations and contact handling
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const year = document.getElementById('year');
  const header = document.getElementById('site-header');
  year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  toggle?.addEventListener('click', () => {
    const shown = nav.style.display === 'block';
    nav.style.display = shown ? 'none' : 'block';
    toggle.setAttribute('aria-expanded', String(!shown));
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
        if (window.innerWidth <= 640) nav.style.display = 'none';
      }
    });
  });

  // IntersectionObserver for reveal animations
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // once visible, unobserve to improve perf
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

  // Tilt effect on project cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      const rx = (y - 0.5) * 8; // rotateX
      const ry = (x - 0.5) * -12; // rotateY
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Parallax small effect for hero on mouse move
  const hero = document.querySelector('.hero');
  const blobs = document.querySelectorAll('.blob');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      blobs.forEach((b, i) => {
        const t = (i + 1) * 6;
        b.style.transform = `translate3d(${cx * t}px, ${cy * t}px, 0) rotate(${i % 2 ? 6 : -6}deg)`;
      });
    });
  }

  // Contact form: open mailto as fallback and show nicer status
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const resetBtn = document.getElementById('reset-btn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) {
      status.textContent = 'Bitte fülle alle Felder aus.';
      status.style.color = 'crimson';
      return;
    }

    // Try to send via mailto (fallback). You can replace with real endpoint later.
    const subject = encodeURIComponent(`Kontakt von ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
    const mailto = `mailto:deine-email@beispiel.de?subject=${subject}&body=${body}`;

    // Small UX: show sending state then redirect to mailto
    status.textContent = 'Sende Nachricht...';
    status.style.color = 'var(--primary-600)';
    setTimeout(() => {
      window.location.href = mailto;
      status.textContent = 'Dein Mailprogramm sollte sich geöffnet haben.';
    }, 700);

    form.reset();
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    status.textContent = '';
  });

  // Optional: shrink header on scroll
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    lastScroll = y;
  });
});
