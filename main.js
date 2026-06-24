/* =========================================================
   Frutiger Aero × Game-menu SPA
   ========================================================= */

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor__dot');
const cursorRing = document.querySelector('.cursor__ring');

if (cursor && !prefersReducedMotion && !isTouchDevice) {
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

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

  const attachHover = (root = document) => {
    root.querySelectorAll('a, button, [data-magnetic], [data-tilt], .menu__item').forEach((el) => {
      if (el.dataset._cursorHover) return;
      el.dataset._cursorHover = '1';
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  };
  attachHover();

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
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

/* ---------- 3D tilt on project / player cards ---------- */
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

/* =========================================================
   Scene manager
   ========================================================= */

const sceneEls = Array.from(document.querySelectorAll('[data-scene]'));
const scenes = Object.fromEntries(sceneEls.map(el => [el.dataset.scene, el]));
const sceneOrder = ['home', 'about', 'skills', 'work', 'contact'];

let activeScene = 'home';
let sceneAnimating = false;

function revealScene(sceneEl) {
  const name = sceneEl.dataset.scene;
  const q = (sel) => Array.from(sceneEl.querySelectorAll(sel));
  let targets = [];

  if (name === 'home') {
    targets = [
      ...q('.home__chip'),
      ...q('.home__title .line'),
      ...q('.home__sub'),
      ...q('.menu__item'),
      ...q('.home__playercard'),
    ];
  } else if (name === 'about') {
    targets = [
      ...q('.scene-back'),
      ...q('.scene-head .eyebrow'),
      ...q('.scene-head .section-title'),
      ...q('.about__body p'),
      ...q('.about__stats li'),
    ];
  } else if (name === 'skills') {
    targets = [
      ...q('.scene-back'),
      ...q('.scene-head .eyebrow'),
      ...q('.scene-head .section-title'),
      ...q('.skill-card'),
    ];
  } else if (name === 'work') {
    targets = [
      ...q('.scene-back'),
      ...q('.scene-head .eyebrow'),
      ...q('.scene-head .section-title'),
      ...q('.project'),
    ];
  } else if (name === 'contact') {
    targets = [
      ...q('.scene-back'),
      ...q('.contact__card'),
    ];
  }

  if (!targets.length) return;
  gsap.killTweensOf(targets);
  if (prefersReducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
    return;
  }
  gsap.fromTo(targets,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 0.75,
      ease: 'power3.out',
      stagger: 0.055,
      clearProps: 'transform',
      overwrite: 'auto'
    }
  );
}

function showScene(name, { fromHash = false, fromKey = false } = {}) {
  if (!scenes[name] || sceneAnimating) return;
  if (name === activeScene) return;

  sceneAnimating = true;

  const prev = scenes[activeScene];
  const next = scenes[name];

  prev.classList.remove('is-active');
  prev.classList.add('is-leaving');

  // small delay so the leaving transform plays before next fades in
  requestAnimationFrame(() => {
    next.classList.add('is-active');
    next.scrollTop = 0;
    revealScene(next);
  });

  setTimeout(() => {
    prev.classList.remove('is-leaving');
    sceneAnimating = false;
  }, 600);

  activeScene = name;
  syncMainMenu();

  if (!fromHash) {
    const newHash = name === 'home' ? '' : `#${name}`;
    if (history.replaceState) history.replaceState(null, '', newHash || ' ');
    else location.hash = newHash;
  }
}

/* =========================================================
   Main-menu cursor
   ========================================================= */

const mainMenuEl = document.getElementById('main-menu');
const menuItems = mainMenuEl ? Array.from(mainMenuEl.querySelectorAll('.menu__item')) : [];
let menuIndex = 0;

function syncMainMenu() {
  if (!menuItems.length) return;
  // Highlight the menu item matching the current scene (or 0 when home)
  if (activeScene === 'home') {
    menuItems.forEach((item, i) => item.classList.toggle('is-selected', i === menuIndex));
  } else {
    const idx = menuItems.findIndex(item => item.dataset.menuTarget === activeScene);
    if (idx >= 0) menuIndex = idx;
    menuItems.forEach((item, i) => item.classList.toggle('is-selected', i === menuIndex));
  }
}

function setMenuIndex(i) {
  if (!menuItems.length) return;
  menuIndex = ((i % menuItems.length) + menuItems.length) % menuItems.length;
  menuItems.forEach((item, idx) => item.classList.toggle('is-selected', idx === menuIndex));
}

/* =========================================================
   Wire up menu-target clicks
   ========================================================= */

function activateTarget(targetName, el) {
  if (!targetName) return false;
  if (!scenes[targetName]) return false; // not a scene (e.g., external link)
  showScene(targetName);
  return true;
}

document.querySelectorAll('[data-menu-target]').forEach((el) => {
  el.addEventListener('click', (e) => {
    const target = el.dataset.menuTarget;
    if (!scenes[target]) return; // let the browser handle non-scene targets (resume download is no-target)
    e.preventDefault();
    activateTarget(target, el);
  });
});

// Hover on main-menu items moves the cursor (no auto-navigate)
menuItems.forEach((item, idx) => {
  item.addEventListener('mouseenter', () => {
    if (activeScene !== 'home') return;
    setMenuIndex(idx);
  });
});

/* =========================================================
   Keyboard navigation
   ========================================================= */

const NAV_FORWARD = new Set(['ArrowDown', 'ArrowRight', 's', 'S', 'd', 'D', 'j', 'J', 'l', 'L']);
const NAV_BACK    = new Set(['ArrowUp', 'ArrowLeft', 'w', 'W', 'a', 'A', 'k', 'K', 'h', 'H']);
const CONFIRM     = new Set(['Enter', ' ']);

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

  if (e.key === 'Escape') {
    if (activeScene !== 'home') {
      e.preventDefault();
      showScene('home', { fromKey: true });
    }
    return;
  }

  if (activeScene === 'home') {
    // Main menu: arrows move the cursor; Enter selects
    if (NAV_FORWARD.has(e.key)) {
      e.preventDefault();
      setMenuIndex(menuIndex + 1);
    } else if (NAV_BACK.has(e.key)) {
      e.preventDefault();
      setMenuIndex(menuIndex - 1);
    } else if (CONFIRM.has(e.key)) {
      e.preventDefault();
      const current = menuItems[menuIndex];
      if (!current) return;
      const target = current.dataset.menuTarget;
      if (target && scenes[target]) {
        showScene(target, { fromKey: true });
      } else {
        // Resume (no menu-target) — trigger the link
        current.click();
      }
    }
  } else {
    // Inside a scene: arrows cycle through scenes
    const idx = sceneOrder.indexOf(activeScene);
    if (NAV_FORWARD.has(e.key)) {
      e.preventDefault();
      const nextIdx = (idx + 1) % sceneOrder.length;
      const target = sceneOrder[nextIdx];
      showScene(target === 'home' ? sceneOrder[1] : target, { fromKey: true });
    } else if (NAV_BACK.has(e.key)) {
      e.preventDefault();
      let prevIdx = idx - 1;
      if (prevIdx <= 0) prevIdx = sceneOrder.length - 1;
      showScene(sceneOrder[prevIdx], { fromKey: true });
    }
  }
});

/* =========================================================
   Hash routing (deep-link to a scene)
   ========================================================= */

function sceneFromHash() {
  const h = location.hash.replace('#', '').trim();
  return scenes[h] ? h : 'home';
}

window.addEventListener('hashchange', () => {
  const target = sceneFromHash();
  if (target !== activeScene) showScene(target, { fromHash: true });
});

/* =========================================================
   Dim the keyboard hint after first interaction
   ========================================================= */

const hint = document.querySelector('.menu-hint');
if (hint) {
  const dim = () => {
    hint.classList.add('is-dim');
    window.removeEventListener('keydown', dim);
    window.removeEventListener('click', dim);
  };
  window.addEventListener('keydown', dim, { once: true });
  window.addEventListener('click', dim, { once: true });
}

/* =========================================================
   Init
   ========================================================= */

function init() {
  const startScene = sceneFromHash();

  // Reveal home immediately (it's already .is-active in HTML)
  if (startScene === 'home') {
    revealScene(scenes.home);
  } else {
    scenes.home.classList.remove('is-active');
    scenes[startScene].classList.add('is-active');
    activeScene = startScene;
    revealScene(scenes[startScene]);
  }

  setMenuIndex(0);
  syncMainMenu();
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  init();
}
