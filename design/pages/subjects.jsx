// ============================================================
// Subjects — dedicated page for all subjects we cover
// ============================================================

function SubjectsPage() {
  return (
    <React.Fragment>
      <section className="page-hero" data-screen-label="Subjects hero">
        <div className="container">
          <span className="eyebrow">What we teach</span>
          <h1>Subjects we cover, <em>start to finish.</em></h1>
          <p className="page-hero__lede">
            Tutors are matched to a course they've actually taken and excelled
            in — not generalists guessing at the curriculum. Math, Sciences,
            English, and French, from Grade 9 through first-year university.
          </p>
        </div>
      </section>

      <Subjects />

      <section className="section page-cta">
        <div className="container page-cta__inner">
          <h2>Don't see your course?</h2>
          <p>Tell us what you need on the consultation form — we cover more than fits on a page.</p>
          <a href="Contact Us.html" className="btn btn-primary btn-lg">
            Book a free consultation
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </section>
    </React.Fragment>
  );
}

window.SubjectsPage = SubjectsPage;
