// ============================================================
// PAL's Academy — Consultation form (interactive)
// ============================================================

const HS_SUBJECTS = [
  { name: "Functions", code: "MCR3U" },
  { name: "Advanced Functions", code: "MHF4U" },
  { name: "Calculus & Vectors", code: "MCV4U" },
  { name: "Biology", code: "SBI3U / SBI4U" },
  { name: "Chemistry", code: "SCH3U / SCH4U" },
  { name: "Physics", code: "SPH3U / SPH4U" },
  { name: "English", code: "ENG1W / 2D / 3U / 4U" },
  { name: "French", code: "FSF1D / 2D / 3U / 4U" },
  { name: "Other" },
];

const UNI_SUBJECTS = [
  { name: "Calculus I or II" },
  { name: "Biology I or II" },
  { name: "General Chemistry I or II" },
  { name: "Organic Chemistry I or II" },
  { name: "Physics I or II" },
  { name: "Other" },
];

const GRADE_OPTIONS = [
  "Grade 11",
  "Grade 12",
  "First-year university",
  "Other",
];

function ConsultForm() {
  const [studentName, setStudentName] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [subjects, setSubjects] = React.useState([]);
  const [contactPref, setContactPref] = React.useState("email"); // email | phone
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const toggleSubject = (s) => {
    setSubjects((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );
    setErrors((e) => ({ ...e, subjects: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!studentName.trim()) e.studentName = "Please enter the student's name.";
    if (!grade) e.grade = "Pick a grade or year.";
    if (subjects.length === 0) e.subjects = "Pick at least one subject.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address.";
    }
    if (contactPref === "phone") {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) e.phone = "Enter a phone number (10+ digits).";
    }
    return e;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // focus first error field
      const firstKey = Object.keys(e)[0];
      const node = document.querySelector(`[data-field="${firstKey}"] .input, [data-field="${firstKey}"]`);
      if (node) {
        const rect = node.getBoundingClientRect();
        const y = window.scrollY + rect.top - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
        if (node.focus) setTimeout(() => node.focus(), 350);
      }
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div className="consult__card">
        <div className="success">
          <div className="success__badge">
            <Icon name="check" size={32} strokeWidth={2.5} />
          </div>
          <h3>
            Thanks, {studentName.split(" ")[0] || "there"} — <em>we're on it.</em>
          </h3>
          <p>
            We've got your request. A member of the team will be in touch within
            1–2 business days
            {contactPref === "phone" ? (
              <> by phone at <strong>{phone}</strong></>
            ) : (
              <> by email at <strong>{email}</strong></>
            )}
            .
          </p>
          <div className="success__what-next">
            <h4>What happens next</h4>
            <ul>
              <li>We'll review the subjects you flagged and shortlist tutors.</li>
              <li>A 15-min call to confirm goals, schedule, and the right format.</li>
              <li>You meet your tutor — usually within the week.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="consult__card" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field span-2" data-field="studentName">
          <label className="field-label" htmlFor="f-name">
            Student's name <span className="req">*</span>
          </label>
          <input
            id="f-name"
            className={"input" + (errors.studentName ? " error" : "")}
            type="text"
            placeholder="e.g. Aisha Khan"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value);
              setErrors((er) => ({ ...er, studentName: undefined }));
            }}
            autoComplete="name"
          />
          {errors.studentName && (
            <span className="field-error">{errors.studentName}</span>
          )}
        </div>

        <div className="field span-2" data-field="grade">
          <label className="field-label" htmlFor="f-grade">
            Grade level or year <span className="req">*</span>
          </label>
          <select
            id="f-grade"
            className={"input" + (errors.grade ? " error" : "")}
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
              setErrors((er) => ({ ...er, grade: undefined }));
            }}
          >
            <option value="">Select grade or year…</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.grade && <span className="field-error">{errors.grade}</span>}
        </div>

        <div className="field span-2" data-field="subjects">
          <label className="field-label">
            Subject(s) needed <span className="req">*</span>
          </label>
          <span className="field-help">Pick all that apply.</span>

          <div className="subj-cat-label">High school <span>(Grade 9–12)</span></div>
          <div className="checkbox-grid" role="group" aria-label="High school subjects">
            {HS_SUBJECTS.map((s) => {
              const key = "HS:" + s.name;
              const active = subjects.includes(key);
              return (
                <label
                  key={key}
                  className={"check" + (active ? " active" : "")}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggleSubject(key);
                  }}
                >
                  <input type="checkbox" checked={active} readOnly tabIndex={-1} />
                  <span className="check__box">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5L6.5 12L13 4.5"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="check__body">
                    <span className="check__name">{s.name}</span>
                    {s.code && <span className="check__code">{s.code}</span>}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="subj-cat-label subj-cat-label--uni">First-year university</div>
          <div className="checkbox-grid" role="group" aria-label="First-year university subjects">
            {UNI_SUBJECTS.map((s) => {
              const key = "UNI:" + s.name;
              const active = subjects.includes(key);
              return (
                <label
                  key={key}
                  className={"check" + (active ? " active" : "")}
                  onClick={(ev) => {
                    ev.preventDefault();
                    toggleSubject(key);
                  }}
                >
                  <input type="checkbox" checked={active} readOnly tabIndex={-1} />
                  <span className="check__box">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8.5L6.5 12L13 4.5"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="check__body">
                    <span className="check__name">{s.name}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {errors.subjects && (
            <span className="field-error">{errors.subjects}</span>
          )}
        </div>

        <div className="field span-2">
          <label className="field-label">
            Preferred contact method <span className="req">*</span>
          </label>
          <div className="seg" role="tablist" aria-label="Contact method">
            <button
              type="button"
              className={"seg__opt" + (contactPref === "email" ? " active" : "")}
              onClick={() => setContactPref("email")}
              aria-pressed={contactPref === "email"}
            >
              <Icon name="mail" size={16} />
              Email
            </button>
            <button
              type="button"
              className={"seg__opt" + (contactPref === "phone" ? " active" : "")}
              onClick={() => setContactPref("phone")}
              aria-pressed={contactPref === "phone"}
            >
              <Icon name="phone" size={16} />
              Phone
            </button>
          </div>
        </div>

        <div className="field" data-field="email">
          <label className="field-label" htmlFor="f-email">
            Email <span className="req">*</span>
          </label>
          <input
            id="f-email"
            className={"input" + (errors.email ? " error" : "")}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((er) => ({ ...er, email: undefined }));
            }}
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="field" data-field="phone">
          <label className="field-label" htmlFor="f-phone">
            Phone {contactPref === "phone" && <span className="req">*</span>}
            {contactPref === "email" && (
              <span style={{ color: "var(--color-fg-3)", fontWeight: 400, marginLeft: 4 }}>
                (optional)
              </span>
            )}
          </label>
          <input
            id="f-phone"
            className={"input" + (errors.phone ? " error" : "")}
            type="tel"
            placeholder="(416) 555-0142"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((er) => ({ ...er, phone: undefined }));
            }}
            autoComplete="tel"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <div className="span-2 submit-row">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Icon name="loader-circle" size={18} />
                Sending…
              </>
            ) : (
              <>
                Request your free consultation
                <Icon name="arrow-right" size={18} />
              </>
            )}
          </button>
          <div className="submit-note">
            <Icon name="lock" size={14} />
            We'll reach out within 1–2 business days. Your info stays private. No spam, no auto-enrollment.
          </div>
        </div>
      </div>
    </form>
  );
}

function ConsultSection() {
  return (
    <section className="section consult" id="consult" data-screen-label="Consultation">
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="section-head">
          <span className="eyebrow">Get started</span>
          <h2>
            Ready to get started? <em>Let's talk.</em>
          </h2>
          <p>
            Tell us about the student. We'll be in touch within 1–2 business days
            to put together a plan — no obligation.
          </p>
        </div>
        <ConsultForm />
      </div>
    </section>
  );
}

Object.assign(window, { ConsultForm, ConsultSection });
