# Stacks

A private, offline, single-user knowledge app — the Deepstash / Nibble idea, rebuilt so it
costs nothing, needs no account, and never leaves your device.

Weighted heavily towards **medicine, anatomy, physiology and kinesiology**, and rounded out
with the books that cover everything else — *Atomic Habits*, *The Art of Seduction*,
*Thinking, Fast and Slow*, *Meditations*, *Sapiens*, and about seventy others.

**928 ideas · 107 sources · 16 realms**

---

## Run it on a computer

Double-click `index.html`. That's the whole installation — no build step, no `npm install`,
no framework, no server.

To get offline caching and the installable app, it needs a real origin rather than `file://`:

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

---

## Install it on your phone

Pick one of three routes. **Route A is the one you want** — it gives a home-screen icon, full
screen with no browser bars, and it works with no signal once loaded.

### Route A — host it free on Cloudflare Pages, then add to home screen ★

Works with a **private** repo on the free plan, gives you HTTPS, and can be locked to your
email address so nobody else can open it.

**1. Deploy it (once, ~3 minutes, on a computer)**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
   → **Pages** → **Connect to Git**
2. Authorise GitHub and pick `Pogos137/PAL-s-Academy-Web`
3. Set:
   - **Production branch:** `claude/personal-knowledge-app-cbal2f`
   - **Framework preset:** None
   - **Build command:** *leave completely empty*
   - **Build output directory:** `/`
4. **Save and Deploy.** You get a URL like `https://pal-s-academy-web.pages.dev`

The empty build command is the part people get wrong — there is nothing to build, Cloudflare
just serves the files as they are.

**2. Add it to your home screen (on the phone)**

- **iPhone:** open the URL in **Safari** → tap **Share** (the square with the arrow) →
  **Add to Home Screen** → **Add**
- **Android:** open it in **Chrome** → **⋮** menu → **Install app** (or *Add to Home screen*)

It now launches full-screen from its own icon, with no address bar. Give it one visit on wifi
first — that caches all 928 ideas, after which it runs with no connection at all.

**3. Optional: lock it to just you**

The URL is unlisted and carries `noindex`, but anyone with the link could open it. To make it
genuinely private, still free:

Cloudflare dashboard → **Zero Trust** → **Access** → **Applications** → **Add an application**
→ **Self-hosted** → enter your `.pages.dev` hostname → policy **Allow** → include **Emails**
→ your address. You'll get a one-time code by email the first time you open it on each device.

### Route B — one file, no hosting at all

```bash
node tools/build-single-file.js      # writes dist/stacks.html
```

That single ~516 kB file contains the entire app. Email it to yourself, AirDrop it, or drop it
in iCloud/Drive, then open it on the phone.

Honest caveats: no home-screen icon and no service worker, because both need an http(s)
origin. On **Android** this works well — save it and open with Chrome. On **iOS** the Files
app preview is unreliable about keeping `localStorage`, so your streak and saved ideas may not
survive between opens. Use Route A if you care about progress being kept.

### Route C — your own computer on the same wifi

```bash
python3 -m http.server 8000
ipconfig getifaddr en0        # macOS — or `hostname -I` on Linux
```

Then open `http://<that-ip>:8000` on the phone. Fine for a quick look; it only works while the
computer is awake and on the same network, and the service worker will **not** register,
because a plain-http LAN address isn't a secure context. So: no offline, no install.

### GitHub Pages?

Only if you make the repo public — Pages on a private repo needs a paid GitHub plan. Since the
point of this is a private app, Cloudflare Pages is the better answer.

### One thing to know about your data on iOS

iOS keeps home-screen web apps in a **separate storage container from Safari**. If you read a
few things in Safari and then install to the home screen, the installed app starts empty. Do
your reading in the installed app from the start, or move your data across with
**Settings → Export backup** and then **Import backup**.

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

### Feed — reels
The default feed is a **full-screen vertical short-form player**, the TikTok / Reels format.
One idea per screen, swipe up for the next, snap scrolling, right-hand action rail.

Each idea is decomposed automatically into timed **beats** — hook, then the body a sentence
at a time, then the clinical correlate, the mnemonic, a quick-check question, and the source.
Beats advance on a reading-pace timer with segmented story bars along the top, so it plays
like a captioned short rather than sitting there as text.

