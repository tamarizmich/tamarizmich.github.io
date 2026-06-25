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

/* =========================================================
   i18n — EN / ES
   ========================================================= */

const I18N = {
  'home.chip': {
    en: 'Graduating July 2026 · Open to opportunities',
    es: 'Me gradúo en julio 2026 · Abierta a oportunidades',
  },
  'home.sub': {
    en: 'Software Engineering student building <em>desktop</em>, <em>mobile</em>, and <em>web</em> applications.',
    es: 'Estudiante de Ingeniería de Software construyendo aplicaciones de <em>escritorio</em>, <em>móviles</em> y <em>web</em>.',
  },

  'menu.about':   { en: 'about',    es: 'sobre mí' },
  'menu.skills':  { en: 'skills',   es: 'habilidades' },
  'menu.work':    { en: 'work',     es: 'proyectos' },
  'menu.contact': { en: 'contact',  es: 'contacto' },
  'menu.resume':  { en: 'resume',   es: 'cv' },

  'pc.header':    { en: 'player card', es: 'ficha' },
  'pc.role':      { en: 'Software Engineer · Apprentice', es: 'Ing. de Software · Aprendiz' },
  'pc.lv.val':    { en: '08 / 08 <em>final sem</em>', es: '08 / 08 <em>último sem</em>' },
  'pc.cl.val':    { en: 'polyglot', es: 'políglota' },
  'pc.main.tag':  { en: '▸ main quest',     es: '▸ misión principal' },
  'pc.main.body': { en: 'graduate · July 2026', es: 'graduarme · julio 2026' },

  'back': { en: 'menu', es: 'menú' },

  'about.eyebrow': { en: '01 — About', es: '01 — Sobre mí' },
  'about.title':   { en: 'A bit about me', es: 'Un poco sobre mí' },
  'about.p1': {
    en: 'Final-semester <strong>Software Engineering</strong> student at <strong>Universidad Veracruzana</strong>, with experience building desktop, mobile, and web applications.',
    es: 'Estudiante de último semestre de <strong>Ingeniería de Software</strong> en la <strong>Universidad Veracruzana</strong>, con experiencia desarrollando aplicaciones de escritorio, móviles y web.',
  },
  'about.p2': {
    en: 'I pick up new technologies quickly and work well in collaborative teams. Recently, my focus has been on application security and clean API design.',
    es: 'Aprendo nuevas tecnologías con rapidez y trabajo bien en equipos colaborativos. Recientemente, mi enfoque ha sido la seguridad de aplicaciones y el diseño limpio de APIs.',
  },
  'about.p3': {
    en: 'Graduating in July 2026. Looking for my first role in software engineering, on a team where I can contribute and keep learning.',
    es: 'Me gradúo en julio de 2026. Busco mi primer rol en ingeniería de software, en un equipo donde pueda contribuir y seguir aprendiendo.',
  },
  'about.stat1': { en: 'Languages & frameworks', es: 'Lenguajes & frameworks' },
  'about.stat3': { en: 'Graduation year',        es: 'Año de graduación' },

  'skills.eyebrow': { en: '02 — Skills', es: '02 — Habilidades' },
  'skills.title':   { en: 'What I work with', es: 'Con lo que trabajo' },

  'skill.web.h':       { en: 'Web Development', es: 'Desarrollo Web' },
  'skill.web.p':       { en: 'HTML, CSS, JavaScript. Experience with Bootstrap and modern responsive layouts.', es: 'HTML, CSS, JavaScript. Experiencia con Bootstrap y layouts responsivos modernos.' },
  'skill.api.h':       { en: 'API Development', es: 'Desarrollo de APIs' },
  'skill.api.p':       { en: 'RESTful APIs with Node.js and Express. Recent focus on security best practices.', es: 'APIs RESTful con Node.js y Express. Enfoque reciente en buenas prácticas de seguridad.' },
  'skill.db.h':        { en: 'Databases', es: 'Bases de Datos' },
  'skill.db.p':        { en: 'Relational database design and management with MySQL and SQL Server.', es: 'Diseño y gestión de bases de datos relacionales con MySQL y SQL Server.' },
  'skill.lang.h':      { en: 'Languages', es: 'Lenguajes' },
  'skill.lang.p':      { en: 'Java, C#, Python, JavaScript, PHP, C — multi-paradigm and multi-platform.', es: 'Java, C#, Python, JavaScript, PHP, C — multiparadigma y multiplataforma.' },
  'skill.mobile.h':    { en: 'Mobile', es: 'Móvil' },
  'skill.mobile.p':    { en: 'Native Android development with Java in Android Studio.', es: 'Desarrollo Android nativo con Java en Android Studio.' },
  'skill.sec.h':       { en: 'Security', es: 'Seguridad' },
  'skill.sec.p':       { en: 'Threat modeling, CWE analysis, and secure API design — recent focus area.', es: 'Modelado de amenazas, análisis CWE y diseño seguro de APIs — enfoque actual.' },
  'skill.git.h':       { en: 'Version Control', es: 'Control de Versiones' },
  'skill.git.p':       { en: 'Git and GitHub workflows for collaborative project versioning.', es: 'Flujos de Git y GitHub para versionado colaborativo de proyectos.' },
  'skill.team.h':      { en: 'Teamwork', es: 'Trabajo en equipo' },
  'skill.team.p':      { en: 'Multiple team-based academic projects across full development lifecycles.', es: 'Varios proyectos académicos en equipo a lo largo de ciclos completos de desarrollo.' },
  'skill.self.h':      { en: 'Self-Learning', es: 'Autoaprendizaje' },
  'skill.self.p':      { en: 'Quick at picking up new tech stacks independently — always experimenting.', es: 'Aprendo rápido stacks nuevos por mi cuenta — siempre experimentando.' },
  'skill.creative.h':  { en: 'Creativity', es: 'Creatividad' },
  'skill.creative.p':  { en: 'Comfortable proposing creative solutions to design and product challenges.', es: 'Cómoda proponiendo soluciones creativas a retos de diseño y producto.' },
  'skill.time.h':      { en: 'Time Management', es: 'Gestión del tiempo' },
  'skill.time.p':      { en: 'Trello, Notion, Pomodoro — structured workflows that ship.', es: 'Trello, Notion, Pomodoro — flujos estructurados que entregan.' },
  'skill.adapt.h':     { en: 'Adaptability', es: 'Adaptabilidad' },
  'skill.adapt.p':     { en: 'Comfortable jumping into new environments, stacks, and team cultures.', es: 'Cómoda saltando entre nuevos entornos, stacks y culturas de equipo.' },

  'work.eyebrow': { en: '03 — Selected work', es: '03 — Proyectos' },
  'work.title':   { en: "Things I've built", es: 'Cosas que he construido' },

  'project.cluedo.meta': { en: 'Desktop · C# .NET', es: 'Escritorio · C# .NET' },
  'project.cluedo.h':    { en: 'CLUEDO: Spider-Man Edition', es: 'CLUEDO: Edición Spider-Man' },
  'project.cluedo.p':    { en: 'Classic CLUEDO reimagined with a Spider-Man theme. Built with C# and Windows Forms.', es: 'El CLUEDO clásico reimaginado con tema de Spider-Man. Construido con C# y Windows Forms.' },

  'project.cycle.meta':  { en: 'Mobile · Android', es: 'Móvil · Android' },
  'project.cycle.h':     { en: 'CycleCare', es: 'CycleCare' },
  'project.cycle.p':     { en: 'Native Android app for menstrual cycle tracking, built with Java in Android Studio.', es: 'App Android nativa para tracking del ciclo menstrual, construida con Java en Android Studio.' },

  'project.api.meta':    { en: 'Guide · Security', es: 'Guía · Seguridad' },
  'project.api.year':    { en: '2026 ✦ new', es: '2026 ✦ nuevo' },
  'project.api.h':       { en: 'Secure REST APIs Guide', es: 'Guía de APIs REST Seguras' },
  'project.api.p':       { en: 'Practical guide on building REST APIs with security baked in. CWE coverage and code examples.', es: 'Guía práctica para construir APIs REST con seguridad integrada. Cobertura de CWE y ejemplos de código.' },

  'project.algo.meta':   { en: 'Web · Algorithms', es: 'Web · Algoritmos' },
  'project.algo.year':   { en: '2026 ✦ new', es: '2026 ✦ nuevo' },
  'project.algo.h':      { en: 'Algorithm Visualizer', es: 'Visualizador de Algoritmos' },
  'project.algo.p':      { en: 'Interactive pathfinding and sorting visualizer. BFS, DFS, Dijkstra, A* with race mode and live stats.', es: 'Visualizador interactivo de pathfinding y sorting. BFS, DFS, Dijkstra, A* con modo carrera y estadísticas en vivo.' },
  'project.algo.live':   { en: 'live', es: 'demo' },
  'project.algo.code':   { en: 'code', es: 'código' },

  'contact.eyebrow':  { en: '04 — Contact', es: '04 — Contacto' },
  'contact.title.l1': { en: 'Got a project', es: '¿Tienes un proyecto' },
  'contact.title.l2': { en: 'in mind?',      es: 'en mente?' },
  'contact.body':     { en: "If you have a project in mind and could use an extra pair of hands, I'd love to hear about it.", es: 'Si tienes un proyecto en mente y te vendría bien un par de manos extra, me encantaría saber de él.' },
  'contact.btn':      { en: 'Say hello', es: 'Saluda' },

  'hint.nav':  { en: 'navigate', es: 'navega' },
  'hint.sel':  { en: 'select',   es: 'elige' },
  'hint.home': { en: 'home',     es: 'inicio' },
};

const LANG_STORAGE_KEY = 'mich.lang';
const SUPPORTED_LANGS = ['en', 'es'];

function detectInitialLang() {
  const stored = (() => { try { return localStorage.getItem(LANG_STORAGE_KEY); } catch { return null; } })();
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(browser) ? browser : 'en';
}

let currentLang = detectInitialLang();

function applyLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const entry = I18N[key];
    if (!entry) return;
    const value = entry[lang];
    if (typeof value !== 'string') return;
    el.innerHTML = value;
  });
  document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
  });
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
}

document.querySelectorAll('.lang-switch__btn').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Apply once the DOM is ready (script is at end of body so this is fine)
applyLang(currentLang);
