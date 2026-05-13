// Main app — composes everything + Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ff5500",
  "heroVariant": "field",
  "cursor": "minimal",
  "showBoot": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [booted, setBooted] = React.useState(() => sessionStorage.getItem("zmd:booted") === "1" || !t.showBoot);
  useReveal();

  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
    document.documentElement.style.setProperty("--accent-glow", t.accent + "55");
  }, [t.accent]);

  const finishBoot = React.useCallback(() => {
    sessionStorage.setItem("zmd:booted", "1");
    setBooted(true);
  }, []);

  return (
    <div id="top">
      {!booted && t.showBoot && <Boot onDone={finishBoot} />}

      <Cursor style={t.cursor} />
      <ReadingProgress />
      <SectionIndicator />
      <ChapterFlash />

      <Nav />
      <Hero variant={t.heroVariant} accent={t.accent} />
      <Work />
      <About />
      <Resume />
      <Assistant />
      <Contact />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent" />
        <TweakColor label="Color" value={t.accent}
          options={["#ff5500", "#5b8cff", "#3fdc6e", "#b347ff", "#ff4d6d", "#f5f5f5"]}
          onChange={(v) => setTweak("accent", v)} />

        <TweakSection label="Hero animation" />
        <TweakRadio label="Variant" value={t.heroVariant}
          options={[
            {value:"field",label:"Field"},
            {value:"orbit",label:"Orbit"},
            {value:"glyph",label:"Glyph"},
          ]}
          onChange={(v) => setTweak("heroVariant", v)} />

        <TweakSection label="Cursor" />
        <TweakRadio label="Style" value={t.cursor}
          options={[
            {value:"minimal",label:"Minimal"},
            {value:"off",label:"Native"},
          ]}
          onChange={(v) => setTweak("cursor", v)} />

        <TweakSection label="Intro" />
        <TweakButton label="Replay boot sequence"
          onClick={() => { sessionStorage.removeItem("zmd:booted"); location.reload(); }} />

        <TweakSection label="Compare" />
        <TweakButton label="Open v2 (Y2K cybernetic)"
          onClick={() => { window.location.href = "v2.html"; }} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
