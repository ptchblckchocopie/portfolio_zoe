// Hero: interactive animated stage with dot field and reactive name
// Variants: "field" (dot grid that warps to cursor), "orbit" (particle constellation), "glyph" (cycling glyph stack)

function Hero({ variant = "field", accent = "#ff5500" }) {
  return (
    <header className="hero">
      <div className="hero-bg">
        {variant === "field" && <DotField accent={accent} />}
        {variant === "orbit" && <Orbit accent={accent} />}
        {variant === "glyph" && <Glyph accent={accent} />}
      </div>

      <div className="hero-grid container">
        <div className="hero-meta hero-meta-l">
          <div className="meta-block">
            <div className="meta-k">/ Portfolio</div>
            <div className="meta-v">2024–2026</div>
          </div>
          <div className="meta-block">
            <div className="meta-k">/ Index</div>
            <div className="meta-v">01–05 selected</div>
          </div>
        </div>

        <div className="hero-name">
          <MagnetText text="ZOE MART" />
          <div className="hero-name-row">
            <span className="hero-tag"><em>derick r.</em></span>
            <MagnetText text="PABILLARAN" />
          </div>
        </div>

        <div className="hero-meta hero-meta-r">
          <div className="meta-block ar">
            <div className="meta-k">/ Discipline</div>
            <div className="meta-v">Full-Stack <span className="amp">×</span> AI</div>
          </div>
          <div className="meta-block ar">
            <div className="meta-k">/ Locale</div>
            <div className="meta-v"><LiveTime /></div>
          </div>
        </div>

        <div className="hero-strap">
          <div className="strap-l">
            <span className="dot-live" />
            <span>Available for select projects · Q3 / Q4 ’26</span>
          </div>
          <div className="strap-r">
            <span className="scroll-cue">
              <span>Scroll</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <Marquee />

      <style>{`
        .hero{position:relative;min-height:100vh;display:flex;flex-direction:column;
          justify-content:flex-end;padding-top:120px;padding-bottom:0;overflow:hidden;
          border-top:none}
        .hero-bg{position:absolute;inset:0;z-index:0}
        .hero-grid{position:relative;z-index:2;display:grid;
          grid-template-columns:1fr auto 1fr;grid-template-rows:auto auto;
          gap:24px 32px;align-items:start;width:100%;padding-bottom:32px}
        .hero-name{grid-column:1/-1;grid-row:1;display:flex;flex-direction:column;
          align-items:center;text-align:center;line-height:.88;
          padding:48px 0 24px}
        .hero-name-row{display:flex;align-items:baseline;gap:24px;flex-wrap:wrap;justify-content:center}
        .hero-tag{font-family:var(--serif);font-style:italic;font-weight:400;
          font-size:clamp(28px,4vw,56px);color:var(--fg-2)}
        .hero-meta{display:flex;flex-direction:column;gap:24px;grid-row:2;align-self:end}
        .hero-meta-l{grid-column:1}
        .hero-meta-r{grid-column:3;text-align:right}
        .meta-block{display:flex;flex-direction:column;gap:6px}
        .meta-block.ar{align-items:flex-end}
        .meta-k{font:500 11px/1 var(--mono);text-transform:uppercase;letter-spacing:.1em;color:var(--fg-3)}
        .meta-v{font:500 13px/1.4 var(--mono);color:var(--fg)}
        .meta-v .amp{color:var(--accent);margin:0 4px}
        .hero-strap{grid-column:1/-1;grid-row:3;display:flex;justify-content:space-between;
          align-items:center;padding-top:24px;border-top:1px solid var(--line);
          font:500 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--fg-2)}
        .strap-l{display:flex;align-items:center;gap:12px}
        .dot-live{width:8px;height:8px;border-radius:50%;background:#3fdc6e;
          box-shadow:0 0 12px rgba(63,220,110,.55);animation:pulse 2s infinite ease-in-out}
        .scroll-cue{display:inline-flex;align-items:center;gap:8px;color:var(--fg-2)}
        .scroll-cue svg{animation:bob 1.6s infinite ease-in-out;color:var(--accent)}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}

        /* Magnet text */
        .mt{display:inline-flex;font-family:var(--sans);font-weight:600;
          font-size:clamp(56px,11.5vw,180px);letter-spacing:-.05em;line-height:.88;
          color:var(--fg)}
        .mt-c{display:inline-block;transition:transform .3s cubic-bezier(.2,.7,.2,1),color .3s}
        .mt-c.sp{width:.32em}

        @media (max-width:760px){
          .hero-grid{grid-template-columns:1fr}
          .hero-meta-l,.hero-meta-r{grid-column:1;text-align:left;align-items:flex-start}
          .hero-meta-r .meta-block.ar{align-items:flex-start}
          .hero-meta-r{text-align:left}
          .hero-name{padding:24px 0 12px}
          .hero-strap{flex-direction:column;gap:12px;align-items:flex-start}
        }
      `}</style>
    </header>
  );
}

