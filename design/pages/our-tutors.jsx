// ============================================================
// Our Tutors — full tutor profile cards
// ============================================================

function OurTutorsPage() {
  const subjectAreas = [
    { icon: "calculator", title: "Math", body: "Functions, Advanced Functions, Calculus & Vectors, and first-year university calculus." },
    { icon: "flask-conical", title: "Sciences", body: "Biology, Chemistry, and Physics — high school through first-year university." },
    { icon: "book-open", title: "English", body: "Reading, writing, and essay structure across Grades 9–12." },
    { icon: "languages", title: "French", body: "Core, extended, and immersion — Grade 9 through Grade 12." },
  ];
  return (
    <React.Fragment>
      <section className="page-hero" data-screen-label="Our tutors hero">
        <div className="container">
          <span className="eyebrow">Our tutors</span>
          <h1>Hand-picked tutors, <em>matched to your student.</em></h1>
          <p className="page-hero__lede">
            We don't keep a public roster. Tutors are introduced after the
            consultation call — once we know the subject, the schedule, and
            what kind of teaching style fits the student best.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="roster-intro">
            <div className="roster-intro__badge">
              <Icon name="user-check" size={22} strokeWidth={1.8} />
            </div>
            <h2>Why no names on this page?</h2>
            <p>
              Because the tutor you'll work with is the one who fits <em>your</em>
              student — not whoever happens to be the most photogenic on a roster
              page. After the consultation, we shortlist 2–3 tutors who've
              personally excelled in the exact course, share their bios with you,
              and you pick.
            </p>
            <p className="roster-intro__sub">
              Every tutor we recommend has been vetted on the four points below.
            </p>
          </div>

          <div className="roster-subjects">
            <h3 className="roster-subjects__title">Subject areas we currently cover</h3>
            <div className="roster-subjects__grid">
              {subjectAreas.map((s) => (
                <div className="roster-subject" key={s.title}>
                  <div className="roster-subject__icon">
                    <Icon name={s.icon} size={20} strokeWidth={1.8} />
                  </div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="vetting">
            <div className="vetting__head">
              <span className="eyebrow">How we vet</span>
              <h2>What "verified" actually means.</h2>
              <p>It isn't a checkbox. It's a small set of things we won't compromise on.</p>
            </div>
            <ul className="vetting__list">
              <li>
                <Icon name="award" size={18} />
                <span><strong>Top of their class.</strong> Every tutor scored in the top of their cohort in the exact course they teach.</span>
              </li>
              <li>
                <Icon name="shield-check" size={18} />
                <span><strong>Police-checked.</strong> Standard background screening before they ever meet a student.</span>
              </li>
              <li>
                <Icon name="message-circle" size={18} />
                <span><strong>We sit in.</strong> Senior staff observe early sessions and give feedback. Nobody is left to figure it out alone.</span>
              </li>
              <li>
                <Icon name="heart-handshake" size={18} />
                <span><strong>Personality fit.</strong> Subject expertise is table stakes — we match on temperament too.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section page-cta">
        <div className="container page-cta__inner">
          <h2>Ready to be matched?</h2>
          <p>Tell us what you need and we'll introduce a tutor who fits — by subject, schedule, and teaching style.</p>
          <a href="Contact Us.html" className="btn btn-primary btn-lg">
            Request a tutor
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </section>
    </React.Fragment>
  );
}

window.OurTutorsPage = OurTutorsPage;
