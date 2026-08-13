/* icons.js — inline SVG set; replaces <i data-ico="name"> elements */
(function () {
  'use strict';
  const P = 'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"';

  const ICONS = {
    feed:    `<path d="M4 6h16M4 12h16M4 18h10" ${P}/>`,
    explore: `<circle cx="11" cy="11" r="7" ${P}/><path d="M11 8v6M8 11h6" ${P}/>`,
    review:  `<path d="M3 12a9 9 0 1 0 3-6.7" ${P}/><path d="M3 4v5h5" ${P}/>`,
    stash:   `<path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z" ${P}/>`,
    paths:   `<path d="M6 4v10a4 4 0 0 0 4 4h4" ${P}/><circle cx="6" cy="4" r="2" ${P}/><circle cx="18" cy="18" r="2" ${P}/>`,
    stats:   `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" ${P}/>`,
    search:  `<circle cx="10.5" cy="10.5" r="6.5" ${P}/><path d="M15.5 15.5 21 21" ${P}/>`,
    plus:    `<path d="M12 5v14M5 12h14" ${P}/>`,
    x:       `<path d="M6 6l12 12M18 6L6 18" ${P}/>`,
    up:      `<path d="M12 19V5M5 12l7-7 7 7" ${P}/>`,
    down:    `<path d="M12 5v14M5 12l7 7 7-7" ${P}/>`,
    menu:    `<path d="M4 7h16M4 12h16M4 17h16" ${P}/>`,
    cog:     `<circle cx="12" cy="12" r="3" ${P}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" ${P}/>`,
    theme:   `<path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" ${P}/>`,
    bookmark:`<path d="M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z" ${P}/>`,
    heart:   `<path d="M12 20s-7-4.4-9.2-8.3A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5.7C19 15.6 12 20 12 20z" ${P}/>`,
    check:   `<path d="M4 12.5l5.2 5L20 6.5" ${P}/>`,
    brain:   `<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8V4z" ${P}/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8V4z" ${P}/>`,
    book:    `<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" ${P}/>`,
    fire:    `<path d="M12 22c4 0 6-2.7 6-6 0-4-4-5-3-10-3 1-5 4-5 6 0-1-1-2-2-3-1 2-2 4-2 7 0 3.3 2 6 6 6z" ${P}/>`,
    trash:   `<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" ${P}/>`,
    edit:    `<path d="M4 20h4L20 8l-4-4L4 16v4z" ${P}/>`,
    download:`<path d="M12 4v11M7 11l5 5 5-5M4 20h16" ${P}/>`,
    upload:  `<path d="M12 20V9M7 13l5-5 5 5M4 4h16" ${P}/>`,
    shuffle: `<path d="M4 6h4l8 12h4M4 18h4l2-3M16 6h4M18 4l2 2-2 2M18 16l2 2-2 2" ${P}/>`,
    clock:   `<circle cx="12" cy="12" r="9" ${P}/><path d="M12 7v5l3.2 2" ${P}/>`,
    film:    `<rect x="3" y="5" width="18" height="14" rx="2.5" ${P}/><path d="M8 5v14M16 5v14M3 12h18" ${P}/>`,
    sound:   `<path d="M4 9v6h3.5L12 19V5L7.5 9H4z" ${P}/><path d="M16 9.2a4 4 0 0 1 0 5.6" ${P}/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" ${P}/>`,
    mute:    `<path d="M4 9v6h3.5L12 19V5L7.5 9H4z" ${P}/><path d="M16.5 10l4 4M20.5 10l-4 4" ${P}/>`,
    play:    `<path d="M8 5.5v13l11-6.5z" ${P}/>`,
    grid:    `<rect x="3.5" y="3.5" width="7" height="7" rx="1.6" ${P}/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6" ${P}/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6" ${P}/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6" ${P}/>`,
    reels:   `<rect x="4" y="3" width="16" height="18" rx="3" ${P}/><path d="M10 9.5v5l4.5-2.5z" ${P}/>`
  };

  window.PALIcons = {
    svg(name) {
      const body = ICONS[name] || ICONS.feed;
      return `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
    },
    /** Replace every <i data-ico="…"> inside root with its SVG. */
    render(root) {
      (root || document).querySelectorAll('i[data-ico]').forEach(el => {
        const wrap = document.createElement('span');
        wrap.innerHTML = window.PALIcons.svg(el.getAttribute('data-ico'));
        const svg = wrap.firstChild;
        if (el.className) svg.setAttribute('class', el.className);
        el.replaceWith(svg);
      });
    }
  };
})();
