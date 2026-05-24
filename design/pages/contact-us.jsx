// ============================================================
// Contact Us — dedicated consultation page
// ============================================================

function ContactUsPage() {
  return (
    <React.Fragment>
      <section className="page-hero" data-screen-label="Contact hero">
        <div className="container">
          <span className="eyebrow">Get in touch</span>
          <h1>Let's <em>talk.</em></h1>
          <p className="page-hero__lede">
            Tell us about the student. We'll be in touch within 1–2 business days
            — usually faster — to put together a plan.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            <aside className="contact-info">
              <div className="contact-info__card">
                <h3>Reach us directly</h3>
                <ul className="contact-info__list">
                  <li>
                    <Icon name="mail" size={18} />
                    <div>
                      <div className="contact-info__label">Email</div>
                      <a href="mailto:palseduacademy@gmail.com">palseduacademy@gmail.com</a>
                    </div>
                  </li>
                  <li>
                    <Icon name="clock" size={18} />
                    <div>
                      <div className="contact-info__label">Response time</div>
                      <div>We respond within 1–2 business days.</div>
                    </div>
                  </li>
                  <li>
                    <Icon name="map-pin" size={18} />
                    <div>
                      <div className="contact-info__label">Based in</div>
                      <div>The Greater Toronto Area — sessions are fully online via Google Meet.</div>
                    </div>
                  </li>
                  <li>
                    <FacebookIcon size={18} />
                    <div>
                      <div className="contact-info__label">Follow along</div>
                      <a href="https://www.facebook.com/profile.php?id=61589193897066" target="_blank" rel="noopener noreferrer">Facebook</a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="contact-info__note">
                <Icon name="info" size={16} />
                <span>The form is the fastest way to reach us. Email is great for follow-ups once we've connected.</span>
              </div>
            </aside>

            <div className="contact-form-wrap">
              <ConsultForm />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.ContactUsPage = ContactUsPage;
