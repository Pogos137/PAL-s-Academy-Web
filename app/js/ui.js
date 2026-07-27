/* ==========================================================================
   ui.js — rendering helpers shared by every view
   ========================================================================== */
(function () {
  'use strict';

  const ico = n => window.PALIcons.svg(n);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Source record for an idea (user notes have none). */
  function srcOf(idea) {
    return idea.sourceId ? PAL.sourceMap[idea.sourceId] : null;
  }
  function topicOf(idea) {
    return PAL.topicMap[idea.topic] || { name: 'Personal', emoji: '📝' };
  }
  function byline(idea) {
    const s = srcOf(idea);
    if (!s) return 'My note';
    return s.kind === 'book' ? s.title + ' · ' + s.author : s.title;
  }

  /* ------------------------------------------------------------------ toast */
  function toast(msg) {
    const wrap = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  /* ------------------------------------------------------------------ modal */
  function modal(html, onMount) {
    const wrap = document.getElementById('modal');
    const inner = document.getElementById('modal-inner');
    inner.innerHTML = html;
    window.PALIcons.render(inner);
    wrap.hidden = false;
    if (onMount) onMount(inner);
    const first = inner.querySelector('input,textarea,select,button');
    if (first) first.focus();
  }
  function closeModal() {
    document.getElementById('modal').hidden = true;
    document.getElementById('modal-inner').innerHTML = '';
  }

  /* ------------------------------------------------------------- goal ring */
  function ring(done, goal, size) {
    size = size || 46;
    const r = (size - 6) / 2, circ = 2 * Math.PI * r;
    const pct = Math.max(0, Math.min(1, goal ? done / goal : 0));
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle class="bg" cx="${size / 2}" cy="${size / 2}" r="${r}"></circle>
      <circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}"
        stroke-dasharray="${(circ * pct).toFixed(1)} ${circ.toFixed(1)}"></circle>
    </svg>`;
  }

  /* -------------------------------------------------------------- idea card */
  function actBtn(name, icon, on, title) {
    return `<button class="icon-btn${on ? ' on' : ''}" data-act="${name}" title="${title}">${ico(icon)}</button>`;
  }

  /**
   * opts: { compact:bool, index:number|null, ctx:string (feed key for reader) }
   */
  function ideaCard(idea, opts) {
    opts = opts || {};
    const t = topicOf(idea);
    const read = Store.isRead(idea.id);
    const tags = (idea.tags || []).slice(0, 4)
      .map(g => `<span class="tag">${esc(g)}</span>`).join('');

    return `<article class="card${read ? ' read-done' : ''}" data-id="${idea.id}">
      <div class="card-head">
        <span class="tag tag-topic">${t.emoji} ${esc(t.name)}</span>
        <span class="dot"></span>
        <span class="card-src" data-act="open-source">${esc(byline(idea))}</span>
        ${idea.clinical ? '<span class="dot"></span><span class="tag tag-clin">clinical</span>' : ''}
      </div>
      <h3 data-act="open">${esc(idea.title)}</h3>
      <p>${esc(idea.body)}</p>
      ${idea.clinical ? `<div class="clin"><b>Why it matters</b>${esc(idea.clinical)}</div>` : ''}
      ${tags ? `<div class="card-tags">${tags}</div>` : ''}
      <div class="card-foot">
        ${actBtn('save', 'bookmark', Store.isSaved(idea.id), 'Save to stash (s)')}
        ${actBtn('like', 'heart', Store.isLiked(idea.id), 'Like (l)')}
        ${actBtn('srs', 'brain', Store.inReview(idea.id), 'Add to spaced repetition (r)')}
        <span class="spacer"></span>
        ${actBtn('read', 'check', read, read ? 'Read' : 'Mark as read')}
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------ small parts */
  function topicTile(t) {
    const readCount = (PAL.byTopic[t.id] || []).filter(i => Store.isRead(i.id)).length;
    const pct = t.count ? Math.round(readCount / t.count * 100) : 0;
    return `<a class="tile" href="#/topic/${t.id}">
      <span class="emoji">${t.emoji}</span>
      <h3>${esc(t.name)}</h3>
      <p>${esc(t.blurb)}</p>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="meta">${readCount}/${t.count} ideas · ${pct}%</div>
    </a>`;
  }

  function sourceTile(s) {
    const ideas = PAL.bySource[s.id] || [];
    const readCount = ideas.filter(i => Store.isRead(i.id)).length;
    const pct = ideas.length ? Math.round(readCount / ideas.length * 100) : 0;
    return `<a class="tile" href="#/source/${s.id}">
      <span class="emoji">${s.kind === 'book' ? '📕' : '🗂️'}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.author)}</p>
      <div class="bar gold"><i style="width:${pct}%"></i></div>
      <div class="meta">${readCount}/${ideas.length} · ${pct}%</div>
    </a>`;
  }

  function empty(icon, title, sub) {
    return `<div class="empty"><div class="big">${icon}</div><h3>${esc(title)}</h3><p>${esc(sub)}</p></div>`;
  }

  function pageHead(title, sub) {
    return `<h1 class="page-title">${esc(title)}</h1><p class="page-sub">${esc(sub)}</p>`;
  }

  /* ------------------------------------------------------------------ misc */
  function allIdeas() {
    return PAL.ideas.concat(Store.state.notes);
  }
  function findIdea(id) {
    return PAL.ideaMap[id] || Store.state.notes.find(n => n.id === id) || null;
  }
  function relTime(ts) {
    const d = Math.round((Date.now() - ts) / 86400000);
    if (d <= 0) return 'today';
    if (d === 1) return 'yesterday';
    if (d < 30) return d + ' days ago';
    if (d < 365) return Math.round(d / 30) + ' months ago';
    return Math.round(d / 365) + ' years ago';
  }
  function dueIn(ts) {
    const d = Math.round((ts - Date.now()) / 86400000);
    if (d <= 0) return 'due now';
    if (d === 1) return 'in 1 day';
    if (d < 30) return 'in ' + d + ' days';
    return 'in ' + (d / 30).toFixed(1) + ' months';
  }

  window.UI = {
    esc, ico, srcOf, topicOf, byline, toast, modal, closeModal, ring,
    ideaCard, topicTile, sourceTile, empty, pageHead, allIdeas, findIdea,
    relTime, dueIn
  };
})();
