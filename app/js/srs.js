/* ==========================================================================
   srs.js — spaced repetition (SM-2 variant) over ideas you have added to
   review. Intervals in days; due stored as a timestamp.
   ========================================================================== */
(function () {
  'use strict';

  const DAY = 86400000;

  const SRS = {
    /** Add an idea to the review queue, due immediately. */
    add(ideaId) {
      const s = Store.state;
      if (s.srs[ideaId]) return false;
      s.srs[ideaId] = { ease: 2.5, interval: 0, due: Date.now(), reps: 0, lapses: 0, last: null };
      Store.save();
      return true;
    },

    remove(ideaId) {
      delete Store.state.srs[ideaId];
      Store.save();
    },

    toggle(ideaId) {
      if (Store.state.srs[ideaId]) { SRS.remove(ideaId); return false; }
      SRS.add(ideaId); return true;
    },

    /**
     * Grade a review.
     * 1 = again, 2 = hard, 3 = good, 4 = easy
     */
    grade(ideaId, g) {
      const s = Store.state;
      const c = s.srs[ideaId];
      if (!c) return null;

      if (g === 1) {
        c.lapses++;
        c.reps = 0;
        c.interval = 0;
        c.ease = Math.max(1.3, c.ease - 0.2);
        c.due = Date.now() + 10 * 60000;      // 10 minutes — same session
      } else {
        c.reps++;
        if (g === 2)      c.ease = Math.max(1.3, c.ease - 0.15);
        else if (g === 4) c.ease = Math.min(3.2, c.ease + 0.1);

        if (c.reps === 1)      c.interval = g === 2 ? 1 : (g === 4 ? 3 : 1);
        else if (c.reps === 2) c.interval = g === 2 ? 3 : (g === 4 ? 8 : 6);
        else {
          const mult = g === 2 ? 1.2 : (g === 4 ? c.ease * 1.25 : c.ease);
          c.interval = Math.round(c.interval * mult);
        }
        c.interval = Math.min(c.interval, 365);
        // ±8% fuzz so large decks do not clump on one day
        const fuzz = 1 + (Math.random() * 0.16 - 0.08);
        c.due = Date.now() + Math.max(1, Math.round(c.interval * fuzz)) * DAY;
      }

      c.last = Date.now();
      Store.bump('reviewed');
      Store.save();
      return c;
    },

    /** Ideas due now, hardest-first. */
    due() {
      const s = Store.state, now = Date.now(), out = [];
      Object.keys(s.srs).forEach(id => {
        if (s.srs[id].due <= now) {
          const idea = PAL.ideaMap[id] || s.notes.find(n => n.id === id);
          if (idea) out.push(idea);
        }
      });
      out.sort((a, b) => (s.srs[a.id].ease - s.srs[b.id].ease) || (s.srs[a.id].due - s.srs[b.id].due));
      return out;
    },

    counts() {
      const s = Store.state, now = Date.now();
      let due = 0, learning = 0, mature = 0;
      Object.keys(s.srs).forEach(id => {
        const c = s.srs[id];
        if (c.due <= now) due++;
        if (c.interval >= 21) mature++; else learning++;
      });
      return { due: due, total: Object.keys(s.srs).length, learning: learning, mature: mature };
    },

    /** Human-friendly preview of the next interval for each grade button. */
    preview(ideaId) {
      const c = Store.state.srs[ideaId];
      if (!c) return { 1: '10m', 2: '1d', 3: '1d', 4: '3d' };
      const fmt = d => d < 1 ? '10m' : (d < 30 ? Math.round(d) + 'd' : (d / 30).toFixed(1) + 'mo');
      const next = g => {
        if (g === 1) return 0;
        if (c.reps === 0) return g === 2 ? 1 : (g === 4 ? 3 : 1);
        if (c.reps === 1) return g === 2 ? 3 : (g === 4 ? 8 : 6);
        const mult = g === 2 ? 1.2 : (g === 4 ? c.ease * 1.25 : c.ease);
        return Math.min(365, Math.round(c.interval * mult));
      };
      return { 1: '10m', 2: fmt(next(2)), 3: fmt(next(3)), 4: fmt(next(4)) };
    },

    /**
     * Build a question from an idea:
     *  - explicit cloze in `q` (with {{...}}) is preferred
     *  - otherwise the title becomes the prompt and the body the answer
     */
    card(idea) {
      if (idea.q && idea.q.indexOf('{{') >= 0) {
        return {
          prompt: idea.q.replace(/\{\{(.+?)\}\}/g, '<span class="cloze">[ ? ]</span>'),
          revealed: idea.q.replace(/\{\{(.+?)\}\}/g, '<span class="cloze">$1</span>'),
          answer: idea.a || idea.body,
          type: 'cloze'
        };
      }
      return {
        prompt: idea.title,
        revealed: idea.title,
        answer: idea.a || idea.body,
        type: 'recall'
      };
    }
  };

  window.SRS = SRS;
})();
