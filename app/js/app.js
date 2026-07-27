/* ==========================================================================
   app.js — router, event delegation, reader overlay, keyboard shortcuts
   ========================================================================== */
(function () {
  'use strict';

  const view = document.getElementById('view');
  const readerEl = document.getElementById('reader');
  const ico = n => window.PALIcons.svg(n);
  const esc = s => UI.esc(s);

  let ctx = {};          // context returned by the current view (ids, startAt…)
  let currentView = null;
  let reader = null;     // { ids, i }

  const App = {};

  /* ====================================================================== */
  /* THEME                                                                   */
  /* ====================================================================== */
  App.setTheme = function (t) {
    document.documentElement.setAttribute('data-theme', t);
    Store.state.theme = t;
    Store.save();
  };
  App.toggleTheme = function () {
    App.setTheme(Store.state.theme === 'dark' ? 'light' : 'dark');
    App.render();
  };

  /* ====================================================================== */
  /* ROUTER                                                                  */
  /* ====================================================================== */
  function parseHash() {
    const h = (location.hash || '#/feed').replace(/^#\/?/, '');
    const parts = h.split('/');
    return { name: parts[0] || 'feed', arg: parts.slice(1).join('/') };
  }

  App.render = function () {
    const { name, arg } = parseHash();
    const fn = Views[name] || Views.feed;
    currentView = fn;

    const out = fn(arg ? decodeURIComponent(arg) : undefined) || { html: '' };
    ctx = out;
    view.innerHTML = out.html;
    window.PALIcons.render(view);

    // nav highlight
    document.querySelectorAll('[data-route]').forEach(a => {
      a.classList.toggle('on', a.dataset.route === name ||
        (name === 'topic' || name === 'source' ? a.dataset.route === 'explore' : false) ||
        (name === 'path' ? a.dataset.route === 'paths' : false));
    });

    chrome();
    document.querySelector('.sidebar').classList.remove('open');
  };

  /* -------------------------------------------------- persistent chrome UI */
  function chrome() {
    const st = Store.state;
    const streak = Store.streak();
    const done = Store.todayCount();

    document.getElementById('streak').innerHTML =
      `${ico('fire')}${streak.current}<em>day${streak.current === 1 ? '' : 's'}</em>`;

    document.getElementById('sidebar-goal').innerHTML =
      `<div class="ring">${UI.ring(done, st.dailyGoal, 42)}
        <div class="lab"><strong>${done}/${st.dailyGoal}</strong><span>today</span></div></div>`;

    const dueN = SRS.counts().due;
    const pill = document.getElementById('due-pill');
    pill.hidden = !dueN;
    pill.textContent = dueN;

    window.PALIcons.render(document.getElementById('streak'));
  }

  /* ====================================================================== */
  /* READER OVERLAY                                                          */
  /* ====================================================================== */
  App.openReader = function (ids, i) {
    if (!ids || !ids.length) return;
    reader = { ids: ids.slice(), i: Math.max(0, Math.min(i || 0, ids.length - 1)) };
    readerEl.hidden = false;
    document.body.style.overflow = 'hidden';
    paintReader();
  };

  App.closeReader = function () {
    reader = null;
    readerEl.hidden = true;
    document.body.style.overflow = '';
    App.render();
  };

  function readerStep(d) {
    if (!reader) return;
    const n = reader.i + d;
    if (n < 0) return;
    if (n >= reader.ids.length) { App.closeReader(); UI.toast('End of the stack'); return; }
    reader.i = n;
    paintReader();
    document.getElementById('reader-body').scrollTop = 0;
  }

  function paintReader() {
    const idea = UI.findIdea(reader.ids[reader.i]);
    if (!idea) return readerStep(1);

    if (Store.markRead(idea.id)) Store.save();

    const s = UI.srcOf(idea);
    const t = UI.topicOf(idea);
    const tags = (idea.tags || []).map(g => `<span class="tag">${esc(g)}</span>`).join(' ');

    document.getElementById('reader-body').innerHTML = `<div class="rd">
      <div class="kicker">
        <span class="tag tag-topic">${t.emoji} ${esc(t.name)}</span>
        ${s ? `<span>${esc(s.title)}${s.kind === 'book' ? ' · ' + esc(s.author) : ''}</span>` : '<span>My note</span>'}
      </div>
      <h1>${esc(idea.title)}</h1>
      <p class="lede">${esc(idea.body)}</p>
      ${idea.clinical ? `<div class="clin"><b>Why it matters</b>${esc(idea.clinical)}</div>` : ''}
      ${idea.mnemonic ? `<div class="mnem">${esc(idea.mnemonic)}</div>` : ''}
      ${idea.q ? `<div class="mnem" style="background:var(--primary-soft); color:var(--fg-2)">
          <strong>Recall:</strong> ${esc(idea.q.replace(/\{\{(.+?)\}\}/g, '[ … ]'))}</div>` : ''}
      ${tags ? `<div class="card-tags" style="margin-top:20px">${tags}</div>` : ''}
      ${s ? `<div class="src-note">From <a href="#/source/${s.id}" data-act="close-reader-nav"><strong>${esc(s.title)}</strong></a> — ${esc(s.blurb)}</div>` : ''}
    </div>`;

    document.getElementById('reader-acts').innerHTML = `
      <button class="icon-btn${Store.isSaved(idea.id) ? ' on' : ''}" data-act="save" data-id="${idea.id}" title="Save (s)">${ico('bookmark')}</button>
      <button class="icon-btn${Store.isLiked(idea.id) ? ' on' : ''}" data-act="like" data-id="${idea.id}" title="Like (l)">${ico('heart')}</button>
      <button class="icon-btn${Store.inReview(idea.id) ? ' on' : ''}" data-act="srs" data-id="${idea.id}" title="Review later (r)">${ico('brain')}</button>
      <button class="icon-btn" data-act="collect" data-id="${idea.id}" title="Add to collection">${ico('paths')}</button>`;

    document.getElementById('reader-count').textContent = (reader.i + 1) + ' / ' + reader.ids.length;
    document.getElementById('reader-progress-bar').style.width =
      ((reader.i + 1) / reader.ids.length * 100) + '%';

    window.PALIcons.render(readerEl);
    chrome();
  }

  /* ====================================================================== */
  /* NEW / EDIT IDEA                                                         */
  /* ====================================================================== */
  App.newIdeaModal = function (existing) {
    const n = existing || { title: '', body: '', topic: 'learning', tags: [] };
    UI.modal(`<h2>${existing ? 'Edit idea' : 'New idea'}</h2>
      <p class="muted">Your own ideas live beside the library — searchable, savable, reviewable.</p>
      <label class="field"><span>Title</span>
        <input id="ni-title" value="${esc(n.title)}" placeholder="The one-line version"></label>
      <label class="field"><span>The idea</span>
        <textarea id="ni-body" placeholder="Two or three sentences. Write it as if explaining to yourself in six months.">${esc(n.body)}</textarea></label>
      <label class="field"><span>Realm</span>
        <select id="ni-topic">${PAL.topics.map(t =>
          `<option value="${t.id}"${t.id === n.topic ? ' selected' : ''}>${t.emoji} ${esc(t.name)}</option>`).join('')}</select></label>
      <label class="field"><span>Tags — comma separated</span>
        <input id="ni-tags" value="${esc((n.tags || []).join(', '))}" placeholder="e.g. cardiology, revision"></label>
      <label class="field"><span>Recall prompt (optional) — wrap the hidden part in {{ }}</span>
        <input id="ni-q" value="${esc(n.q || '')}" placeholder="The resting membrane potential is about {{-70 mV}}"></label>
      <div class="modal-foot">
        ${existing ? `<button class="btn btn-ghost" data-act="delete-note" data-id="${existing.id}" style="margin-right:auto; color:var(--danger)">Delete</button>` : ''}
        <button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="save-note" data-id="${existing ? existing.id : ''}">Save idea</button>
      </div>`);
  };

  function collectModal(ideaId) {
    const cols = Store.state.collections;
    UI.modal(`<h2>Add to collection</h2>
      ${cols.length ? `<div class="chips" style="margin-top:14px">${cols.map(c => {
        const on = c.ideaIds.indexOf(ideaId) >= 0;
        return `<button class="chip${on ? ' on' : ''}" data-act="toggle-collect" data-cid="${c.id}" data-id="${ideaId}">${esc(c.name)}</button>`;
      }).join('')}</div>` : '<p class="muted">No collections yet.</p>'}
      <label class="field"><span>Or create a new one</span><input id="cname" placeholder="Collection name"></label>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close">Done</button>
        <button class="btn btn-primary" data-act="collect-new" data-id="${ideaId}">Create &amp; add</button>
      </div>`);
  }

  /* ====================================================================== */
  /* GLOBAL ACTIONS                                                          */
  /* ====================================================================== */
  const globalActions = {
    open(el) {
      const id = el.closest('[data-id]').dataset.id;
      const ids = (ctx.ids && ctx.ids.length) ? ctx.ids : [id];
      const i = ids.indexOf(id);
      App.openReader(ids, i < 0 ? 0 : i);
    },
    'open-source'(el) {
      const idea = UI.findIdea(el.closest('[data-id]').dataset.id);
      if (idea && idea.sourceId) location.hash = '#/source/' + idea.sourceId;
    },
    save(el) {
      const id = el.dataset.id || el.closest('[data-id]').dataset.id;
      const on = Store.toggleSave(id);
      el.classList.toggle('on', on);
      UI.toast(on ? 'Saved to stash' : 'Removed from stash');
    },
    like(el) {
      const id = el.dataset.id || el.closest('[data-id]').dataset.id;
      el.classList.toggle('on', Store.toggleLike(id));
    },
    srs(el) {
      const id = el.dataset.id || el.closest('[data-id]').dataset.id;
      const on = SRS.toggle(id);
      el.classList.toggle('on', on);
      UI.toast(on ? 'Scheduled for review' : 'Removed from review');
      chrome();
    },
    read(el) {
      const card = el.closest('[data-id]');
      const id = card.dataset.id;
      if (Store.isRead(id)) { Store.unmarkRead(id); el.classList.remove('on'); card.classList.remove('read-done'); }
      else { Store.markRead(id); Store.save(); el.classList.add('on'); card.classList.add('read-done'); }
      chrome();
    },
    collect(el) { collectModal(el.dataset.id || el.closest('[data-id]').dataset.id); },
    'toggle-collect'(el) {
      const on = Store.toggleInCollection(el.dataset.cid, el.dataset.id);
      el.classList.toggle('on', on);
    },
    'collect-new'(el) {
      const name = document.getElementById('cname').value.trim();
      if (!name) return UI.toast('Give it a name');
      const c = Store.addCollection(name);
      Store.toggleInCollection(c.id, el.dataset.id);
      UI.closeModal(); UI.toast('Added to ' + name);
    },
    close() { UI.closeModal(); },
    // reader footer link: the delegate cancels the anchor, so navigate by hand
    'close-reader-nav'(el) {
      const href = el.getAttribute('href');
      if (reader) App.closeReader();
      if (href) location.hash = href;
    },
    'save-note'(el) {
      const t = document.getElementById('ni-title').value.trim();
      const b = document.getElementById('ni-body').value.trim();
      if (!t) return UI.toast('A title is required');
      const patch = {
        title: t, body: b,
        topic: document.getElementById('ni-topic').value,
        tags: document.getElementById('ni-tags').value.split(',').map(x => x.trim()).filter(Boolean),
        q: document.getElementById('ni-q').value.trim() || null
      };
      if (el.dataset.id) Store.updateNote(el.dataset.id, patch);
      else Store.addNote(patch);
      UI.closeModal(); App.render(); UI.toast('Idea saved');
    },
    'delete-note'(el) {
      Store.deleteNote(el.dataset.id);
      UI.closeModal(); App.render(); UI.toast('Idea deleted');
    }
  };

  /* -------------------------------------------------------- event delegate */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { UI.closeModal(); return; }

    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;

    // reader nav buttons
    if (el.id === 'reader-close') { App.closeReader(); return; }
    if (el.id === 'reader-next') { readerStep(1); return; }
    if (el.id === 'reader-prev') { readerStep(-1); return; }

    const handler = globalActions[act] ||
                    (currentView && currentView.actions && currentView.actions[act]);
    if (handler) {
      e.preventDefault();
      handler(el, ctx);
    }
  });

  document.getElementById('reader-close').addEventListener('click', App.closeReader);
  document.getElementById('reader-next').addEventListener('click', () => readerStep(1));
  document.getElementById('reader-prev').addEventListener('click', () => readerStep(-1));
  document.getElementById('btn-theme').addEventListener('click', App.toggleTheme);
  document.getElementById('btn-new').addEventListener('click', () => App.newIdeaModal());
  document.getElementById('btn-menu').addEventListener('click', () =>
    document.querySelector('.sidebar').classList.toggle('open'));

  /* -------------------------------------------------------------- search */
  const search = document.getElementById('search');
  let searchTimer = null;
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const v = search.value.trim();
      if (!v) { if (parseHash().name === 'search') location.hash = '#/feed'; return; }
      const target = '#/search/' + encodeURIComponent(v);
      if (parseHash().name === 'search') location.replace(target);
      else location.hash = target;
    }, 220);
  });

  /* ------------------------------------------------------------ keyboard */
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);

    if (e.key === 'Escape') {
      if (!document.getElementById('modal').hidden) return UI.closeModal();
      if (reader) return App.closeReader();
      if (typing) e.target.blur();
      return;
    }
    if (typing) return;

    if (e.key === '/') { e.preventDefault(); search.focus(); search.select(); return; }
    if (e.key === 't') { App.toggleTheme(); return; }

    if (reader) {
      const idea = UI.findIdea(reader.ids[reader.i]);
      if (e.key === 'j' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); readerStep(1); }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); readerStep(-1); }
      else if (e.key === 's' && idea) { Store.toggleSave(idea.id); paintReader(); UI.toast('Stash updated'); }
      else if (e.key === 'l' && idea) { Store.toggleLike(idea.id); paintReader(); }
      else if (e.key === 'r' && idea) { SRS.toggle(idea.id); paintReader(); UI.toast('Review updated'); }
      return;
    }

    if (parseHash().name === 'review') {
      const grade = document.querySelector('[data-act="grade"][data-g="' + e.key + '"]');
      if (grade) { grade.click(); return; }
      if (e.key === ' ' || e.key === 'Enter') {
        const show = document.querySelector('[data-act="show"]');
        if (show) { e.preventDefault(); show.click(); }
      }
    }
  });

  window.addEventListener('hashchange', () => {
    if (reader) App.closeReader();
    Views.review.reset();
    App.render();
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  });

  /* ====================================================================== */
  /* BOOT                                                                    */
  /* ====================================================================== */
  PAL.build();
  Store.load();
  App.setTheme(Store.state.theme || 'dark');
  window.PALIcons.render(document.body);

  if (!location.hash) location.hash = '#/feed';
  App.render();

  window.App = App;

  console.log('%cStacks', 'font:600 15px sans-serif;color:#3F8472',
    '— ' + PAL.ideas.length + ' ideas · ' + PAL.sources.length + ' sources · ' + PAL.topics.length + ' realms');
})();