// Reactive letters: each letter has a per-letter magnet offset based on cursor proximity
function MagnetText({ text }) {
  const wrap = React.useRef(null);
  React.useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const chars = Array.from(el.querySelectorAll(".mt-c"));
    let raf;
    const state = chars.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));
    const onMove = (e) => {
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = e.clientX - cx, dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const max = 220;
        if (dist < max) {
          const f = (1 - dist / max) * 28;
          state[i].tx = (dx / dist) * f;
          state[i].ty = (dy / dist) * f;
        } else {
          state[i].tx = 0; state[i].ty = 0;
        }
      });
    };
    const tick = () => {
      chars.forEach((c, i) => {
        state[i].x += (state[i].tx - state[i].x) * 0.16;
        state[i].y += (state[i].ty - state[i].y) * 0.16;
        c.style.transform = `translate(${state[i].x}px, ${state[i].y}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, [text]);
  return (
    <span ref={wrap} className="mt" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} className={"mt-c " + (ch === " " ? "sp" : "")} aria-hidden>{ch === " " ? "" : ch}</span>
      ))}
    </span>
  );
}

// Dot field: canvas of dots that displace away from cursor
function DotField({ accent }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let mouse = { x: -9999, y: -9999, t: 0 };
    let dots = [];
    let w = 0, h = 0, gap = 28;

    function rebuild() {
      const rect = cv.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(w / gap) + 2;
      const rows = Math.ceil(h / gap) + 2;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const ox = x * gap, oy = y * gap;
        dots.push({ ox, oy, x: ox, y: oy });
      }
    }
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(cv);

    const onMove = (e) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.t = performance.now();
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const tick = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.ox - mouse.x, dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const max = 160;
        let tx = d.ox, ty = d.oy, r0 = 1, alpha = 0.22, col = "255,255,255";
        if (dist < max) {
          const f = (1 - dist / max);
          const push = f * 36;
          tx += (dx / dist) * push;
          ty += (dy / dist) * push;
          r0 = 1 + f * 1.6;
          alpha = 0.22 + f * 0.7;
          if (f > 0.35) col = hexToRgb(accent);
        }
        // slow drift
        tx += Math.sin((t * 0.0006) + d.ox * 0.01) * 0.6;
        ty += Math.cos((t * 0.0006) + d.oy * 0.01) * 0.6;
        d.x += (tx - d.x) * 0.18;
        d.y += (ty - d.y) * 0.18;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("mousemove", onMove); };
  }, [accent]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// Orbit: particle constellation, click attracts
function Orbit({ accent }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;
    let particles = [];
    let mouse = { x: -9999, y: -9999, down: false };

    function rebuild() {
      const rect = cv.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = Math.min(160, Math.floor(w * h / 9000));
      particles = Array.from({ length: N }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
      }));
    }
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(cv);

    const onMove = (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
    const onDown = () => { mouse.down = true; };
    const onUp = () => { mouse.down = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = hexToRgb(accent);
      for (const p of particles) {
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const f = (1 - dist / 180) * (mouse.down ? 0.6 : 0.04);
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      // links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 90) {
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - d / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        const md = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        ctx.fillStyle = md < 120 ? `rgba(${rgb},.95)` : "rgba(255,255,255,.55)";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp); };
  }, [accent]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

// Glyph cascade: columns of cycling unicode glyphs, like a calmer Matrix
function Glyph({ accent }) {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;
    const glyphs = "▲◆●▮◇△○□+-/×{}<>";
    let cols = [];
    function rebuild() {
      const rect = cv.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colW = 26;
      const n = Math.ceil(w / colW);
      cols = Array.from({ length: n }, (_, i) => ({
        x: i * colW + colW / 2,
        y: Math.random() * h,
        speed: .3 + Math.random() * 1.2,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        flick: Math.random() * 100,
      }));
    }
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(cv);
    let raf, frame = 0;
    const tick = () => {
      ctx.fillStyle = "rgba(10,10,10,.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = "12px Geist Mono, monospace";
      ctx.textAlign = "center";
      const rgb = hexToRgb(accent);
      for (const c of cols) {
        c.y += c.speed;
        c.flick -= 1;
        if (c.flick < 0) { c.glyph = glyphs[Math.floor(Math.random() * glyphs.length)]; c.flick = 30 + Math.random() * 90; }
        if (c.y > h + 12) { c.y = -12; c.speed = .3 + Math.random() * 1.2; }
        const isAccent = Math.abs((frame + c.x * 0.7) % 200) < 6;
        ctx.fillStyle = isAccent ? `rgba(${rgb},.9)` : "rgba(255,255,255,.18)";
        ctx.fillText(c.glyph, c.x, c.y);
      }
      frame++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [accent]);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function LiveTime() {
  const [t, setT] = React.useState(() => fmtTime());
  React.useEffect(() => { const id = setInterval(() => setT(fmtTime()), 1000); return () => clearInterval(id); }, []);
  return <>Cagayan de Oro <span style={{color:"var(--fg-3)"}}>·</span> {t}</>;
}
function fmtTime() {
  try {
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second:"2-digit", hour12: false, timeZone: "Asia/Manila" }).format(new Date()) + " PHT";
  } catch (e) { return new Date().toLocaleTimeString(); }
}

function Marquee() {
  const items = ["Full-Stack Development", "SvelteKit · React", "FastAPI · Express", "PostgreSQL · Redis", "AI · RAG · LLMs", "Real-Time Systems", "Docker · DevOps", "Prototyping"];
  return (
    <div className="marq">
      <div className="marq-track">
        {[0,1].map(k => (
          <div className="marq-set" key={k} aria-hidden={k===1}>
            {items.map((it, i) => (
              <span className="marq-item" key={i}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 4.2L13 7l-4.2 1.8L7 13 5.2 8.8 1 7l4.2-1.8L7 1z" fill="currentColor"/></svg>
                {it}
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        .marq{position:relative;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
          overflow:hidden;padding:18px 0;background:rgba(255,255,255,.01);z-index:2}
        .marq-track{display:flex;width:max-content;animation:marq 28s linear infinite}
        .marq-set{display:flex;gap:48px;padding-right:48px}
        .marq-item{display:inline-flex;align-items:center;gap:12px;font:500 14px/1 var(--mono);
          letter-spacing:.04em;text-transform:uppercase;color:var(--fg-2)}
        .marq-item svg{color:var(--accent)}
        @keyframes marq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>
    </div>
  );
}

window.Hero = Hero;
