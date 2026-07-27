/* ==========================================================================
   views.js — one function per route. Each returns { html, mount? }
   ========================================================================== */
(function () {
  'use strict';

  const { esc, ico, ideaCard, topicTile, sourceTile, empty, pageHead,
          allIdeas, findIdea, srcOf, relTime, dueIn, ring } = UI;

  const V = {};
  let feedFilter = 'all';
  let feedLimit = 12;

  /* ====================================================================== */
  /* FEED                                                                    */
  /* ====================================================================== */
  function feedPool() {
    const day = Number(Store.today().replace(/-/g, ''));
    let pool = PAL.ideas.slice();
    if (feedFilter !== 'all') pool = pool.filter(i => i.topic === feedFilter);
    pool = PAL.seededShuffle(pool, Store.state.feedSeed + day);
    // unread first, but keep read ones available underneath
    const unread = pool.filter(i => !Store.isRead(i.id));
    const read = pool.filter(i => Store.isRead(i.id));
    return unread.concat(read);
  }

  V.feed = function () {
    const goal = Store.state.dailyGoal;
    const done = Store.todayCount();
    const pool = feedPool();
    const shown = pool.slice(0, feedLimit);
    const dueN = SRS.counts().due;

    const chips = ['<button class="chip' + (feedFilter === 'all' ? ' on' : '') +
                   '" data-act="filter" data-topic="all">Everything</button>']
      .concat(PAL.topics.map(t =>
        `<button class="chip${feedFilter === t.id ? ' on' : ''}" data-act="filter" data-topic="${t.id}">${t.emoji} ${esc(t.name)}</button>`))
      .join('');

    return {
      html: `<div class="wrap">
        <div class="rowline" style="margin-bottom:22px; gap:18px; flex-wrap:wrap">
          <div class="ring">
            ${ring(done, goal, 58)}
            <div class="lab"><strong>${done} / ${goal} today</strong>
              <span>${done >= goal ? 'Daily goal met — keep going.' : 'ideas read or reviewed'}</span></div>
          </div>
          ${dueN ? `<a class="btn btn-accent" href="#/review">${ico('brain')}${dueN} due for review</a>` : ''}
          <button class="btn btn-ghost" data-act="shuffle" style="margin-left:auto">${ico('shuffle')}Reshuffle</button>
        </div>

        <div class="chips scroll" style="margin-bottom:22px">${chips}</div>

        <div class="grid" id="feed-list">
          ${shown.length ? shown.map(i => ideaCard(i)).join('')
                         : empty('🎉', 'You have read everything here', 'Try another realm, or open Review to consolidate what you have.')}
        </div>

        ${pool.length > feedLimit ? `<div style="text-align:center; margin-top:26px">
          <button class="btn btn-ghost btn-lg" data-act="more">Load more ideas</button></div>` : ''}
      </div>`,
      ids: shown.map(i => i.id)
    };
  };

  V.feed.actions = {
    filter(el) { feedFilter = el.dataset.topic; feedLimit = 12; App.render(); },
    more() { feedLimit += 12; App.render(); },
    shuffle() {
      Store.state.feedSeed = Math.floor(Math.random() * 1e9);
      Store.save(); feedLimit = 12; App.render(); UI.toast('Feed reshuffled');
    }
  };

  /* ====================================================================== */
  /* EXPLORE                                                                 */
  /* ====================================================================== */
  V.explore = function () {
    const books = PAL.sources.filter(s => s.kind === 'book');
    const guides = PAL.sources.filter(s => s.kind === 'guide');
    return {
      html: `<div class="wrap">
        ${pageHead('Explore', PAL.ideas.length + ' ideas across ' + PAL.topics.length + ' realms and ' + PAL.sources.length + ' sources.')}
        <div class="rowline" style="margin:-14px 0 26px">
          <a class="btn btn-ghost btn-sm" href="#/refs">${ico('book')}Where this comes from</a>
        </div>

        <section class="sec">
          <div class="sec-head"><h2>Realms</h2></div>
          <div class="grid grid-3">${PAL.topics.map(topicTile).join('')}</div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Study guides</h2><span class="muted">${guides.length} collections</span></div>
          <div class="grid grid-3">${guides.map(sourceTile).join('')}</div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Books</h2><span class="muted">${books.length} titles</span></div>
          <div class="grid grid-3">${books.map(sourceTile).join('')}</div>
        </section>
      </div>`
    };
  };

  /* ====================================================================== */
  /* TOPIC                                                                   */
  /* ====================================================================== */
  V.topic = function (id) {
    const t = PAL.topicMap[id];
    if (!t) return { html: empty('🤷', 'Unknown realm', 'That topic does not exist.') };
    const ideas = PAL.byTopic[id] || [];
    const readN = ideas.filter(i => Store.isRead(i.id)).length;
    return {
      html: `<div class="wrap">
        ${pageHead(t.emoji + '  ' + t.name, t.blurb)}
        <div class="rowline" style="margin-bottom:24px">
          <div class="bar" style="flex:1; max-width:340px; margin:0"><i style="width:${ideas.length ? readN / ideas.length * 100 : 0}%"></i></div>
          <span class="muted">${readN} of ${ideas.length} read</span>
          <button class="btn btn-primary btn-sm" data-act="read-topic" style="margin-left:auto">${ico('feed')}Read this realm</button>
        </div>

        <section class="sec">
          <div class="sec-head"><h2>Sources</h2></div>
          <div class="grid grid-3">${t.sources.map(sourceTile).join('')}</div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>All ideas</h2></div>
          <div class="grid">${ideas.slice(0, 20).map(i => ideaCard(i)).join('')}</div>
        </section>
      </div>`,
      ids: ideas.map(i => i.id)
    };
  };
  V.topic.actions = {
    'read-topic'(el, ctx) { App.openReader(ctx.ids, 0); }
  };

  /* ====================================================================== */
  /* SOURCE                                                                  */
  /* ====================================================================== */
  V.source = function (id) {
    const s = PAL.sourceMap[id];
    if (!s) return { html: empty('🤷', 'Unknown source', 'That source does not exist.') };
    const ideas = PAL.bySource[id] || [];
    const readN = ideas.filter(i => Store.isRead(i.id)).length;
    const t = PAL.topicMap[s.topic];
    const next = ideas.findIndex(i => !Store.isRead(i.id));

    return {
      html: `<div class="wrap">
        <div class="rowline" style="margin-bottom:8px">
          <span class="tag tag-topic">${t.emoji} ${esc(t.name)}</span>
          <span class="tag">${s.kind === 'book' ? 'Book' : 'Study guide'}</span>
        </div>
        ${pageHead(s.title, s.author + ' — ' + s.blurb)}

        <div class="rowline" style="margin-bottom:26px; flex-wrap:wrap; gap:14px">
          <button class="btn btn-primary btn-lg" data-act="start">${ico('book')}${readN ? (readN < ideas.length ? 'Continue' : 'Read again') : 'Start reading'}</button>
          <button class="btn btn-ghost" data-act="srs-all">${ico('brain')}Add all to review</button>
          <div class="bar" style="flex:1; min-width:160px; margin:0"><i style="width:${ideas.length ? readN / ideas.length * 100 : 0}%"></i></div>
          <span class="muted">${readN}/${ideas.length}</span>
        </div>

        <div class="sec">
          ${ideas.map((i, n) => `<div class="list-item" data-id="${i.id}" data-act="open">
              <span class="n">${String(n + 1).padStart(2, '0')}</span>
              <div style="flex:1; min-width:0">
                <h4>${esc(i.title)}</h4><p>${esc(i.body)}</p>
              </div>
              ${Store.isRead(i.id) ? `<span class="icon-btn on">${ico('check')}</span>` : ''}
            </div>`).join('')}
        </div>
      </div>`,
      ids: ideas.map(i => i.id),
      startAt: next < 0 ? 0 : next
    };
  };
  V.source.actions = {
    start(el, ctx) { App.openReader(ctx.ids, ctx.startAt || 0); },
    'srs-all'(el, ctx) {
      let n = 0;
      ctx.ids.forEach(id => { if (SRS.add(id)) n++; });
      UI.toast(n ? n + ' ideas added to review' : 'Already in your review queue');
      App.render();
    }
  };

  /* ====================================================================== */
  /* REVIEW                                                                  */
  /* ====================================================================== */
  let revQueue = null, revIndex = 0, revShown = false;

  V.review = function () {
    const c = SRS.counts();

    if (!c.total) {
      return { html: `<div class="wrap read">${pageHead('Review', 'Spaced repetition over everything you have chosen to keep.')}
        ${empty('🧠', 'Nothing in your review queue yet',
          'Tap the brain icon on any idea to schedule it. Cards come back just before you would forget them.')}
        <div style="text-align:center"><a class="btn btn-primary" href="#/explore">${ico('explore')}Find something to learn</a></div>
      </div>` };
    }

    if (!revQueue || !revQueue.length) revQueue = SRS.due();

    if (!revQueue.length) {
      const nextDue = Object.values(Store.state.srs).map(x => x.due).sort((a, b) => a - b)[0];
      return { html: `<div class="wrap read">${pageHead('Review', 'All caught up.')}
        ${empty('✅', 'Nothing due right now',
          'Next card ' + dueIn(nextDue) + '. ' + c.mature + ' mature, ' + c.learning + ' still learning.')}
        <div style="text-align:center"><a class="btn btn-ghost" href="#/feed">${ico('feed')}Back to the feed</a></div>
      </div>` };
    }

    if (revIndex >= revQueue.length) { revQueue = SRS.due(); revIndex = 0; revShown = false; }
    const idea = revQueue[revIndex];
    if (!idea) { revQueue = null; return V.review(); }

    const card = SRS.card(idea);
    const p = SRS.preview(idea.id);
    const s = srcOf(idea);

    return {
      html: `<div class="wrap read">
        <div class="rowline" style="margin-bottom:18px">
          <span class="muted">${revIndex + 1} of ${revQueue.length} due</span>
          <span class="muted" style="margin-left:auto">${c.mature} mature · ${c.learning} learning</span>
        </div>

        <div class="rev-card">
          <div>
            <div class="muted" style="font-size:12.5px; margin-bottom:14px">${esc(s ? s.title : 'My note')}</div>
            <div class="rev-q">${revShown ? card.revealed : card.prompt}</div>
            ${revShown ? `<div class="rev-a">
                <p style="margin:0 0 10px">${esc(card.answer)}</p>
                ${idea.clinical ? `<div class="clin" style="margin-top:12px"><b>Why it matters</b>${esc(idea.clinical)}</div>` : ''}
                ${idea.mnemonic ? `<div class="mnem">${esc(idea.mnemonic)}</div>` : ''}
              </div>` : ''}
          </div>
        </div>

        ${revShown
          ? `<div class="rev-grade">
              <button class="g1" data-act="grade" data-g="1">Again<small>${p[1]}</small></button>
              <button class="g2" data-act="grade" data-g="2">Hard<small>${p[2]}</small></button>
              <button class="g3" data-act="grade" data-g="3">Good<small>${p[3]}</small></button>
              <button class="g4" data-act="grade" data-g="4">Easy<small>${p[4]}</small></button>
            </div>
            <p class="kbd-hint" style="text-align:center; margin-top:12px">1 · 2 · 3 · 4 to grade</p>`
          : `<div style="text-align:center; margin-top:18px">
              <button class="btn btn-primary btn-lg" data-act="show">Show answer</button>
              <p class="kbd-hint" style="margin-top:12px">space to reveal</p>
            </div>`}

        <div style="text-align:center; margin-top:22px">
          <button class="btn btn-ghost btn-sm" data-act="drop">${ico('trash')}Remove this card</button>
        </div>
      </div>`
    };
  };

  V.review.actions = {
    show() { revShown = true; App.render(); },
    grade(el) {
      const idea = revQueue[revIndex];
      SRS.grade(idea.id, Number(el.dataset.g));
      if (Number(el.dataset.g) === 1) {
        // keep it in this session, at the back of the queue
        revQueue.push(idea);
      }
      revIndex++; revShown = false;
      App.render();
    },
    drop() {
      const idea = revQueue[revIndex];
      SRS.remove(idea.id);
      revQueue.splice(revIndex, 1); revShown = false;
      UI.toast('Removed from review');
      App.render();
    }
  };
  V.review.reset = function () { revQueue = null; revIndex = 0; revShown = false; };

  /* ====================================================================== */
  /* STASH                                                                   */
  /* ====================================================================== */
  let stashTab = 'saved';

  V.stash = function () {
    const st = Store.state;
    const saved = Object.keys(st.saved).map(findIdea).filter(Boolean)
      .sort((a, b) => st.saved[b.id].at - st.saved[a.id].at);
    const liked = Object.keys(st.liked).map(findIdea).filter(Boolean)
      .sort((a, b) => st.liked[b.id] - st.liked[a.id]);
    const mine = st.notes;

    const tabs = [
      ['saved', 'Saved', saved.length],
      ['mine', 'My notes', mine.length],
      ['liked', 'Liked', liked.length],
      ['collections', 'Collections', st.collections.length]
    ].map(([k, label, n]) =>
      `<button class="chip${stashTab === k ? ' on' : ''}" data-act="tab" data-tab="${k}">${label} · ${n}</button>`
    ).join('');

    let body = '', ids = [];

    if (stashTab === 'saved') {
      ids = saved.map(i => i.id);
      body = saved.length
        ? `<div class="grid">${saved.map(i => ideaCard(i)).join('')}</div>`
        : empty('🔖', 'Nothing saved yet', 'Tap the bookmark on any idea to keep it here.');
    } else if (stashTab === 'liked') {
      ids = liked.map(i => i.id);
      body = liked.length
        ? `<div class="grid">${liked.map(i => ideaCard(i)).join('')}</div>`
        : empty('❤️', 'No likes yet', 'Likes are a lighter signal than saving — use them freely.');
    } else if (stashTab === 'mine') {
      ids = mine.map(i => i.id);
      body = (mine.length
        ? `<div class="grid">${mine.map(i => ideaCard(i)).join('')}</div>`
        : empty('📝', 'No notes of your own yet', 'Your own ideas sit alongside the library and go into review the same way.'))
        + `<div style="text-align:center; margin-top:24px">
             <button class="btn btn-primary" data-act="new">${ico('plus')}Write an idea</button></div>`;
    } else {
      body = (st.collections.length
        ? st.collections.map(c => {
            const items = c.ideaIds.map(findIdea).filter(Boolean);
            return `<section class="sec">
              <div class="sec-head">
                <h2>${esc(c.name)}</h2><span class="muted">${items.length} ideas</span>
                <span class="more" data-act="del-collection" data-cid="${c.id}">Delete</span>
              </div>
              ${items.length ? `<div class="grid">${items.map(i => ideaCard(i)).join('')}</div>`
                             : '<p class="muted">Empty — open any idea and use “Add to collection”.</p>'}
            </section>`;
          }).join('')
        : empty('🗂️', 'No collections yet', 'Group ideas into your own themed sets — exam topics, projects, whatever.'))
        + `<div style="text-align:center; margin-top:24px">
             <button class="btn btn-primary" data-act="new-collection">${ico('plus')}New collection</button></div>`;
    }

    return {
      html: `<div class="wrap">
        ${pageHead('My Stash', 'Everything you kept, wrote, or grouped. Stored on this device only.')}
        <div class="chips scroll" style="margin-bottom:22px">${tabs}</div>
        ${body}
      </div>`,
      ids: ids
    };
  };

  V.stash.actions = {
    tab(el) { stashTab = el.dataset.tab; App.render(); },
    new() { App.newIdeaModal(); },
    'new-collection'() {
      UI.modal(`<h2>New collection</h2><p class="muted">A named set you can add any idea to.</p>
        <label class="field"><span>Name</span><input id="cname" placeholder="e.g. Cardio exam, Social skills"></label>
        <div class="modal-foot"><button class="btn btn-ghost" data-act="close">Cancel</button>
        <button class="btn btn-primary" data-act="save-collection">Create</button></div>`);
    },
    'save-collection'() {
      const v = document.getElementById('cname').value.trim();
      if (!v) return UI.toast('Give it a name');
      Store.addCollection(v); UI.closeModal(); App.render(); UI.toast('Collection created');
    },
    'del-collection'(el) {
      Store.deleteCollection(el.dataset.cid); App.render(); UI.toast('Collection deleted');
    }
  };

  /* ====================================================================== */
  /* PATHS                                                                   */
  /* ====================================================================== */
  function pathProgress(p) {
    let total = 0, read = 0;
    p.sources.forEach(sid => {
      const list = PAL.bySource[sid] || [];
      total += list.length;
      read += list.filter(i => Store.isRead(i.id)).length;
    });
    return { total, read, pct: total ? Math.round(read / total * 100) : 0 };
  }

  V.paths = function () {
    return {
      html: `<div class="wrap">
        ${pageHead('Paths', 'Ordered curricula. Finish one and you genuinely own that territory.')}
        <div class="grid grid-2">
          ${PAL.paths.map(p => {
            const pr = pathProgress(p);
            return `<a class="tile" href="#/path/${p.id}">
              <span class="emoji">${p.emoji}</span>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.blurb)}</p>
              <div class="bar"><i style="width:${pr.pct}%"></i></div>
              <div class="meta">${p.sources.length} sources · ${pr.read}/${pr.total} ideas · ${pr.pct}%</div>
            </a>`;
          }).join('')}
        </div>
      </div>`
    };
  };

  V.path = function (id) {
    const p = PAL.paths.find(x => x.id === id);
    if (!p) return { html: empty('🤷', 'Unknown path', 'That path does not exist.') };
    const pr = pathProgress(p);
    let allIds = [];
    p.sources.forEach(sid => { allIds = allIds.concat((PAL.bySource[sid] || []).map(i => i.id)); });
    const next = allIds.findIndex(i => !Store.isRead(i));

    return {
      html: `<div class="wrap">
        ${pageHead(p.emoji + '  ' + p.name, p.blurb)}
        <div class="rowline" style="margin-bottom:26px; gap:14px; flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" data-act="start">${ico('book')}${pr.read ? 'Continue path' : 'Start path'}</button>
          <div class="bar" style="flex:1; min-width:160px; margin:0"><i style="width:${pr.pct}%"></i></div>
          <span class="muted">${pr.read}/${pr.total} ideas · ${pr.pct}%</span>
        </div>

        <div class="sec">
          ${p.sources.map((sid, n) => {
            const s = PAL.sourceMap[sid];
            const list = PAL.bySource[sid] || [];
            const rd = list.filter(i => Store.isRead(i.id)).length;
            const pct = list.length ? Math.round(rd / list.length * 100) : 0;
            return `<a class="list-item" href="#/source/${sid}">
              <span class="n">${n + 1}</span>
              <div style="flex:1; min-width:0">
                <h4>${esc(s.title)}</h4>
                <p>${esc(s.author)} — ${esc(s.blurb)}</p>
                <div class="bar" style="max-width:220px"><i style="width:${pct}%"></i></div>
              </div>
              <span class="muted" style="font-family:var(--mono); font-size:12px">${rd}/${list.length}</span>
            </a>`;
          }).join('')}
        </div>
      </div>`,
      ids: allIds,
      startAt: next < 0 ? 0 : next
    };
  };
  V.path.actions = {
    start(el, ctx) { App.openReader(ctx.ids, ctx.startAt || 0); }
  };

  /* ====================================================================== */
  /* STATS                                                                   */
  /* ====================================================================== */
  V.stats = function () {
    const st = Store.state;
    const streak = Store.streak();
    const readN = Object.keys(st.read).length;
    const total = PAL.ideas.length;
    const c = SRS.counts();

    /* heatmap: last 26 weeks */
    const cells = [];
    const start = new Date();
    start.setDate(start.getDate() - (26 * 7 - 1));
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < 26 * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const k = Store.dayKey(d);
      const a = st.activity[k] || {};
      const n = (a.read || 0) + (a.reviewed || 0);
      const lvl = n === 0 ? 0 : n < 4 ? 1 : n < 9 ? 2 : n < 16 ? 3 : 4;
      cells.push(`<i data-l="${lvl}" title="${k}: ${n}"></i>`);
    }

    /* coverage per realm */
    const cov = PAL.topics.map(t => {
      const list = PAL.byTopic[t.id] || [];
      const rd = list.filter(i => Store.isRead(i.id)).length;
      return { t, rd, n: list.length, pct: list.length ? rd / list.length * 100 : 0 };
    }).sort((a, b) => b.pct - a.pct);

    const weakest = cov.slice(-3).reverse();

    return {
      html: `<div class="wrap">
        ${pageHead('Progress', 'Where you actually are — and, more usefully, where you are not.')}

        <div class="grid grid-3" style="margin-bottom:32px">
          <div class="stat"><b>${streak.current}</b><span>day streak · longest ${streak.longest}</span></div>
          <div class="stat"><b>${readN}</b><span>ideas read of ${total}</span></div>
          <div class="stat"><b>${Object.keys(st.saved).length}</b><span>saved to stash</span></div>
          <div class="stat"><b>${c.total}</b><span>cards in review · ${c.mature} mature</span></div>
          <div class="stat"><b>${st.notes.length}</b><span>ideas you wrote</span></div>
          <div class="stat"><b>${Math.round(readN / total * 100)}%</b><span>of the library</span></div>
        </div>

        <section class="sec">
          <div class="sec-head"><h2>Activity</h2><span class="muted">last 26 weeks</span></div>
          <div class="card"><div class="heat">${cells.join('')}</div></div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Coverage by realm</h2><span class="muted">read / total</span></div>
          <div class="card">
            ${cov.map(r => `<div class="cov-row">
              <span class="nm">${r.t.emoji} ${esc(r.t.name)}</span>
              <span class="bar"><i style="width:${r.pct}%"></i></span>
              <span class="pc">${r.rd}/${r.n}</span>
            </div>`).join('')}
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Your blind spots</h2></div>
          <div class="grid grid-3">
            ${weakest.map(r => `<a class="tile" href="#/topic/${r.t.id}">
              <span class="emoji">${r.t.emoji}</span>
              <h3>${esc(r.t.name)}</h3>
              <p>${r.rd} of ${r.n} read — the thinnest part of your map.</p>
              <div class="meta">Open realm →</div>
            </a>`).join('')}
          </div>
        </section>
      </div>`
    };
  };

  /* ====================================================================== */
  /* SEARCH                                                                  */
  /* ====================================================================== */
  V.search = function (qRaw) {
    const q = (qRaw || '').toLowerCase().trim();
    if (q.length < 2) {
      return { html: `<div class="wrap">${pageHead('Search', 'Type at least two characters.')}</div>` };
    }
    const terms = q.split(/\s+/);
    const hits = allIdeas().filter(i => {
      const blob = i._blob || (i.title + ' ' + i.body + ' ' + (i.tags || []).join(' ')).toLowerCase();
      return terms.every(t => blob.indexOf(t) >= 0);
    }).slice(0, 60);

    return {
      html: `<div class="wrap">
        ${pageHead('“' + qRaw + '”', hits.length + ' matching idea' + (hits.length === 1 ? '' : 's'))}
        ${hits.length ? `<div class="grid">${hits.map(i => ideaCard(i)).join('')}</div>`
                      : empty('🔍', 'Nothing found', 'Try a broader term, or a tag like “dopamine”, “tendon”, “bias”.')}
      </div>`,
      ids: hits.map(i => i.id)
    };
  };

  /* ====================================================================== */
  /* REFERENCES                                                              */
  /* ====================================================================== */
  V.refs = function () {
    const cited = PAL.ideas.filter(i => i.ref);
    const byKey = {};
    cited.forEach(i => { (byKey[i.ref] = byKey[i.ref] || []).push(i); });

    return {
      html: `<div class="wrap">
        ${pageHead('References', 'Where all of this comes from. ' + PAL.sources.length +
          ' sources, each written from a named reference work; specific empirical claims carry a primary citation.')}

        <div class="card" style="margin-bottom:32px">
          <p style="margin-top:0">Study guides are original explainers written from the standard textbooks and
          guidelines listed below. Book entries are original summaries of the ideas in those books — not quotations.
          Where an idea states a specific number or trial result, it carries a <span class="tag tag-ref">cited</span>
          marker and the paper is named in full, with a DOI link and PubMed ID.</p>
          <p class="muted" style="margin-bottom:0; font-size:13.5px">Citations below were checked against PubMed.
          The medical content is a revision aid, not clinical guidance.</p>
        </div>

        <section class="sec">
          <div class="sec-head"><h2>Primary citations</h2><span class="muted">${Object.keys(PAL.refs).length} papers · ${cited.length} ideas</span></div>
          ${Object.keys(PAL.refs).map(k => {
            const r = PAL.refs[k];
            const ideas = byKey[k] || [];
            return `<div class="card" style="margin-bottom:12px">
              <cite style="display:block; font-weight:600; color:var(--fg-1); font-style:normal">${esc(r.text)}</cite>
              <p style="margin:6px 0 10px; font-size:13.5px; color:var(--fg-3)">${esc(r.note)}</p>
              <a class="ref" style="display:inline-block; padding:6px 12px; margin:0; font-family:var(--mono); font-size:12px; color:var(--primary-hi)"
                 href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener noreferrer">doi.org/${esc(r.doi)}</a>
              <span class="muted" style="font-family:var(--mono); font-size:12px"> · PMID ${esc(r.pmid)}</span>
              ${ideas.length ? `<div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--divider)">
                ${ideas.map(i => `<div class="list-item" data-id="${i.id}" data-act="open" style="padding:7px 0; border:none">
                  <div style="flex:1; min-width:0"><h4>${esc(i.title)}</h4></div></div>`).join('')}
              </div>` : ''}
            </div>`;
          }).join('')}
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Reference basis by source</h2><span class="muted">${PAL.sources.length} sources</span></div>
          ${PAL.topics.map(t => `<div class="card" style="margin-bottom:12px">
            <h3 style="font-size:16px; margin-bottom:10px">${t.emoji} ${esc(t.name)}</h3>
            ${t.sources.map(s => `<div style="padding:8px 0; border-top:1px solid var(--divider)">
              <a href="#/source/${s.id}" style="font-weight:600; color:var(--fg-1); font-size:14.5px">${esc(s.title)}</a>
              <div class="muted" style="font-size:13px; margin-top:2px">${esc(s.ref || '—')}</div>
            </div>`).join('')}
          </div>`).join('')}
        </section>
      </div>`,
      ids: cited.map(i => i.id)
    };
  };

  /* ====================================================================== */
  /* SETTINGS                                                                */
  /* ====================================================================== */
  V.settings = function () {
    const st = Store.state;
    return {
      html: `<div class="wrap read">
        ${pageHead('Settings', 'Everything here lives in this browser. No account, no server, no sync.')}

        <section class="sec">
          <div class="sec-head"><h2>Daily goal</h2></div>
          <div class="card">
            <p class="muted" style="margin-top:0">Ideas read or reviewed per day to keep your streak.</p>
            <div class="chips">
              ${[3, 5, 7, 10, 15, 20].map(n =>
                `<button class="chip${st.dailyGoal === n ? ' on' : ''}" data-act="goal" data-n="${n}">${n} a day</button>`).join('')}
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Appearance</h2></div>
          <div class="card">
            <div class="chips">
              <button class="chip${st.theme === 'dark' ? ' on' : ''}" data-act="theme" data-v="dark">Dark</button>
              <button class="chip${st.theme === 'light' ? ' on' : ''}" data-act="theme" data-v="light">Light</button>
            </div>
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>Your data</h2></div>
          <div class="card">
            <p class="muted" style="margin-top:0">
              Your reading history, notes and review schedule are stored in this browser's local storage.
              Clearing site data — or using a different browser or device — starts you from scratch,
              so export a backup regularly.
            </p>
            <div class="chips">
              <button class="btn btn-ghost btn-sm" data-act="export">${ico('download')}Export backup</button>
              <button class="btn btn-ghost btn-sm" data-act="import">${ico('upload')}Import backup</button>
              <button class="btn btn-ghost btn-sm" data-act="reset" style="color:var(--danger)">${ico('trash')}Reset everything</button>
            </div>
            <input type="file" id="import-file" accept="application/json,.json" hidden>
          </div>
        </section>

        <section class="sec">
          <div class="sec-head"><h2>About</h2></div>
          <div class="card">
            <p style="margin-top:0"><strong>Stacks</strong> — a private knowledge app built for one reader.
            ${PAL.ideas.length} ideas across ${PAL.topics.length} realms and ${PAL.sources.length} sources.</p>
            <p class="muted" style="font-size:13.5px">
              Book entries are original summaries of the ideas in those works, written for study — not quotations
              or replacements for reading them. Medical content is a revision aid for someone studying the
              subject; it is not clinical guidance and must not be used to make decisions about a real patient.
            </p>
            <a class="btn btn-ghost btn-sm" href="#/refs">${ico('book')}Sources &amp; references</a>
          </div>
        </section>
      </div>`
    };
  };

  V.settings.actions = {
    goal(el) { Store.state.dailyGoal = Number(el.dataset.n); Store.save(); App.render(); },
    theme(el) { App.setTheme(el.dataset.v); App.render(); },
    export() {
      const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'stacks-backup-' + Store.today() + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      UI.toast('Backup downloaded');
    },
    import() {
      const inp = document.getElementById('import-file');
      inp.onchange = () => {
        const f = inp.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
          try {
            Store.importJSON(r.result);
            App.setTheme(Store.state.theme);
            App.render();
            UI.toast('Backup restored');
          } catch (e) { UI.toast('That file could not be read'); }
        };
        r.readAsText(f);
      };
      inp.click();
    },
    reset() {
      UI.modal(`<h2>Reset everything?</h2>
        <p class="muted">This deletes your reading history, saved ideas, notes and review schedule from this
        browser. It cannot be undone — export a backup first if you are not sure.</p>
        <div class="modal-foot">
          <button class="btn btn-ghost" data-act="close">Cancel</button>
          <button class="btn" style="background:var(--danger); color:#fff" data-act="reset-confirm">Delete everything</button>
        </div>`);
    },
    'reset-confirm'() {
      Store.reset(); UI.closeModal(); V.review.reset(); App.render(); UI.toast('Reset complete');
    }
  };

  window.Views = V;
})();
