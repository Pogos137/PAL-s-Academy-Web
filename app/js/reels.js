/* ==========================================================================
   reels.js — full-screen vertical short-form player, plus real video export.
   Every idea is decomposed into timed "beats" and played like a captioned
   short. The same beat script drives the canvas recorder, so what you export
   is what you watched.
   ========================================================================== */
(function () {
  'use strict';

  const ico = n => window.PALIcons.svg(n);
  const esc = s => UI.esc(s);

  /* per-realm background palette (two blurred blobs over near-black) */
  const PALETTE = {
    medicine:   ['#1D6655', '#8C2F3A'], anatomy:    ['#2B5F8A', '#7E5F15'],
    physiology: ['#8C2F3A', '#1D6655'], kinesiology:['#3F8472', '#A77E1F'],
    nutrition:  ['#5B7A2E', '#C99A2A'], recovery:   ['#2E3A78', '#1D6655'],
    neuro:      ['#5B3A82', '#2B5F8A'], learning:   ['#1D6655', '#3F5E8A'],
    habits:     ['#7E5F15', '#34503F'], influence:  ['#7A2F5E', '#8A4B2B'],
    philosophy: ['#3A4A55', '#7E5F15'], money:      ['#2E6B4F', '#A77E1F'],
    thinking:   ['#2B4F8A', '#5B3A82'], craft:      ['#8A4B2B', '#C99A2A'],
    history:    ['#6E5A3A', '#3F5E5A'], science:    ['#1F6A72', '#4A6B2E']
  };
  const paletteFor = t => PALETTE[t] || ['#1D6655', '#C99A2A'];

  /* ---------------------------------------------------------------- beats */
  const WPS = 2.6;                        // reading pace, words per second
  const dur = text => Math.min(7, Math.max(2.4, text.trim().split(/\s+/).length / WPS));

  function sentences(body) {
    const raw = String(body || '').split(/(?<=[.!?])\s+(?=[A-Z“"(])/);
    const out = [];
    raw.forEach(s => {
      s = s.trim();
      if (!s) return;
      const prev = out[out.length - 1];
      // glue very short fragments onto the previous beat
      if (prev && (s.split(/\s+/).length < 6 || prev.split(/\s+/).length < 7)) {
        out[out.length - 1] = prev + ' ' + s;
      } else out.push(s);
    });
    return out.length ? out : [String(body || '')];
  }

  /** Decompose an idea into the beat script used by both player and recorder. */
  function beats(idea) {
    const src = idea.sourceId ? PAL.sourceMap[idea.sourceId] : null;
    const list = [{ kind: 'hook', text: idea.title }];
    sentences(idea.body).forEach(t => list.push({ kind: 'body', text: t }));
    if (idea.clinical) list.push({ kind: 'clin', label: 'Why it matters', text: idea.clinical });
    if (idea.mnemonic) list.push({ kind: 'mnem', label: 'Remember it', text: idea.mnemonic });
    if (idea.q) {
      list.push({
        kind: 'quiz', label: 'Quick check',
        text: idea.q.replace(/\{\{(.+?)\}\}/g, '____'),
        answer: idea.a || null
      });
    }
    const cite = idea.ref ? PAL.refs[idea.ref] : null;
    list.push({
      kind: 'source',
      text: (src ? src.title + (src.kind === 'book' ? ' — ' + src.author : '') : 'My note') +
            (cite ? '\n' + cite.text : '')
    });
    list.forEach(b => {
      b.seconds = dur(b.text + (b.answer ? ' ' + b.answer : ''));
      if (b.kind === 'hook') b.seconds = Math.max(b.seconds, 2.8);
      if (b.kind === 'quiz') b.seconds = Math.max(b.seconds, 4.5);
      if (b.kind === 'source') b.seconds = 3;
    });
    return list;
  }

  /* --------------------------------------------------------------- markup */
  function beatHTML(b) {
    if (b.kind === 'quiz') {
      return `${b.label ? `<span class="reel-label quiz">${esc(b.label)}</span>` : ''}
        <p class="reel-text k-quiz">${esc(b.text).replace(/____/g, '<span class="blank">&nbsp;?&nbsp;</span>')}
        ${b.answer ? `<span class="answer">${esc(b.answer)}</span>` : ''}</p>`;
    }
    if (b.kind === 'clin' || b.kind === 'mnem') {
      return `<span class="reel-label ${b.kind}">${esc(b.label)}</span>
              <p class="reel-text k-${b.kind}">${esc(b.text)}</p>`;
    }
    return `<p class="reel-text k-${b.kind}">${esc(b.text).replace(/\n/g, '<br>')}</p>`;
  }

  function reelHTML(idea, index) {
    const t = UI.topicOf(idea);
    const src = idea.sourceId ? PAL.sourceMap[idea.sourceId] : null;
    const [a, b] = paletteFor(idea.topic);
    const list = beats(idea);
    const tags = (idea.tags || []).slice(0, 3).map(g => `<span>#${esc(g.replace(/\s+/g, ''))}</span>`).join('');

    return `<article class="reel" data-id="${idea.id}" data-index="${index}">
      <div class="reel-bg" style="--reel-a:${a}; --reel-b:${b}"></div>
      <div class="reel-grain"></div>
      <div class="reel-bars">${list.map(() => '<i><span></span></i>').join('')}</div>

      <div class="reel-stage">
        <div class="reel-kicker">
          <span class="pipbadge">${t.emoji} ${esc(t.name)}</span>
          ${idea.clinical ? '<span class="pipbadge">clinical</span>' : ''}
          ${idea.ref ? '<span class="pipbadge">cited</span>' : ''}
        </div>
        <div class="reel-slot">${beatHTML(list[0])}</div>
      </div>

      <div class="reel-tapzones"><i data-tap="prev"></i><i data-tap="toggle"></i><i data-tap="next"></i></div>
      <div class="reel-pause">${ico('play')}</div>

      <div class="reel-meta">
        <h4>${esc(src ? src.title : 'My note')}</h4>
        <p>${esc(src ? src.author : 'Written by me')}</p>
        ${tags ? `<div class="tagrow">${tags}</div>` : ''}
      </div>

      <div class="reel-rail">
        <button data-act="save" data-id="${idea.id}" class="${Store.isSaved(idea.id) ? 'on' : ''}" title="Save">${ico('bookmark')}<b>Save</b></button>
        <button data-act="like" data-id="${idea.id}" class="${Store.isLiked(idea.id) ? 'on' : ''}" title="Like">${ico('heart')}<b>Like</b></button>
        <button data-act="srs"  data-id="${idea.id}" class="${Store.inReview(idea.id) ? 'on' : ''}" title="Review later">${ico('brain')}<b>Review</b></button>
        <button data-act="reel-video" data-id="${idea.id}" title="Export as video">${ico('film')}<b>Video</b></button>
        <button data-act="reel-sound" title="Narration">${ico(state.sound ? 'sound' : 'mute')}<b>${state.sound ? 'On' : 'Off'}</b></button>
      </div>
    </article>`;
  }

  /* ------------------------------------------------------------- playback */
  const state = { sound: false, active: null, raf: 0, observer: null, container: null };

  function stop() {
    cancelAnimationFrame(state.raf);
    if (state.active) state.active.el.classList.remove('paused');
    try { speechSynthesis.cancel(); } catch (e) { /* not available */ }
    state.active = null;
  }

  function bars(el) { return Array.from(el.querySelectorAll('.reel-bars i span')); }

  function paint(a) {
    const b = a.beats[a.i];
    a.el.querySelector('.reel-slot').innerHTML = beatHTML(b);
    const segs = bars(a.el);
    segs.forEach((s, n) => { s.style.width = n < a.i ? '100%' : '0%'; });
    if (state.sound) speak(b);
  }

  function speak(b) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(b.text.replace(/____/g, 'blank') + (b.answer ? '. ' + b.answer : ''));
      u.rate = 1.05; u.pitch = 1;
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }

  function play(el, idea) {
    stop();
    const a = { el, idea, beats: beats(idea), i: 0, start: performance.now(), paused: false, plays: 0 };
    state.active = a;
    paint(a);

    function frame(now) {
      if (!state.active || state.active !== a) return;
      if (a.paused) { a.start = now - a.elapsedAtPause; state.raf = requestAnimationFrame(frame); return; }
      const elapsed = (now - a.start) / 1000;
      a.elapsedAtPause = now - a.start;
      const seg = bars(a.el)[a.i];
      const p = Math.min(1, elapsed / a.beats[a.i].seconds);
      if (seg) seg.style.width = (p * 100) + '%';

      if (p >= 1) {
        if (a.i < a.beats.length - 1) { a.i++; a.start = now; paint(a); }
        else { a.plays++; a.i = 0; a.start = now; paint(a); }   // loop, like a short
      }
      state.raf = requestAnimationFrame(frame);
    }
    state.raf = requestAnimationFrame(frame);

    // watching for a couple of seconds counts as reading it
    setTimeout(() => {
      if (state.active === a && Store.markRead(idea.id)) { Store.save(); document.dispatchEvent(new CustomEvent('pal:progress')); }
    }, 2200);
  }

  function step(delta) {
    const a = state.active;
    if (!a) return;
    a.i = Math.max(0, Math.min(a.beats.length - 1, a.i + delta));
    a.start = performance.now();
    paint(a);
  }

  function togglePause() {
    const a = state.active;
    if (!a) return;
    a.paused = !a.paused;
    a.el.classList.toggle('paused', a.paused);
    if (a.paused) { try { speechSynthesis.pause(); } catch (e) {} }
    else { try { speechSynthesis.resume(); } catch (e) {} }
  }

  /* ---------------------------------------------------------------- mount */
  function mount(container, ideas) {
    stop();
    state.container = container;
    if (state.observer) state.observer.disconnect();

    let rendered = 0;
    const CHUNK = 6;

    function renderMore() {
      const next = ideas.slice(rendered, rendered + CHUNK);
      if (!next.length) return;
      const frag = document.createElement('div');
      frag.innerHTML = next.map((idea, n) => reelHTML(idea, rendered + n)).join('');
      while (frag.firstChild) {
        const el = frag.firstChild;
        container.appendChild(el);
        window.PALIcons.render(el);
        state.observer.observe(el);
      }
      rendered += next.length;
    }

    state.observer = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.intersectionRatio < 0.55) return;
        const el = en.target;
        const idea = UI.findIdea(el.dataset.id);
        if (!idea) return;
        if (!state.active || state.active.el !== el) play(el, idea);
        if (Number(el.dataset.index) >= rendered - 3) renderMore();
      });
    }, { root: container, threshold: [0, 0.55, 0.9] });

    renderMore();
    if (ideas[0]) {
      const first = container.querySelector('.reel');
      if (first) play(first, ideas[0]);
    }
  }

  /* -------------------------------------------------------- video export */
  function pickMime() {
    const want = [
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ];
    for (const m of want) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
    }
    return '';
  }

  function wrap(ctx, text, maxW) {
    const lines = [];
    text.split('\n').forEach(para => {
      let line = '';
      para.split(/\s+/).forEach(word => {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
        else line = test;
      });
      if (line) lines.push(line);
    });
    return lines;
  }

  function drawFrame(ctx, W, H, idea, list, i, tInBeat, t) {
    const [ca, cb] = paletteFor(idea.topic);
    const src = idea.sourceId ? PAL.sourceMap[idea.sourceId] : null;
    const topic = UI.topicOf(idea);
    const b = list[i];
    const pad = W * 0.085;

    ctx.fillStyle = '#101C18';
    ctx.fillRect(0, 0, W, H);

    // two slowly drifting colour fields
    const dx = Math.sin(t / 7) * W * 0.06, dy = Math.cos(t / 9) * H * 0.03;
    let g = ctx.createRadialGradient(W * 0.22 + dx, H * 0.2 + dy, 0, W * 0.22 + dx, H * 0.2 + dy, W * 0.95);
    g.addColorStop(0, ca); g.addColorStop(1, 'rgba(10,21,18,0)');
    ctx.globalAlpha = 0.85; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    g = ctx.createRadialGradient(W * 0.82 - dx, H * 0.8 - dy, 0, W * 0.82 - dx, H * 0.8 - dy, W * 0.9);
    g.addColorStop(0, cb); g.addColorStop(1, 'rgba(10,21,18,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(4,10,8,.5)'); g.addColorStop(.3, 'rgba(4,10,8,0)'); g.addColorStop(.62, 'rgba(4,10,8,.28)'); g.addColorStop(1, 'rgba(4,10,8,.8)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // progress segments
    const barY = H * 0.035, gap = 6, bw = (W - pad * 2 - gap * (list.length - 1)) / list.length;
    list.forEach((_, n) => {
      const x = pad + n * (bw + gap);
      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.fillRect(x, barY, bw, 5);
      const fill = n < i ? 1 : (n === i ? tInBeat / list[i].seconds : 0);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, barY, bw * Math.min(1, fill), 5);
    });

    // kicker
    ctx.font = `700 ${Math.round(W * 0.028)}px ${SANS}`;
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(topic.name.toUpperCase(), pad, H * 0.115);

    // fade the beat in
    const fade = Math.min(1, tInBeat / 0.32);
    ctx.globalAlpha = fade;
    const rise = (1 - fade) * 26;

    let y = H * 0.42;
    if (b.label) {
      ctx.font = `800 ${Math.round(W * 0.026)}px ${SANS}`;
      const lw = ctx.measureText(b.label.toUpperCase()).width;
      ctx.fillStyle = b.kind === 'clin' ? '#DDB94C' : (b.kind === 'quiz' ? '#ffffff' : 'rgba(255,255,255,.25)');
      const lh = W * 0.055;
      roundRect(ctx, pad, y - lh + rise, lw + W * 0.05, lh, lh / 2);
      ctx.fill();
      ctx.fillStyle = (b.kind === 'clin' || b.kind === 'quiz') ? '#14100A' : '#fff';
      ctx.fillText(b.label.toUpperCase(), pad + W * 0.025, y - lh * 0.32 + rise);
      y += W * 0.03;
    }

    const isHook = b.kind === 'hook';
    const size = isHook ? W * 0.095 : (b.kind === 'source' ? W * 0.042 : W * 0.058);
    ctx.font = isHook ? `400 ${Math.round(size)}px ${SERIF}` : `500 ${Math.round(size)}px ${SANS}`;
    const maxW = W - pad * 2 - W * 0.06;
    const lines = wrap(ctx, b.text, maxW);
    const lineH = size * (isHook ? 1.16 : 1.42);
    let ty = Math.max(H * 0.3, H * 0.5 - (lines.length * lineH) / 2) + rise;
    ctx.fillStyle = b.kind === 'source' ? 'rgba(255,255,255,.85)' : '#fff';
    lines.forEach(ln => { ctx.fillText(ln, pad, ty); ty += lineH; });

    if (b.answer) {
      ctx.font = `500 ${Math.round(W * 0.042)}px ${SANS}`;
      ctx.fillStyle = '#EBD389';
      wrap(ctx, b.answer, maxW).forEach(ln => { ty += W * 0.058; ctx.fillText(ln, pad, ty); });
    }
    ctx.globalAlpha = 1;

    // footer
    ctx.font = `700 ${Math.round(W * 0.032)}px ${SANS}`;
    ctx.fillStyle = '#fff';
    ctx.fillText(src ? src.title : 'My note', pad, H * 0.915);
    ctx.font = `400 ${Math.round(W * 0.028)}px ${SANS}`;
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText(src ? src.author : 'Written by me', pad, H * 0.945);
    ctx.textAlign = 'right';
    ctx.fillText("PAL's Academy · Stacks", W - pad, H * 0.945);
    ctx.textAlign = 'left';
  }

  const SANS = `'DM Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;
  const SERIF = `'Instrument Serif', ui-serif, Georgia, 'Times New Roman', serif`;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /**
   * Render an idea to a real video file entirely in the browser.
   * Returns { blob, mime, ext, seconds }.
   */
  async function record(idea, onProgress) {
    if (!window.MediaRecorder) throw new Error('This browser cannot record video.');
    const mime = pickMime();
    if (!mime) throw new Error('No supported video encoder in this browser.');

    const W = 1080, H = 1920;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    try { await document.fonts.ready; } catch (e) { /* fonts optional */ }

    const list = beats(idea);
    const total = Math.min(60, list.reduce((s, b) => s + b.seconds, 0));

    const stream = cv.captureStream(30);
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4500000 });
    const chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const finished = new Promise(res => { rec.onstop = () => res(); });

    drawFrame(ctx, W, H, idea, list, 0, 0, 0);
    rec.start();

    const t0 = performance.now();
    await new Promise(resolve => {
      function tick(now) {
        const t = (now - t0) / 1000;
        if (t >= total) { resolve(); return; }
        let acc = 0, i = 0;
        for (; i < list.length - 1; i++) {
          if (t < acc + list[i].seconds) break;
          acc += list[i].seconds;
        }
        drawFrame(ctx, W, H, idea, list, i, t - acc, t);
        if (onProgress) onProgress(t / total);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    rec.stop();
    stream.getTracks().forEach(tr => tr.stop());
    await finished;
    if (onProgress) onProgress(1);

    const ext = mime.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
    return { blob: new Blob(chunks, { type: mime }), mime, ext, seconds: total };
  }

  window.Reels = {
    mount, stop, step, togglePause, record, beats, paletteFor,
    get sound() { return state.sound; },
    setSound(on) {
      state.sound = !!on;
      if (!on) { try { speechSynthesis.cancel(); } catch (e) {} }
      else if (state.active) speak(state.active.beats[state.active.i]);
      document.querySelectorAll('[data-act="reel-sound"]').forEach(btn => {
        btn.innerHTML = window.PALIcons.svg(on ? 'sound' : 'mute') + `<b>${on ? 'On' : 'Off'}</b>`;
        btn.classList.toggle('on', on);
      });
    },
    get active() { return state.active; }
  };
})();
