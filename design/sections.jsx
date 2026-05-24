// ============================================================
// PAL's Academy — Landing page sections
// Header, Hero, HowItWorks, Subjects, WhyUs, Footer
// ============================================================

function Header({ onCTA, current = "home" }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = current === "home";
  const links = [
    { id: "home",         label: "Home",         href: isHome ? "#top" : "index.html" },
    { id: "how",          label: "How It Works", href: "How It Works.html" },
    { id: "subjects",     label: "Subjects",     href: "Subjects.html" },
    { id: "testimonials", label: "Testimonials", href: "Testimonials.html" },
    { id: "contact",      label: "Contact Us",   href: "Contact Us.html" },
  ];

  return (
    <header className={"site-header" + (scrolled ? " site-header--scrolled" : "")}>
      <div className="container site-header__inner">
        <a className="site-header__logo" href="index.html" aria-label="PAL's Academy">
          <img src="design/assets/logo-wordmark.svg" alt="PAL's Academy" />
        </a>
        <span className="site-header__spacer" />
        {onCTA ? (
          <button className="btn btn-primary btn-sm site-header__cta" onClick={onCTA}>
            <span className="hide-mobile">Book a free consultation</span>
            <span className="show-mobile">Get started</span>
          </button>
        ) : (
          <a href="Contact Us.html" className="btn btn-primary btn-sm site-header__cta">
            <span className="hide-mobile">Book a free consultation</span>
            <span className="show-mobile">Get started</span>
          </a>
        )}
      </div>
      <nav className="site-nav" aria-label="Primary">
        <div className="container site-nav__inner">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              className={"site-nav__link" + (current === l.id ? " is-active" : "")}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Hero({ onCTA }) {
  return (
    <section className="hero hero--dark" id="top" data-screen-label="Hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-grid" />
        <div className="hero__bg-glow hero__bg-glow--a" />
        <div className="hero__bg-glow hero__bg-glow--b" />
      </div>
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="hero__eyebrow">
            <span className="dot" />
            Tutoring for Grade 9–12 &amp; first-year university
          </span>
          <h1>
            Stop falling behind.<br />
            Start <em>getting ahead.</em>
          </h1>
          <p className="lede">
            Live weekly tutoring for GTA Grade 9–12 and first-year university
            students — Math, Science, English, and French.
          </p>
          <div className="hero__ctas">
            <button className="btn btn-lg hero__cta" onClick={onCTA}>
              Get started — book a free consultation
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
          <div className="hero__trust">
            <div className="hero__trust-item">
              <Icon name="shield-check" size={18} />
              Verified tutors
            </div>
            <div className="hero__trust-item">
              <Icon name="video" size={18} />
              Live on Google Meet
            </div>
            <div className="hero__trust-item">
              <Icon name="map-pin" size={18} />
              GTA-based
            </div>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <HeroArt />
        </div>
      </div>
    </section>
  );
}

// Academic-themed SVG: an ascending curve (growth) with a glowing endpoint,
// dot grid, and floating math/science motifs. Sits in the hero on desktop.
function HeroArt() {
  return (
    <svg
      viewBox="0 0 420 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylized upward growth curve with academic motifs"
    >
      <defs>
        <pattern id="ha-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.10)" />
        </pattern>
        <radialGradient id="ha-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E5C46B" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#C99A2A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#C99A2A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ha-curve" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C99A2A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EBD389" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="420" height="500" fill="url(#ha-dots)" rx="20" />
      <circle cx="340" cy="90" r="150" fill="url(#ha-glow)" />

      {/* faint baseline ghost path */}
      <path
        d="M 30 440 Q 110 410, 170 320 T 340 90"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      {/* upward curve representing growth */}
      <path
        d="M 30 440 Q 110 410, 170 320 T 340 90"
        stroke="url(#ha-curve)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* milestone dots */}
      <circle cx="120" cy="408" r="3.5" fill="rgba(255,255,255,0.32)" />
      <circle cx="200" cy="304" r="3.5" fill="rgba(255,255,255,0.45)" />
      <circle cx="270" cy="200" r="3.5" fill="rgba(255,255,255,0.6)" />

      {/* endpoint dot + halo */}
      <circle cx="340" cy="90" r="22" fill="#C99A2A" opacity="0.22" />
      <circle cx="340" cy="90" r="13" fill="#C99A2A" opacity="0.55" />
      <circle cx="340" cy="90" r="6" fill="#F5E9C2" />

      {/* Sigma */}
      <text x="58" y="170" fontFamily="Instrument Serif, serif" fontSize="64" fontStyle="italic" fill="rgba(255,255,255,0.10)">Σ</text>
      {/* Integral */}
      <text x="290" y="270" fontFamily="Instrument Serif, serif" fontSize="60" fontStyle="italic" fill="rgba(255,255,255,0.09)">∫</text>

      {/* f(x) circle */}
      <g transform="translate(86, 290)">
        <circle r="28" stroke="rgba(255,255,255,0.20)" strokeWidth="1.2" fill="none" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="20" fill="rgba(255,255,255,0.55)">f(x)</text>
      </g>

      {/* atomic orbits */}
      <g transform="translate(280, 380)" stroke="rgba(255,255,255,0.18)" fill="none">
        <circle cx="0" cy="0" r="3" fill="rgba(255,255,255,0.5)" stroke="none" />
        <ellipse cx="0" cy="0" rx="26" ry="10" />
        <ellipse cx="0" cy="0" rx="26" ry="10" transform="rotate(60)" />
        <ellipse cx="0" cy="0" rx="26" ry="10" transform="rotate(-60)" />
      </g>

      {/* page lines */}
      <g transform="translate(36, 60)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round">
        <line x1="0" y1="0" x2="58" y2="0" />
        <line x1="0" y1="11" x2="48" y2="11" />
        <line x1="0" y1="22" x2="58" y2="22" />
      </g>
    </svg>
  );
}

// ============================================================
// Stats bar — three big claims between Hero and How It Works
// ============================================================
function StatsBar() {
  const stats = [
    { big: "100%", label: "Verified tutors", sub: "Every tutor vetted by us." },
    { big: "9–12 + Uni", label: "Grades we tutor", sub: "High school through first year." },
    { big: "GTA-wide", label: "Fully online sessions", sub: "Live on Google Meet, anywhere." },
  ];
  return (
    <section className="stats-bar" data-screen-label="Stats">
      <div className="container">
        <div className="stats-bar__grid">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat__big">{s.big}</div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Shared placeholder tutors data — used by teaser + Our Tutors page
// ============================================================
const TUTORS = [
  {
    id: "maya",
    name: "Maya R.",
    initials: "MR",
    subject: "Calculus & Vectors",
    code: "MCV4U",
    accent: "math",
    bio: "Achieved 95%+ in MCV4U — now helping students do the same.",
    long: "Maya is a third-year engineering student at Waterloo. She tutors MHF4U and MCV4U with a focus on intuition before algorithms — the kind of problem-solving that survives the exam.",
    availability: "Evenings, weekends",
  },
  {
    id: "david",
    name: "David K.",
    initials: "DK",
    subject: "Chemistry",
    code: "SCH3U / 4U",
    accent: "science",
    bio: "Scored a 98 in SCH4U; specializes in equilibrium and stoichiometry.",
    long: "David studies biochemistry at U of T. He's tutored over 60 SCH4U students and is known for breaking down equilibrium and stoichiometry so they actually click.",
    availability: "Mon–Thu evenings",
  },
  {
    id: "priya",
    name: "Priya N.",
    initials: "PN",
    subject: "Advanced Functions",
    code: "MHF4U",
    accent: "math",
    bio: "Top-of-class in MHF4U — patient with students who hate math.",
    long: "Priya is a math undergrad at TMU. She's especially good with students who came into Grade 12 feeling like they're 'just bad at math' and need to rebuild confidence first.",
    availability: "Flexible",
  },
  {
    id: "elise",
    name: "Élise B.",
    initials: "ÉB",
    subject: "French",
    code: "FSF3U / 4U",
    accent: "french",
    bio: "Bilingual since age 6 — conversational tutoring that builds confidence.",
    long: "Élise grew up between Ottawa and Paris. She runs FSF sessions almost entirely in French and adjusts pace to keep students stretched but not lost.",
    availability: "Weekends",
  },
  {
    id: "noah",
    name: "Noah T.",
    initials: "NT",
    subject: "Physics",
    code: "SPH3U / 4U",
    accent: "science",
    bio: "Physics Olympiad finalist — makes mechanics feel obvious.",
    long: "Noah studies physics at U of T. He works through free-body diagrams and kinematics the way they're meant to be taught — visually, slowly, with practice questions in between.",
    availability: "Tue / Thu / Sat",
  },
  {
    id: "amira",
    name: "Amira S.",
    initials: "AS",
    subject: "English",
    code: "ENG3U / 4U",
    accent: "english",
    bio: "English lit major — essay structure that earns marks.",
    long: "Amira is an English lit major at York. She focuses on essay structure, thesis-writing, and close reading — the things that move a 70 to an 85.",
    availability: "Mon / Wed / Fri",
  },
];
const ACCENT = {
  math:    { fg: "var(--tag-math)",    bg: "var(--tag-math-soft)" },
  science: { fg: "var(--tag-science)", bg: "var(--tag-science-soft)" },
  english: { fg: "var(--tag-english)", bg: "var(--tag-english-soft)" },
  french:  { fg: "var(--tag-french)",  bg: "var(--tag-french-soft)" },
};

function TutorCard({ tutor, showBookBtn = false, expanded = false }) {
  const a = ACCENT[tutor.accent] || ACCENT.math;
  return (
    <div className="tutor-card">
      <div className="tutor-card__head">
        <div
          className="tutor-card__avatar"
          style={{ background: a.bg, color: a.fg }}
          aria-hidden="true"
        >
          {tutor.initials}
        </div>
        <div className="tutor-card__id">
          <div className="tutor-card__name">{tutor.name}</div>
          <div className="tutor-card__role">
            <span className="tutor-card__subject" style={{ color: a.fg }}>
              {tutor.subject}
            </span>
            <span className="tutor-card__code">{tutor.code}</span>
          </div>
        </div>
      </div>
      <p className="tutor-card__bio">{expanded ? tutor.long : tutor.bio}</p>
      {expanded && (
        <div className="tutor-card__meta">
          <Icon name="clock" size={14} />
          {tutor.availability}
        </div>
      )}
      {showBookBtn && (
        <a className="btn btn-primary btn-sm tutor-card__book" href={"Contact Us.html?tutor=" + tutor.id}>
          Book with {tutor.name.split(" ")[0]}
          <Icon name="arrow-right" size={14} />
        </a>
      )}
    </div>
  );
}

// ============================================================
// Tutor teaser — 3 cards on the home page, links to Our Tutors
// ============================================================
function TutorTeaser() {
  const traits = [
    {
      icon: "award",
      title: "Top of their class",
      body: "Every tutor we recommend scored at the top of their cohort in the exact course they teach.",
    },
    {
      icon: "shield-check",
      title: "Personally vetted",
      body: "Police-checked and interviewed by our team. We sit in on early sessions before flying solo.",
    },
    {
      icon: "heart-handshake",
      title: "Matched to the student",
      body: "Subject expertise is table stakes. We match on temperament, schedule, and teaching style too.",
    },
  ];
  return (
    <section className="section section--tutors" id="tutors" data-screen-label="Meet our tutors">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Meet our tutors</span>
          <h2>Real students who've been where you are.</h2>
          <p>Every tutor was the kid acing the course not long ago. They've kept their notes, their tricks, and their patience.</p>
        </div>
        <div className="why-grid">
          {traits.map((t, i) => (
            <div className="why-card" key={i}>
              <div className="why-card__icon">
                <Icon name={t.icon} size={22} strokeWidth={1.8} />
              </div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: "clipboard-list",
      title: "Tell us what you need",
      body: "Fill out our quick form — the subject, the grade, and what you're working toward.",
    },
    {
      icon: "phone-call",
      title: "We reach out in 1–2 days",
      body: "A short call to understand the student, then we put together a personalized package.",
    },
    {
      icon: "graduation-cap",
      title: "Meet your tutor &amp; start",
      body: "Get matched with a verified tutor. First session usually within the week.",
    },
  ];
  return (
    <section className="section" id="how" data-screen-label="How it works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. About a week.</h2>
          <p>No drawn-out onboarding, no commitments before you meet your tutor.</p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step__num">{i + 1}</div>
              <div className="step__icon">
                <Icon name={s.icon} size={22} strokeWidth={1.8} />
              </div>
              <h3>{s.title.replace("&amp;", "&")}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Subjects() {
  const hs = [
    { name: "Functions", subject: "math" },
    { name: "Advanced Functions", subject: "math" },
    { name: "Calculus & Vectors", subject: "math" },
    { name: "Biology", subject: "science" },
    { name: "Chemistry", subject: "science" },
    { name: "Physics", subject: "science" },
    { name: "English", subject: "english" },
    { name: "French", subject: "french" },
  ];
  const uni = [
    { name: "Calculus I or II", subject: "math" },
    { name: "Biology I or II", subject: "science" },
    { name: "General Chemistry I or II", subject: "science" },
    { name: "Organic Chemistry I or II", subject: "science" },
    { name: "Physics I or II", subject: "science" },
  ];
  const swatchColor = (s) => ({
    math: "var(--tag-math)",
    science: "var(--tag-science)",
    english: "var(--tag-english)",
    french: "var(--tag-french)",
  }[s]);

  return (
    <section className="section" id="subjects" style={{ background: "#fff", borderTop: "1px solid var(--color-divider)", borderBottom: "1px solid var(--color-divider)" }} data-screen-label="Subjects">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">What we teach</span>
          <h2>Subjects we cover</h2>
          <p>Tutors are matched to a course they've actually taken and excelled in — not generalists guessing at the curriculum.</p>
        </div>
        <div className="subjects-wrap">
          <div className="subject-group">
            <div className="subject-group__head">
              <h3 className="subject-group__title">Grade 9 through 12</h3>
              <span className="subject-group__kicker">Ontario curriculum</span>
            </div>
            <p className="subject-group__sub">Exam prep, EQAO-style practice, and weekly homework support.</p>
            <ul className="subject-list subject-list--no-codes">
              {hs.map((c) => (
                <li className="subject-item" key={c.name}>
                  <span className="swatch" style={{ background: swatchColor(c.subject) }} />
                  <span className="subject-item__name">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="subject-group subject-group--uni">
            <div className="subject-group__head">
              <h3 className="subject-group__title">First-year university</h3>
            </div>
            <p className="subject-group__sub">Bridging the high-school-to-university gap. Sessions follow your syllabus.</p>
            <ul className="subject-list subject-list--no-codes">
              {uni.map((c) => (
                <li className="subject-item" key={c.name}>
                  <span className="swatch" style={{ background: swatchColor(c.subject) }} />
                  <span className="subject-item__name">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    {
      icon: "badge-check",
      title: "Verified tutors",
      body: "Every tutor has excelled in the exact course they teach — and we've vetted them ourselves.",
    },
    {
      icon: "calendar-check",
      title: "Schedules that stick",
      body: "Consistent weekly time slots with the same tutor. No reshuffling, no week-to-week guessing.",
    },
    {
      icon: "users-round",
      title: "1-on-1 or small group",
      body: "Pick what fits the student — focused private sessions, or small groups for collaborative practice.",
    },
    {
      icon: "video",
      title: "Live on Google Meet",
      body: "GTA-based, fully online. Familiar tools, no software to install, no commute.",
    },
  ];
  return (
    <section className="section" id="why" data-screen-label="Why us">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Why PAL's Academy</span>
          <h2>Built for students who actually want to improve.</h2>
          <p>Four things we promise, and a hundred small things we sweat behind the scenes.</p>
        </div>
        <div className="why-grid">
          {points.map((p, i) => (
            <div className="why-card" key={i}>
              <div className="why-card__icon">
                <Icon name={p.icon} size={22} strokeWidth={1.8} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer" data-screen-label="Footer">
      <div className="container">
        <div className="site-footer__inner">
          <a className="site-footer__logo" href="#top" aria-label="PAL's Academy">
            <img src="design/assets/logo-wordmark-dark.svg" alt="PAL's Academy" />
          </a>
          <div className="site-footer__links">
            <a href="How It Works.html">How it works</a>
            <a href="Subjects.html">Subjects</a>
            <a href="Contact Us.html">Get started</a>
            <a
              href="https://www.facebook.com/profile.php?id=61589193897066"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon size={16} />
              Facebook
            </a>
          </div>
        </div>
        <div className="container site-footer__bottom" style={{ padding: 0 }}>
          <span>© 2026 PAL's Academy. All rights reserved.</span>
          <span>palseduacademy@gmail.com</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, Hero, HowItWorks, Subjects, WhyUs, Footer, StatsBar, TutorTeaser, TutorCard, TUTORS, ACCENT });
