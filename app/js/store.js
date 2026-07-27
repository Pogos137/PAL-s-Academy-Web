/* ==========================================================================
   store.js — all user state, persisted to localStorage. Nothing leaves the
   device. Export/import is a plain JSON file.
   ========================================================================== */
(function () {
  'use strict';

  const KEY = 'pal.stacks.v1';
  const VERSION = 1;

  const blank = () => ({
    version: VERSION,
    createdAt: Date.now(),
    read:      {},   // ideaId -> timestamp
    saved:     {},   // ideaId -> { at, note }
    liked:     {},   // ideaId -> timestamp
    srs:       {},   // ideaId -> { ease, interval, due, reps, lapses, last }
    notes:     [],   // user-authored ideas
    collections: [], // { id, name, ideaIds[] }
    activity:  {},   // 'YYYY-MM-DD' -> { read, reviewed }
    dailyGoal: 7,
    theme:     'dark',
    feedMode:  'reels',   // 'reels' (default) or 'list'
    lastSeen:  null,
    feedSeed:  Math.floor(Math.random() * 1e9)
  });

  let state = blank();
  let saveTimer = null;

  const Store = {
    /* ------------------------------------------------------------ lifecycle */
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          state = Object.assign(blank(), parsed);
          // guard against partially-written objects
          ['read', 'saved', 'liked', 'srs', 'activity'].forEach(k => {
            if (!state[k] || typeof state[k] !== 'object') state[k] = {};
          });
          ['notes', 'collections'].forEach(k => {
            if (!Array.isArray(state[k])) state[k] = [];
          });
        }
      } catch (e) {
        console.warn('[PAL] could not read saved data, starting fresh', e);
      }
      return state;
    },

    save() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(KEY, JSON.stringify(state));
        } catch (e) {
          console.error('[PAL] save failed — storage may be full', e);
        }
      }, 120);
    },

    get state() { return state; },

    /* ----------------------------------------------------------- date utils */
    today() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
             '-' + String(d.getDate()).padStart(2, '0');
    },
    dayKey(date) {
      return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') +
             '-' + String(date.getDate()).padStart(2, '0');
    },

    bump(kind) {
      const k = Store.today();
      const a = state.activity[k] || (state.activity[k] = { read: 0, reviewed: 0 });
      a[kind] = (a[kind] || 0) + 1;
      Store.save();
    },

    /* --------------------------------------------------------------- idea IO */
    isRead(id)  { return !!state.read[id]; },
    isSaved(id) { return !!state.saved[id]; },
    isLiked(id) { return !!state.liked[id]; },
    inReview(id) { return !!state.srs[id]; },

    markRead(id) {
      if (state.read[id]) return false;
      state.read[id] = Date.now();
      Store.bump('read');
      return true;
    },
    unmarkRead(id) { delete state.read[id]; Store.save(); },

    toggleSave(id) {
      if (state.saved[id]) { delete state.saved[id]; }
      else { state.saved[id] = { at: Date.now(), note: '' }; }
      Store.save();
      return !!state.saved[id];
    },
    toggleLike(id) {
      if (state.liked[id]) delete state.liked[id];
      else state.liked[id] = Date.now();
      Store.save();
      return !!state.liked[id];
    },
    setNote(id, text) {
      if (!state.saved[id]) state.saved[id] = { at: Date.now(), note: '' };
      state.saved[id].note = text;
      Store.save();
    },

    /* ---------------------------------------------------------- user ideas */
    addNote(obj) {
      const note = Object.assign({
        id: 'my-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        title: '', body: '', topic: 'learning', tags: [], sourceId: null,
        createdAt: Date.now(), mine: true
      }, obj);
      state.notes.unshift(note);
      Store.save();
      return note;
    },
    updateNote(id, patch) {
      const n = state.notes.find(x => x.id === id);
      if (n) { Object.assign(n, patch); Store.save(); }
      return n;
    },
    deleteNote(id) {
      state.notes = state.notes.filter(n => n.id !== id);
      delete state.saved[id]; delete state.srs[id]; delete state.read[id];
      Store.save();
    },

    /* --------------------------------------------------------- collections */
    addCollection(name) {
      const c = { id: 'c-' + Date.now().toString(36), name: name, ideaIds: [] };
      state.collections.push(c);
      Store.save();
      return c;
    },
    renameCollection(id, name) {
      const c = state.collections.find(x => x.id === id);
      if (c) { c.name = name; Store.save(); }
    },
    deleteCollection(id) {
      state.collections = state.collections.filter(c => c.id !== id);
      Store.save();
    },
    toggleInCollection(cid, ideaId) {
      const c = state.collections.find(x => x.id === cid);
      if (!c) return false;
      const i = c.ideaIds.indexOf(ideaId);
      if (i >= 0) c.ideaIds.splice(i, 1); else c.ideaIds.push(ideaId);
      Store.save();
      return i < 0;
    },

    /* -------------------------------------------------------------- streak */
    streak() {
      const days = Object.keys(state.activity).filter(k => {
        const a = state.activity[k];
        return (a.read || 0) + (a.reviewed || 0) > 0;
      });
      if (!days.length) return { current: 0, longest: 0 };
      const set = new Set(days);

      // current streak: walk backwards from today (or yesterday if today idle)
      let cur = 0;
      const d = new Date();
      if (!set.has(Store.dayKey(d))) d.setDate(d.getDate() - 1);
      while (set.has(Store.dayKey(d))) { cur++; d.setDate(d.getDate() - 1); }

      // longest streak
      const sorted = days.slice().sort();
      let longest = 1, run = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1] + 'T00:00:00');
        prev.setDate(prev.getDate() + 1);
        run = (Store.dayKey(prev) === sorted[i]) ? run + 1 : 1;
        if (run > longest) longest = run;
      }
      return { current: cur, longest: Math.max(longest, cur) };
    },

    todayCount() {
      const a = state.activity[Store.today()] || {};
      return (a.read || 0) + (a.reviewed || 0);
    },

    /* ------------------------------------------------------- export/import */
    exportJSON() {
      return JSON.stringify(state, null, 2);
    },
    importJSON(text) {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') throw new Error('Not a Stacks backup file');
      state = Object.assign(blank(), parsed);
      Store.save();
      return state;
    },
    reset() {
      state = blank();
      localStorage.removeItem(KEY);
      Store.save();
    }
  };

  window.Store = Store;
})();