- **Tap left / middle / right** — previous beat, pause, next beat
- **Swipe or arrow up/down** — previous / next idea
- **Narration** — optional voiceover using the browser's built-in speech synthesis (offline,
  no API, no key). Off by default.
- Watching an idea for a couple of seconds marks it read, so the daily goal and streak fill
  as you scroll.

Unread surfaces first, order is stable within a day, and a **list view** toggle is there for
when you want to scan rather than watch.

### Video export
The film button on any reel renders it to a **real video file, in your browser** — canvas
frames captured through `MediaRecorder`, nothing uploaded, no service involved.

- Vertical **1080×1920**, ready for TikTok, Reels or Shorts
- **MP4/H.264** where the browser supports it (Chromium does), WebM/VP9 otherwise
- Typically 20–40s and 5–15 MB depending on the length of the idea
- The same beat script drives both the player and the recorder, so the export is what you
  watched

Preview it in the dialog, then download.

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
| `j` `k` / `↑` `↓` | next / previous idea (reels and reader) |
| `space` | pause / resume a reel · reveal the answer in review |
| `←` `→` | step back / forward one beat in a reel |
| `s` `l` `r` | save / like / add to review |
| `v` | export the current reel as a video |
| `m` | toggle narration |
| `1` `2` `3` `4` | grade Again / Hard / Good / Easy |
| `Esc` | close reader or dialog |

---

## Layout

```
index.html              app shell
app/css/app.css         design system — PAL's Academy tokens, dark + light
app/css/reels.css       full-screen short-form player
app/js/library.js       realms, sources, paths, the PAL.add() registry
app/js/store.js         localStorage state, export/import
app/js/srs.js           spaced repetition scheduler
app/js/icons.js         inline SVG set
app/js/ui.js            shared render helpers
app/js/reels.js         beat engine, reels player, canvas video recorder
app/js/views.js         one function per route
app/js/app.js           router, events, reader overlay, shortcuts
app/data/references.js  reference basis per source + verified primary citations
app/data/*.js           the 928 ideas, grouped by domain (*2.js = second wave)
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
    m: "A mnemonic.",                       // optional
    r: "morton2018" }                       // optional — key into PAL.refs
]);
```

`PAL.add` can be called more than once for the same source, so a source can be extended from
a new file without renumbering anything. To cite a claim, add the paper to `PAL.refs` in
`app/data/references.js` with its PMID and DOI, then reference the key with `r:`.

New sources go in the `PAL.sources` array in `app/js/library.js`; new realms in `PAL.topics`
directly above it.

---

## Provenance

Every source in the library declares the reference work it was written from — visible at the
bottom of every idea in the reader, and listed in full under **Explore → Where this comes
from** (`#/refs`).

Three tiers, and it is worth being precise about which is which:

1. **Study guides** are original explainers written from the standard textbooks and
   guidelines for that field — Robbins for pathology, Guyton & Hall and West for physiology,
   Moore and Gray's for anatomy, Neumann and the NSCA for kinesiology, Katzung for
   pharmacology, Tintinalli and the Resuscitation Council for emergency medicine, and so on.
   Each source names its own basis.
2. **Book entries** are original summaries of the ideas in those books. Not quotations, not
   a substitute for reading them.
3. **Specific empirical claims** — anything stating a number, a trial result or an effect
   size — carry a `cited` badge and a full primary citation with a DOI link and PubMed ID.

The 11 primary citations were checked against PubMed rather than recalled, so the figures in
the app match the papers. They cover the claims most likely to be repeated out loud: the
1.62 g/kg/day protein breakpoint, the 9-month ACL return-to-sport finding, cardiorespiratory
fitness and mortality, ultra-processed food and energy intake, 1.9 million neurons per minute
in stroke, gait speed and survival, the ISSN creatine position stand, sleep restriction and
glucose tolerance, Nordic hamstring injury reduction, running cadence and joint load, and
Sackett's definition of evidence-based medicine.

Where a popular book overstates its evidence, the library says so rather than repeating it —
there are explicit entries on the replication problems behind grit and growth mindset, the
critique of *Why We Sleep*, the misreading of the 10,000-hour rule, the serotonin hypothesis
of depression, learning styles, and left-brain/right-brain. Reading a book is not the same as
believing it.

The medical material is a **revision aid** pitched at someone studying the subject. It is
not clinical guidance, it is not exhaustive, and it must not be used to make decisions about
a real patient.
