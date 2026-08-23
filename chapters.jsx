// Chapter markers, reading-progress bar, and a right-side section indicator.

const CHAPTERS = [
  { id: "top",     n: "00", label: "Index" },
  { id: "work",    n: "02", label: "Selected Work" },
  { id: "about",   n: "03", label: "About" },
  { id: "resume",  n: "05", label: "Curriculum Vitae" },
  { id: "contact", n: "06", label: "Contact" },
];

function ReadingProgress() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.min(1, Math.max(0, scrolled / max));
      if (ref.current) ref.current.style.transform = `scaleX(${pct})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return (
    <>
      <div className="rp">
        <div ref={ref} className="rp-fill" />
      </div>
      <style>{`
        .rp{position:fixed;top:0;left:0;right:0;height:2px;z-index:60;
          background:transparent;pointer-events:none}
        .rp-fill{height:100%;background:var(--accent);transform-origin:left center;
          transform:scaleX(0);transition:transform .12s linear;
          box-shadow:0 0 10px var(--accent-glow)}
      `}</style>
    </>
  );
}

function SectionIndicator() {
  const [active, setActive] = React.useState("top");
  React.useEffect(() => {
    const ids = CHAPTERS.map(c => c.id);
    const update = () => {
      const pos = window.scrollY + window.innerHeight * 0.4;
      let cur = "top";
      for (const id of ids) {
        const el = id === "top" ? document.body : document.getElementById(id);
        if (!el) continue;
        const top = id === "top" ? 0 : el.offsetTop;
        if (top <= pos) cur = id;
      }
      setActive(cur);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <aside className="si" aria-label="Section indicator">
        {CHAPTERS.map((c) => (
          <a key={c.id} href={c.id === "top" ? "#top" : `#${c.id}`}
             className={"si-row" + (active === c.id ? " si-on" : "")}
             data-cursor={c.label}>
            <span className="si-n">{c.n}</span>
            <span className="si-bar"></span>
            <span className="si-l">{c.label}</span>
          </a>
        ))}
      </aside>
      <style>{`
        .si{position:fixed;right:18px;top:50%;transform:translateY(-50%);z-index:40;
          display:flex;flex-direction:column;gap:4px;
          padding:10px 8px;background:rgba(10,10,10,.5);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          border:1px solid var(--line);border-radius:99px}
        .si-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:99px;
          color:var(--fg-3);font:500 10px/1 var(--mono);text-transform:uppercase;letter-spacing:.08em;
          transition:color .25s,background .25s;cursor:none}
        .si-row:hover{color:var(--fg)}
        .si-n{opacity:.7}
        .si-bar{width:10px;height:1px;background:currentColor;opacity:.4;transition:width .35s cubic-bezier(.2,.7,.2,1),opacity .35s}
        .si-l{max-width:0;overflow:hidden;white-space:nowrap;opacity:0;
          transition:max-width .35s cubic-bezier(.2,.7,.2,1),opacity .25s}
        .si-row:hover .si-l,.si-on .si-l{max-width:160px;opacity:1}
        .si-row:hover .si-bar,.si-on .si-bar{width:18px;opacity:1}
        .si-on{color:var(--accent);background:rgba(255,85,0,.08)}
        @media (max-width:980px){.si{display:none}}
      `}</style>
    </>
  );
}

function ChapterFlash() {
  const [flash, setFlash] = React.useState(null);
  const lastId = React.useRef(null);
  const firstFire = React.useRef(true);
  React.useEffect(() => {
    let to;
    const ids = CHAPTERS.filter(c => c.id !== "top").map(c => c.id);
    const update = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let cur = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) cur = id;
      }
      if (cur && cur !== lastId.current) {
        lastId.current = cur;
        // skip the very first detection (user lands on hero, no flash needed)
        if (firstFire.current) { firstFire.current = false; return; }
        const ch = CHAPTERS.find(c => c.id === cur);
        if (!ch) return;
        setFlash(ch);
        clearTimeout(to);
        to = setTimeout(() => setFlash(null), 1500);
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { clearTimeout(to); window.removeEventListener("scroll", update); };
  }, []);

  return (
    <>
      <div className="cf" aria-hidden>
        {flash && (
          <div key={flash.id} className="cf-card">
            <div className="cf-n">{flash.n}</div>
            <div className="cf-l">{flash.label}</div>
          </div>
        )}
      </div>
      <style>{`
        .cf{position:fixed;left:32px;bottom:32px;z-index:50;pointer-events:none}
        .cf-card{display:flex;align-items:baseline;gap:14px;
          padding:14px 18px;border-radius:12px;background:rgba(10,10,10,.78);
          border:1px solid var(--accent);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          animation:cfIn .35s cubic-bezier(.2,.7,.2,1),cfOut .35s cubic-bezier(.55,0,.3,1) 1.1s forwards;
          box-shadow:0 20px 40px -10px var(--accent-glow)}
        .cf-n{font:500 11px/1 var(--mono);color:var(--accent);letter-spacing:.1em}
        .cf-l{font:500 18px/1 var(--sans);letter-spacing:-.01em;color:var(--fg)}
        @keyframes cfIn{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
        @keyframes cfOut{to{opacity:0;transform:translateY(-6px) scale(.98)}}
        @media (max-width:760px){.cf{left:16px;bottom:16px}.cf-l{font-size:15px}}
      `}</style>
    </>
  );
}

window.ReadingProgress = ReadingProgress;
window.SectionIndicator = SectionIndicator;
window.ChapterFlash = ChapterFlash;
