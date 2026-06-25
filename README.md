# Portfolio of Aneth Michelle Tamariz Moreno ༘⋆🌷
A Frutiger Aero × game-menu portfolio — single-screen, glassy, and keyboard-friendly.

── .✦ Live at [tamarizmich.github.io](https://tamarizmich.github.io)

## Description 💭₊˚
Personal portfolio built as a single-screen SPA with a **Frutiger Aero / Aqua** aesthetic and **videogame main menu** navigation. No vertical scrolling between sections — each menu option (about, skills, work, contact) is its own scene that swaps in with a fade-and-glide transition. Built from scratch with vanilla HTML, CSS, and JavaScript — no frameworks. Includes an RPG-style player card on the home menu, full EN / ES toggle, keyboard navigation, and motion-preference accessibility.

***

### Screenshots 🩰˚˖𓍢ִ໋
![alt text](/assets/image.png)
![alt text](/assets/skills.png)
![alt text](/assets/projects.png)
![alt text](/assets/contact.png)

## Technologies Used 🎧✧˚.

* HTML5
* CSS3 (custom properties, backdrop-filter, grid, glass surfaces, scene transitions)
* JavaScript (vanilla) — scene manager, i18n, custom cursor, hash routing
* [GSAP](https://gsap.com/) — staggered scene-entrance animations and quickTo for magnetic / tilt effects
* [Bootstrap Icons](https://icons.getbootstrap.com/) — iconography
* Google Fonts — Instrument Serif, Inter, VT323

## Features ✦˚.

* **Single-screen SPA** — no scroll between sections; each option swaps the active scene
* **Game-menu navigation** — keyboard support (↑ / ↓ / W / S / arrows to move, ↵ to confirm, esc to return home); a sliding cursor `▸` and numbered items (`01 ▸ about →`); hover moves the cursor without auto-navigating
* **RPG player card** — character-sheet style block on the home menu with level, class, location, guild, and main quest
* **EN / ES toggle** — top-right pill switches language instantly; detects browser locale on first visit and persists choice in `localStorage`
* **Hash routing** — `#about`, `#skills`, etc. for deep links and shareable URLs
* **Frutiger Aero aesthetic** — sky-blue glass surfaces, soft aurora backdrop, chrome buttons with shine
* **Custom cursor** — glowing aqua dot with halo that expands on interactive elements
* **3D tilt** on project cards and the player card
* **Accessibility** — respects `prefers-reduced-motion`, touch-device fallbacks, semantic HTML
* **Responsive** — adapts from 320px to ultrawide; mobile collapses the home layout and hides the keyboard hint

## Scenes 🎀༘⋆

1. **Home (main menu)** — name, status chip, vertical menu list, player card character sheet
2. **About** — short bio and quick stats
3. **Skills** — twelve glass cards covering web, API, databases, mobile, security, and soft skills
4. **Work** — four selected projects across desktop, mobile, web, and security
5. **Contact** — sparkle card with email CTA and social links

## Keyboard map ⌨️

| key            | action                                                     |
|----------------|------------------------------------------------------------|
| ↑ / ↓ / W / S  | move menu cursor (home) or cycle through scenes            |
| ↵ enter / space | confirm the selected option                                |
| esc            | return to home menu                                        |

## Run locally 🩻˚.

```bash
# any static server works — for example, with Python
python -m http.server 8765
# then open http://localhost:8765
```

## Contact ˚˖𓍢ִ໋🦢˚
> You can reach me via email at michellemoreno1313@gmail.com or connect with me on [LinkedIn](https://www.linkedin.com/in/michelletamariz/) · [GitHub](https://github.com/tamarizmich) · [X](https://x.com/tamarizmich).
