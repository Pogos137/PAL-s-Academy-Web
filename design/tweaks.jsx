// ============================================================
// PAL's Academy — Tweaks panel
// Three expressive controls: Palette / Headline / Atmosphere
// Each option toggles a body class that reshapes many properties.
// ============================================================

function PalsTweaks() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  // Apply tweaks to <body> by swapping class names. Each control owns its
  // own slot so they compose: palette × headline × atmos = 4×3×3 = 36 combos.
  React.useEffect(() => {
    const body = document.body;
    // strip any palette-/headline-/atmos- class then add the active ones
    const keep = [...body.classList].filter(
      (c) => !c.startsWith("palette-") && !c.startsWith("headline-") && !c.startsWith("atmos-")
    );
    const next = [...keep];
    if (t.palette && t.palette !== "academic") next.push("palette-" + t.palette);
    if (t.headline && t.headline !== "modern") next.push("headline-" + t.headline);
    if (t.atmos && t.atmos !== "quiet") next.push("atmos-" + t.atmos);
    body.className = next.join(" ");
  }, [t.palette, t.headline, t.atmos]);

  // Curated palettes — each value is an array so TweakColor renders it as a
  // swatch group: [primary, dark surface, accent, page bg]
  const PALETTES = {
    academic: ["#114E40", "#082E26", "#C99A2A", "#FAF8F4"],
    midnight: ["#1F3A8A", "#0B1A47", "#C99A2A", "#F6F4ED"],
    crimson:  ["#8E2A2A", "#4D1414", "#B58A2E", "#FAF4ED"],
    sage:     ["#3D5A3D", "#1E3022", "#B5742A", "#F7F4EB"],
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Mood"
        value={PALETTES[t.palette] || PALETTES.academic}
        options={Object.values(PALETTES)}
        onChange={(v) => {
          // map array back to key
          const key = Object.keys(PALETTES).find(
            (k) => PALETTES[k].join() === (Array.isArray(v) ? v.join() : "")
          );
          setTweak("palette", key || "academic");
        }}
      />
      <div style={paletteLabelStyle}>
        <span style={paletteNameStyle}>
          {{
            academic: "Academic teal",
            midnight: "Midnight navy",
            crimson:  "Crimson scholar",
            sage:     "Sage library",
          }[t.palette] || "Academic teal"}
        </span>
        <span style={paletteHintStyle}>Swaps primary, dark surfaces &amp; accent</span>
      </div>

      <TweakSection label="Headline character" />
      <TweakRadio
        label="Hero voice"
        value={t.headline}
        options={["modern", "editorial", "bold"]}
        onChange={(v) => setTweak("headline", v)}
      />
      <div style={paletteHintStyle}>
        {{
          modern:    "Sans display with a serif italic accent — the default.",
          editorial: "All Instrument Serif. Italic lede. Magazine energy.",
          bold:      "Heavy sans, highlighter on the emphasized word.",
        }[t.headline]}
      </div>

      <TweakSection label="Atmosphere" />
      <TweakRadio
        label="Rhythm"
        value={t.atmos}
        options={["quiet", "confident", "editorial"]}
        onChange={(v) => setTweak("atmos", v)}
      />
      <div style={paletteHintStyle}>
        {{
          quiet:     "Soft cards, gentle gradients, generous whitespace.",
          confident: "Dark step cards, gold splashes, alternating why-card tints.",
          editorial: "Hairline rules, big serif numerals, no decoration.",
        }[t.atmos]}
      </div>
    </TweaksPanel>
  );
}

const paletteLabelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  marginTop: -4,
  marginBottom: 6,
};
const paletteNameStyle = {
  font: "600 13px/1.2 var(--font-sans, sans-serif)",
  color: "#fff",
};
const paletteHintStyle = {
  font: "400 12px/1.4 var(--font-sans, sans-serif)",
  color: "rgba(255,255,255,0.55)",
  marginTop: -2,
  marginBottom: 6,
};

window.PalsTweaks = PalsTweaks;
