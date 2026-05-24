// ============================================================
// Testimonials — student & parent reviews
// ============================================================

const TESTIMONIALS = [
  {
    quote: "My daughter went from a 58 to an 82 in SCH4U in one semester. PAL's Academy changed everything.",
    who: "Parent",
    where: "Scarborough",
    audience: "parent",
    subject: "SCH4U",
  },
  {
    quote: "I was failing MCV4U at midterm. Maya broke down vectors in a way my teacher never did — I ended the year with a 91.",
    who: "Grade 12 student",
    where: "Markham",
    audience: "student",
    subject: "MCV4U",
  },
  {
    quote: "Honestly, the consistency is what did it. Same tutor every week, same time. My son stopped dreading Sunday nights.",
    who: "Parent",
    where: "Mississauga",
    audience: "parent",
    subject: "MHF4U",
  },
  {
    quote: "First-year chem at U of T was a wall. Two months with David and I'm actually keeping up. I wish I'd done this in September.",
    who: "First-year university student",
    where: "Toronto",
    audience: "student",
    subject: "CHM135",
  },
  {
    quote: "We tried two other agencies before this one. The difference is the matching — they actually picked a tutor my kid clicks with.",
    who: "Parent",
    where: "Vaughan",
    audience: "parent",
    subject: "ENG4U",
  },
  {
    quote: "I'm shy and didn't think I'd talk much in tutoring. Élise made it feel like a conversation, not an exam. My French went up two grade brackets.",
    who: "Grade 11 student",
    where: "North York",
    audience: "student",
    subject: "FSF3U",
  },
];

function BigStarRating({ value = 4.8, max = 5 }) {
  const [fillPct, setFillPct] = React.useState(0);
  const wrapRef = React.useRef(null);
  const target = Math.max(0, Math.min(value, max)) / max * 100;

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => setFillPct(target));
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, [target]);

  const stars = Array.from({ length: max });
  return (
    <div className="big-stars" ref={wrapRef} aria-label={value + " out of " + max + " stars"}>
      <div className="big-stars__row big-stars__row--base" aria-hidden="true">
        {stars.map((_, i) => (
          <Icon key={i} name="star" size={72} strokeWidth={1.6} className="big-stars__star" />
        ))}
      </div>
      <div
        className="big-stars__row big-stars__row--fill"
        aria-hidden="true"
        style={{ width: fillPct + "%" }}
      >
        {stars.map((_, i) => (
          <Icon key={i} name="star" size={72} strokeWidth={1.6} className="big-stars__star big-stars__star--filled" />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <figure className="testi-card">
      <Icon name="quote" size={28} strokeWidth={1.5} className="testi-card__mark" />
      <blockquote className="testi-card__quote">{t.quote}</blockquote>
      <figcaption className="testi-card__who">
        <div className="testi-card__name">— {t.who}, {t.where}</div>
        <span className="testi-card__tag">{t.subject}</span>
      </figcaption>
    </figure>
  );
}

function TestimonialsPage() {
  return (
    <React.Fragment>
      <section className="page-hero" data-screen-label="Testimonials hero">
        <div className="container">
          <span className="eyebrow">What families say</span>
          <h1>Real stories. <em>Real grade changes.</em></h1>
          <p className="page-hero__lede">
            Names and identifying details are kept private; courses and grade
            improvements are what families have shared with us, with permission.
          </p>
          <div className="hero-rating">
            <div className="hero-rating__score">
              <span className="hero-rating__num">4.8</span>
              <span className="hero-rating__out">/ 5</span>
            </div>
            <div className="hero-rating__meta">
              <div className="hero-rating__stars" aria-label="4.8 out of 5 stars">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" size={18} className="hero-rating__star" />
                ))}
              </div>
              <div className="hero-rating__count">Based on 137+ verified student &amp; parent reviews</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard t={t} key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="metrics">
            <div className="metric">
              <div className="metric__big">+18<small>pts</small></div>
              <div className="metric__label">Average grade change</div>
              <div className="metric__sub">Across students who stayed at least one semester.</div>
            </div>
            <div className="metric">
              <div className="metric__big">93<small>%</small></div>
              <div className="metric__label">Families that renew</div>
              <div className="metric__sub">Most stick through the school year and beyond.</div>
            </div>
            <div className="metric">
              <div className="metric__big">1–2<small> days</small></div>
              <div className="metric__label">Average response time</div>
              <div className="metric__sub">From consultation form to first call back.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section big-rating-section">
        <div className="container">
          <div className="big-rating">
            <span className="eyebrow">Overall rating</span>
            <h2>Almost five stars — <em>and climbing.</em></h2>
            <p className="big-rating__lede">
              Out of 137+ verified reviews from students and parents, PAL's
              Academy averages <strong>4.8 out of 5</strong>.
            </p>
            <BigStarRating value={4.8} max={5} />
            <div className="big-rating__meta">
              <div className="big-rating__score">
                <span className="big-rating__num">4.8</span>
                <span className="big-rating__out">/ 5</span>
              </div>
              <div className="big-rating__count">137+ five-star reviews</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section page-cta">
        <div className="container page-cta__inner">
          <h2>Your story next?</h2>
          <p>Tell us about the student. We'll be in touch within 1–2 business days.</p>
          <a href="Contact Us.html" className="btn btn-primary btn-lg">
            Book a free consultation
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </section>
    </React.Fragment>
  );
}

window.TestimonialsPage = TestimonialsPage;
