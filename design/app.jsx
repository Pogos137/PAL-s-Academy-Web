// ============================================================
// PAL's Academy — App root
// ============================================================

function App() {
  const scrollToConsult = React.useCallback(() => {
    const el = document.getElementById("consult");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const y = window.scrollY + rect.top - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  // Smooth in-page anchors (header/footer links)
  React.useEffect(() => {
    const onClick = (ev) => {
      const a = ev.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      const y = window.scrollY + rect.top - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <React.Fragment>
      <Header onCTA={scrollToConsult} current="home" />
      <main>
        <Hero onCTA={scrollToConsult} />
        <StatsBar />
        <HowItWorks />
        <Subjects />
        <TutorTeaser />
        <WhyUs />
        <ConsultSection />
      </main>
      <Footer />
      <PalsTweaks />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
