/* =========================================================
   Frutiger Aero animations
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* Hook nav anchors into Lenis */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -40, duration: 1.6 });
  });
});

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor__dot');
const cursorRing = document.querySelector('.cursor__ring');

const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (cursor && !prefersReducedMotion && !isTouchDevice) {
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  // Position initially so it doesn't flash in the corner
  gsap.set(cursorDot, { x: mouseX, y: mouseY });
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

  const setDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.1, ease: 'power2.out' });
  const setDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.1, ease: 'power2.out' });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursor.classList.contains('is-ready')) {
      cursor.classList.add('is-ready');
      document.body.classList.add('cursor-ready');
    }
    setDotX(mouseX);
    setDotY(mouseY);
  }, { passive: true });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll('a, button, [data-magnetic], [data-tilt]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

/* ---------- Magnetic buttons ---------- */
if (!prefersReducedMotion && !isTouchDevice) {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    const setX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const setY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      setX((e.clientX - rect.left - rect.width / 2) * strength);
      setY((e.clientY - rect.top - rect.height / 2) * strength);
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- 3D tilt only on project cards ---------- */
if (!prefersReducedMotion && !isTouchDevice) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = 5;
    const setRY = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power2.out' });
    const setRX = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power2.out' });
    gsap.set(el, { transformPerspective: 1000 });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setRY(x * max);
      setRX(-y * max);
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- Reveal animations ---------- */

// Standard fade-up reveals
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });
});

// Text mask reveals — wrap children, slide them up from behind a mask
gsap.utils.toArray('[data-reveal-text]').forEach((el) => {
  // Wrap content in a span so we can transform it
  const inner = document.createElement('span');
  inner.style.display = 'inline-block';
  inner.style.willChange = 'transform';
  while (el.firstChild) inner.appendChild(el.firstChild);
  el.appendChild(inner);

  gsap.set(inner, { y: '110%' });

  gsap.to(inner, {
    y: '0%',
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 90%',
      toggleActions: 'play none none none'
    }
  });
});

/* ---------- Hero parallax ---------- */
const orb = document.querySelector('.orb');
const heroTitle = document.querySelector('.hero__title');

if (!prefersReducedMotion && !isTouchDevice && (orb || heroTitle)) {
  const orbX = orb ? gsap.quickTo(orb, 'x', { duration: 1.2, ease: 'power2.out' }) : null;
  const orbY = orb ? gsap.quickTo(orb, 'y', { duration: 1.2, ease: 'power2.out' }) : null;
  const titleX = heroTitle ? gsap.quickTo(heroTitle, 'x', { duration: 1.5, ease: 'power2.out' }) : null;
  const titleY = heroTitle ? gsap.quickTo(heroTitle, 'y', { duration: 1.5, ease: 'power2.out' }) : null;
  const hero = document.querySelector('.hero');
  let heroInView = true;
  if (hero) {
    new IntersectionObserver(([e]) => { heroInView = e.isIntersecting; })
      .observe(hero);
  }
  window.addEventListener('mousemove', (e) => {
    if (!heroInView) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    if (orbX)   { orbX(x * 30); orbY(y * 20); }
    if (titleX) { titleX(x * -8); titleY(y * -4); }
  }, { passive: true });
}

/* ---------- Hide cursor when offscreen ---------- */
document.addEventListener('mouseleave', () => cursor && (cursor.style.opacity = '0'));
document.addEventListener('mouseenter', () => cursor && (cursor.style.opacity = '1'));

/* ---------- Refresh ScrollTrigger after fonts load ---------- */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
