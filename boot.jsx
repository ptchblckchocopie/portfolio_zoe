// Boot sequence — a brief cinematic intro that resolves into the hero.
// Numeric counter + scramble-locking name + status ticker. Skippable on click.

function Boot({ onDone }) {
  const [phase, setPhase] = React.useState(0);
  const [n, setN] = React.useState(0);
  const [name, setName] = React.useState("__________");
  const TARGET = "PABILLARAN"; // 10 chars
  const GLYPHS = "ZMDR/0123456789▮▍▎▒░+*?$%#";

  React.useEffect(() => {
    let done = false;
    const skip = () => { if (done) return; done = true; onDone(); };
    const onKey = (e) => { if (e.key === "Escape" || e.key === " " || e.key === "Enter") skip(); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", skip);

    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const e = t - t0;

      // Phase 1: 0–900ms — counter ramps to 6319
      if (e < 900) {
        const p = e / 900;
        setN(Math.floor(easeOut(p) * 6319));
        setPhase(1);
      }
      // Phase 2: 900–1800ms — name resolves left-to-right
      else if (e < 1800) {
        const p = (e - 900) / 900;
        const locked = Math.floor(p * TARGET.length);
        let s = "";
        for (let i = 0; i < TARGET.length; i++) {
          if (i < locked) s += TARGET[i];
          else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setName(s);
        setN(6319);
        setPhase(2);
      }
      // Phase 3: 1800–2400ms — ready state, then fade
      else if (e < 2400) {
        setName(TARGET);
        setPhase(3);
      } else {
        skip();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  return (
    <div className={"boot boot-p" + phase}>
      <div className="boot-grid">
        {Array.from({ length: 144 }).map((_, i) => <span key={i} />)}
      </div>

      <div className="boot-corners">
        <div className="bc bc-tl">
          <div>SYS / 01</div>
          <div>{["INIT","INIT","LOCK","READY"][phase]}</div>
        </div>
        <div className="bc bc-tr">
          <div>{phase >= 2 ? "PABILLARAN.PORTFOLIO" : "ESTABLISHING…"}</div>
          <div>v3.0 / 2026</div>
        </div>
        <div className="bc bc-bl">
          <div>8.4542° N</div>
          <div>124.6319° E</div>
        </div>
        <div className="bc bc-br">
          <div>UTC+08 · PHT</div>
          <div>{phase >= 2 ? "LINK STABLE" : "BUFFERING…"}</div>
        </div>
      </div>

      <div className="boot-center">
        <div className="boot-counter">
          <span className="bn">{String(n).padStart(4, "0")}</span>
          <span className="bd">/ 6319</span>
        </div>
        <div className="boot-name">
          <span className="bzmd">ZMD ·</span>
          <span className="btarget">{name}</span>
        </div>
        <div className="boot-bar">
          <div className="boot-bar-fill" style={{ width: phase >= 3 ? "100%" : phase >= 2 ? "92%" : (n / 6319 * 88) + "%" }} />
        </div>
        <div className="boot-status">
          <span className={phase >= 3 ? "ok" : ""}>{["BOOTING","LOADING","RESOLVING","READY"][phase]}</span>
          <span>—</span>
          <span style={{opacity:.6}}>tap to skip</span>
        </div>
      </div>

      <style>{`
        .boot{position:fixed;inset:0;z-index:10000;background:#0a0a0a;color:var(--fg);
          font-family:var(--mono);user-select:none;opacity:1}
        .boot-p3{animation:bootOut .65s cubic-bezier(.55,0,.3,1) forwards;pointer-events:none}
        @keyframes bootOut{
          0%{opacity:1;clip-path:inset(0 0 0 0)}
          60%{opacity:1;clip-path:inset(0 0 0 0)}
          100%{opacity:0;clip-path:inset(0 0 100% 0)}
        }
        .boot-grid{position:absolute;inset:0;display:grid;
          grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(12,1fr);
          opacity:.25;pointer-events:none}
        .boot-grid span{border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
        .boot-corners{position:absolute;inset:24px;pointer-events:none;
          font:500 10px/1.4 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--fg-2)}
        .bc{position:absolute;display:flex;flex-direction:column;gap:2px}
        .bc-tl{top:0;left:0}.bc-tr{top:0;right:0;text-align:right}
        .bc-bl{bottom:0;left:0}.bc-br{bottom:0;right:0;text-align:right}
        .bc>div:first-child{color:var(--accent)}
        .boot-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
          width:min(560px,86vw);display:flex;flex-direction:column;gap:18px;align-items:flex-start}
        .boot-counter{display:flex;align-items:baseline;gap:8px;
          font:500 11px/1 var(--mono);letter-spacing:.1em;color:var(--fg-3);text-transform:uppercase}
        .bn{color:var(--accent);font-variant-numeric:tabular-nums;font-size:13px}
        .boot-name{font:600 clamp(28px,4.4vw,52px)/1 var(--sans);
          letter-spacing:-.03em;color:var(--fg);
          display:flex;align-items:baseline;gap:12px;white-space:nowrap;width:100%}
        .bzmd{color:var(--fg-3);font-weight:400}
        .btarget{color:var(--fg);font-variant-numeric:tabular-nums}
        .boot-bar{width:100%;height:2px;background:var(--line);position:relative;overflow:hidden}
        .boot-bar-fill{height:100%;background:var(--accent);
          transition:width .3s cubic-bezier(.2,.7,.2,1);
          box-shadow:0 0 12px var(--accent-glow)}
        .boot-status{display:flex;gap:10px;align-items:center;
          font:500 10px/1 var(--mono);letter-spacing:.12em;color:var(--fg-2);text-transform:uppercase}
        .boot-status .ok{color:var(--accent)}
      `}</style>
    </div>
  );
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
window.Boot = Boot;
