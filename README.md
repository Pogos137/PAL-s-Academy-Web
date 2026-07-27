# Stacks

A private, offline, single-user knowledge app — the Deepstash / Nibble idea, rebuilt so it
costs nothing, needs no account, and never leaves your device.

Weighted heavily towards **medicine, anatomy, physiology and kinesiology**, and rounded out
with the books that cover everything else — *Atomic Habits*, *The Art of Seduction*,
*Thinking, Fast and Slow*, *Meditations*, *Sapiens*, and about seventy others.

**624 ideas · 74 sources · 16 realms**

---

## Run it

Double-click `index.html`. That's the whole installation.

There is no build step, no `npm install`, no framework and no server. It is plain HTML, CSS
and JavaScript, so it works straight off the filesystem (`file://`) or from any static host.

If you'd rather serve it:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Privacy

Nothing is uploaded, anywhere. There is no backend, no account, no analytics and no
telemetry. Everything you do — reading history, saved ideas, your own notes, the review
schedule — lives in this browser's `localStorage`.

The one external request is a Google Fonts stylesheet for the typefaces. Delete the
`@import` on line 7 of `app/css/app.css` and the app makes **zero** network requests; it
falls back to your system fonts.

Because the data is browser-local, **clearing site data wipes it**, and it does not follow
you to another browser or device. Settings → *Export backup* writes a JSON file; *Import
backup* restores it. Do that occasionally.

---

## What's in it

### Feed
A scrolling stack of ideas, filterable by realm. Unread surfaces first, and the order is
stable within a day so you can leave and come back. Reading counts toward a daily goal and
a streak.

### Explore
Browse by realm → source → idea, or search the whole library from the top bar.

Sources are of two kinds:
- **Study guides** — original explainers on a subject (Cardiovascular Physiology,
  Biomechanics, Pharmacology Core…)
- **Books** — the key ideas from a title, written as compressed original summaries

### Review
Spaced repetition (an SM-2 variant) over anything you've added with the 🧠 button. Cards
come back just before you'd forget them. Grade *Again / Hard / Good / Easy*; the intervals
on the buttons tell you when each card returns.

Ideas carrying a `{{cloze}}` prompt turn into fill-in-the-blank cards — most of the
high-yield medical facts have one. The rest become title-prompt recall cards.

### Paths
Nine ordered curricula that turn the library into a syllabus:

| Path | Covers |
| --- | --- |
| Musculoskeletal Mastery | anatomy → biomechanics → gait → strength → rehab |
| The Physiology Spine | every major organ system, in a sensible order |
| Clinical Foundations | mechanism → micro → pharm → diagnostics → reasoning → emergency |
| The Disciplined Operator | the behavioural machinery everything else runs on |
| Social Power | influence, negotiation, charisma, seduction, human nature |
| Mind & Memory | the learning engine you run every other path on |
| The Longevity Stack | sleep, nutrition, stress, breathing, healthspan |
| Clear Thinking | bias, models, forecasting, risk |
| The Renaissance Mind | one serious source from every realm |

### Progress
Streak, a 26-week activity heatmap, and a **coverage map** — a bar per realm showing how
much of it you've actually read. Underneath it, *Your blind spots*: the three realms you've
neglected most. That's the part built specifically for "knowledgeable in every realm" —
it makes the gaps impossible to ignore.

### My Stash
Saved ideas, liked ideas, your own written ideas, and named collections. Anything you write
sits beside the library — searchable, savable and reviewable on the same footing.

---

## Keyboard

| Key | Does |
| --- | --- |
| `/` | focus search |
| `t` | toggle dark / light |
| `j` `k` / `↑` `↓` / `space` | next / previous idea in the reader |
| `s` `l` `r` | save / like / add to review (in the reader) |
| `space` | reveal answer (in review) |
| `1` `2` `3` `4` | grade Again / Hard / Good / Easy |
| `Esc` | close reader or dialog |

---

## Layout

```
index.html              app shell
app/css/app.css         design system — PAL's Academy tokens, dark + light
app/js/library.js       realms, sources, paths, the PAL.add() registry
app/js/store.js         localStorage state, export/import
app/js/srs.js           spaced repetition scheduler
app/js/icons.js         inline SVG set
app/js/ui.js            shared render helpers
app/js/views.js         one function per route
app/js/app.js           router, events, reader overlay, shortcuts
app/data/*.js           the 624 ideas, grouped by domain
```

### Adding your own content

Ideas can be written in-app (**New idea**), or added to the library in bulk. A data file
entry looks like this:

```js
PAL.add('phys-cardio', [
  { t: "Title — the one-line version",
    b: "Two or three sentences of the actual idea.",
    g: ["tag", "another tag"],              // optional
    c: "Why it matters clinically.",        // optional — renders as a gold callout
    q: "Cardiac output = {{HR × SV}}.",     // optional — becomes a cloze card
    a: "The full answer.",                  // optional
    m: "A mnemonic." }                      // optional
]);
```

New sources go in the `PAL.sources` array in `app/js/library.js`; new realms in `PAL.topics`
directly above it.

---

## A note on the content

Book entries are **original summaries written for study** — the ideas restated in my own
words, not quotations, and not a substitute for reading the books themselves. If a summary
sends you to the original, it did its job.

The medical material is a **revision aid** pitched at someone studying the subject. It is
not clinical guidance, it is not exhaustive, and it must not be used to make decisions about
a real patient.
