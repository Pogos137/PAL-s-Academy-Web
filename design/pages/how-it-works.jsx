// ============================================================
// How It Works — expanded 3-step process page
// ============================================================

function HowItWorksPage() {
  const steps = [
    {
      icon: "clipboard-list",
      title: "Tell us what you need",
      lead: "Two minutes on the consultation form.",
      body:
        "You let us know who the student is, what subject they need help with, their grade or year, and the best way for us to reach you. No payment info, no commitment — just the basics.",
      details: [
        "Student's name and grade or year of study",
        "Subjects needed — high school courses or university first-year courses",
        "Preferred contact method (email or phone)",
        "Anything specific you want us to know — an upcoming exam, a missed unit, a confidence dip",
      ],
    },
    {
      icon: "phone-call",
      title: "We reach out within 1–2 business days",
      lead: "A short call to actually understand the situation.",
      body:
        "A member of the PAL's team will email or phone you back within 1–2 business days. We spend 15 minutes asking the right questions — current marks, learning style, schedule, what's been tried, what hasn't — and put together a personalized package.",
      details: [
        "Discuss the student's strengths and gaps in the subject",
        "Recommend session length, frequency, and whether 1-on-1 or small group fits better",
        "Walk through tutor options that match the subject and personality",
        "Confirm a weekly time that works for the student's schedule",
      ],
    },
    {
      icon: "graduation-cap",
      title: "Get matched and start",
      lead: "First session usually within the week.",
      body:
        "We shortlist 2–3 tutors who've excelled in the exact course and share their bios with you. You pick. The first session runs on Google Meet at the time you confirmed, and you and the tutor settle into a consistent weekly rhythm from there.",
      details: [
        "Match based on subject expertise and student personality",
        "Tutor and student meet on Google Meet — no software to install",
        "Weekly recurring time slot — the same tutor every week",
        "Reschedule with at least 48 hours notice at no charge",
      ],
    },
  ];

  return (
    <React.Fragment>
      <section className="page-hero" data-screen-label="How it works hero">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h1>Three steps. About a week. <em>No commitments before you meet your tutor.</em></h1>
          <p className="page-hero__lede">
            We've kept this lightweight on purpose. Submitting the form doesn't
            sign you up for anything — it just starts a conversation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps-detailed">
            {steps.map((s, i) => (
              <div className="step-detailed" key={i}>
                <div className="step-detailed__num">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="step-detailed__body">
                  <div className="step-detailed__icon">
                    <Icon name={s.icon} size={24} strokeWidth={1.8} />
                  </div>
                  <h2>{s.title}</h2>
                  <p className="step-detailed__lead">{s.lead}</p>
                  <p>{s.body}</p>
                  <ul className="step-detailed__list">
                    {s.details.map((d, j) => (
                      <li key={j}>
                        <Icon name="check" size={16} />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card__icon">
                <Icon name="inbox" size={22} strokeWidth={1.8} />
              </div>
              <h3>What happens after you submit</h3>
              <p>
                Your request lands in our team inbox immediately. We review the
                subjects, grade, and schedule constraints, then queue up a
                discovery call within 1–2 business days. You'll get a confirmation
                email right after submitting with a copy of what you sent and a
                note on when to expect us.
              </p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <Icon name="video" size={22} strokeWidth={1.8} />
              </div>
              <h3>What the first session looks like</h3>
              <p>
                A 60-minute call on Google Meet. The first 10–15 minutes are about
                getting to know the student — what they're working on, what's
                confusing, what kind of teaching has worked before. Then it's
                straight into the material — usually the unit they're stuck on
                or the next test they're preparing for.
              </p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <Icon name="users-round" size={22} strokeWidth={1.8} />
              </div>
              <h3>How tutors are matched</h3>
              <p>
                We never assign a generalist. Every tutor on our roster has
                personally taken the course they teach and scored in the top of
                their class. We match on subject first, then schedule, then
                personality — because the best tutor for an anxious Grade 11
                student isn't the same one for a fast-moving university first-year.
              </p>
            </div>
            <div className="info-card">
              <div className="info-card__icon">
                <Icon name="calendar-check" size={22} strokeWidth={1.8} />
              </div>
              <h3>Scheduling and rescheduling</h3>
              <p>
                Sessions run on a weekly recurring slot — same time, same tutor.
                Our standard policy (free, included for all students): regular
                sessions can be rescheduled with at least 48 hours notice at no
                charge. The goal is consistency without rigidity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section page-cta">
        <div className="container page-cta__inner">
          <h2>Ready to get started?</h2>
          <p>It's a 2-minute form. We'll be in touch within 1–2 business days.</p>
          <a href="Contact Us.html" className="btn btn-primary btn-lg">
            Book a free consultation
            <Icon name="arrow-right" size={18} />
          </a>
        </div>
      </section>
    </React.Fragment>
  );
}

window.HowItWorksPage = HowItWorksPage;
