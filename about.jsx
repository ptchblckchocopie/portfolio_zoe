// About + Services + draggable-throwable skill chips

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-eyebrow">03 / About</div>
            <h2 className="section-title">A developer who <em>ships across the stack.</em></h2>
          </div>
          <div className="section-meta">
            <div>Based in Cagayan de Oro, PH</div>
            <div>Working globally</div>
            <div>Open to: contract, full-time, remote</div>
          </div>
        </div>

        <div className="about-grid">
          <div className="about-portrait reveal">
            <div className="ap-frame">
              <image-slot id="portrait" src="/portrait.jpg" placeholder="Drop a portrait photo" shape="rounded" radius="14"></image-slot>
            </div>
            <div className="ap-stamp">
              <div className="ap-stamp-rot">
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <defs>
                    <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/>
                  </defs>
                  <text fill="currentColor" style={{fontFamily:"Geist Mono",fontSize:"9.5px",letterSpacing:"4px"}}>
                    <textPath href="#circ">DESIGN · BUILD · SHIP · DESIGN · BUILD · SHIP · </textPath>
                  </text>
                </svg>
                <span className="ap-stamp-dot"></span>
              </div>
            </div>
          </div>

          <div className="about-body reveal">
            <p className="about-lead">
              I'm <strong>Zoe Mart</strong>, a full-stack developer based in Cagayan de Oro, building systems that have to <em>hold up in production</em>. At Veent Apps Inc. I shipped five of them across payments, AI chat, face recognition, live auctions, and ticketing. Each one runs against real users, real payments, and real traffic.
            </p>
            <p className="about-p">
              I'm comfortable end-to-end: SvelteKit or React on the front, FastAPI or Express on the back, PostgreSQL or MySQL in the middle. I reach for Redis when state has to move fast, pgvector when meaning matters, and Docker so the whole thing runs the same on my laptop as it does in production. The work I'm proudest of turns a manual hour into a clean second.
            </p>

            <div className="about-stats">
              <div><b>5</b><span>production systems shipped</span></div>
              <div><b>30+</b><span>technologies in rotation</span></div>
              <div><b>BS IT</b><span>USTP</span></div>
            </div>

            <ChipPit />
          </div>
        </div>

        <Services />
      </div>

      <style>{aboutStyles}</style>
    </section>
  );
}

// Drag-and-throw skill chips with momentum + collision
function ChipPit() {
  const pitRef = React.useRef(null);
  const chipsRef = React.useRef([]);
  const draggingRef = React.useRef(null);
  const SKILLS = [
    "TypeScript","JavaScript","Python","PHP","SQL","HTML/CSS",
    "SvelteKit","Svelte 5","React","React Native","Tailwind",
    "FastAPI","Express","Payload CMS","Node",
    "PostgreSQL","pgvector","Drizzle ORM","MySQL","Redis",
    "Docker","FreeRADIUS","OpenWRT","SSE","Maya",
    "Dify","Groq","Gemini","Prophet","pandas",
    "Figma","Git",
  ];

  React.useEffect(() => {
    const pit = pitRef.current;
    if (!pit) return;
    const rect = () => pit.getBoundingClientRect();

    // Initialize positions in a settled pile
    const pr = rect();
    chipsRef.current = SKILLS.map((label, i) => {
      const col = i % 6;
      const row = Math.floor(i / 6);
      return {
        x: 30 + col * 95 + Math.random() * 20,
        y: 30 + row * 50 + Math.random() * 10,
        vx: (Math.random() - .5) * 0.4,
        vy: (Math.random() - .5) * 0.4,
        w: 0, h: 0, // measured later
        rot: (Math.random() - .5) * 8,
        vr: 0,
        label,
      };
    });

    // measure each chip's actual size after mount
    const els = Array.from(pit.querySelectorAll(".chip-pill"));
    els.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      chipsRef.current[i].w = r.width;
      chipsRef.current[i].h = r.height;
    });

    let raf;
    const tick = () => {
      const r = rect();
      const chips = chipsRef.current;
      const drag = draggingRef.current;
      for (let i = 0; i < chips.length; i++) {
        const c = chips[i];
        if (drag && drag.idx === i) continue;
        // gravity-less drift toward rest, slight damping
        c.vx *= 0.96; c.vy *= 0.96; c.vr *= 0.92;
        c.x += c.vx; c.y += c.vy; c.rot += c.vr;
        // walls
        if (c.x < 0) { c.x = 0; c.vx *= -.45; }
        if (c.y < 0) { c.y = 0; c.vy *= -.45; }
        if (c.x + c.w > r.width) { c.x = r.width - c.w; c.vx *= -.45; }
        if (c.y + c.h > r.height) { c.y = r.height - c.h; c.vy *= -.45; c.vx *= 0.92; }
      }
      // chip-vs-chip collision (cheap AABB push apart)
      for (let i = 0; i < chips.length; i++) {
        for (let j = i + 1; j < chips.length; j++) {
          const a = chips[i], b = chips[j];
          const ax = a.x + a.w/2, ay = a.y + a.h/2;
          const bx = b.x + b.w/2, by = b.y + b.h/2;
          const dx = bx - ax, dy = by - ay;
          const ox = (a.w + b.w)/2 - Math.abs(dx);
          const oy = (a.h + b.h)/2 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (ox < oy) {
              const push = ox / 2 * (dx < 0 ? -1 : 1);
              if (!(drag && drag.idx === i)) a.x -= push;
              if (!(drag && drag.idx === j)) b.x += push;
              const e = (a.vx - b.vx) * 0.3;
              if (!(drag && drag.idx === i)) a.vx -= e;
              if (!(drag && drag.idx === j)) b.vx += e;
            } else {
              const push = oy / 2 * (dy < 0 ? -1 : 1);
              if (!(drag && drag.idx === i)) a.y -= push;
              if (!(drag && drag.idx === j)) b.y += push;
              const e = (a.vy - b.vy) * 0.3;
              if (!(drag && drag.idx === i)) a.vy -= e;
              if (!(drag && drag.idx === j)) b.vy += e;
            }
          }
        }
      }
      // paint
      els.forEach((el, i) => {
        const c = chips[i];
        el.style.transform = `translate(${c.x}px, ${c.y}px) rotate(${c.rot}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // drag
    const onDown = (e) => {
      const target = e.target.closest(".chip-pill");
      if (!target) return;
      const idx = els.indexOf(target);
      if (idx < 0) return;
      const r = rect();
      const c = chipsRef.current[idx];
      draggingRef.current = {
        idx,
        offX: e.clientX - r.left - c.x,
        offY: e.clientY - r.top - c.y,
        lastX: e.clientX, lastY: e.clientY,
        history: [],
      };
      target.style.zIndex = 100;
      target.classList.add("is-grabbed");
      e.preventDefault();
    };
    const onMove = (e) => {
      const d = draggingRef.current; if (!d) return;
      const r = rect();
      const c = chipsRef.current[d.idx];
      c.x = e.clientX - r.left - d.offX;
      c.y = e.clientY - r.top - d.offY;
      d.history.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (d.history.length > 6) d.history.shift();
    };
    const onUp = () => {
      const d = draggingRef.current; if (!d) return;
      const c = chipsRef.current[d.idx];
      // compute throw velocity
      const h = d.history;
      if (h.length >= 2) {
        const a = h[0], b = h[h.length-1];
        const dt = Math.max(1, b.t - a.t);
        c.vx = (b.x - a.x) / dt * 16;
        c.vy = (b.y - a.y) / dt * 16;
        c.vr = (c.vx) * 0.3;
      }
      els[d.idx].style.zIndex = "";
      els[d.idx].classList.remove("is-grabbed");
      draggingRef.current = null;
    };
    pit.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      pit.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="pit-wrap">
      <div className="pit-head">
        <div className="meta-k">/ Toolbox</div>
        <div className="pit-hint" data-cursor="drag">Drag &amp; throw</div>
      </div>
      <div ref={pitRef} className="pit" data-drag>
        {SKILLS.map((s) => (
          <div key={s} className="chip-pill" data-cursor="grab">{s}</div>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const services = [
    { n: "01", title: "Full-Stack Build", body: "SvelteKit or React on the front, FastAPI or Express on the back. I take a problem from the database schema to the deployed Docker stack.", deliv: ["Production code","Schema + API","Docker compose"] },
    { n: "02", title: "AI / RAG Integration", body: "LLM chatbots, embeddings, semantic search. Dify + Groq + Gemini for fast prototypes; pgvector when meaning needs a home.", deliv: ["RAG chatbots","Knowledge base","Eval setup"] },
    { n: "03", title: "Real-Time Systems", body: "Redis queues, Server-Sent Events, FreeRADIUS sessions: the parts of an app that need to update without anyone refreshing.", deliv: ["SSE streams","Queue workers","Background jobs"] },
    { n: "04", title: "Forecasting & ML", body: "Facebook Prophet for demand and time-series. Nightly retrain on live data, persisted models, restock simulations. Built for products that have to defend their numbers.", deliv: ["Forecast pipeline","Auto retrain","Reports"] },
  ];
  return (
    <div className="services reveal">
      <div className="section-head" style={{marginBottom:48, marginTop:120}}>
        <div>
          <div className="section-eyebrow">04 / Services</div>
          <h2 className="section-title">What I'm <em>for hire</em> for.</h2>
        </div>
      </div>
      <div className="serv-grid">
        {services.map((s, i) => (
          <ServiceRow key={s.n} s={s} idx={i} />
        ))}
      </div>
    </div>
  );
}
function ServiceRow({ s, idx }) {
  const [open, setOpen] = React.useState(idx === 0);
  return (
    <div className={"serv-row" + (open ? " serv-open" : "")} onClick={() => setOpen(v => !v)} data-cursor={open ? "collapse" : "expand"}>
      <div className="serv-head">
        <span className="serv-n">{s.n}</span>
        <span className="serv-t">{s.title}</span>
        <span className="serv-deliv">{s.deliv.join(" / ")}</span>
        <span className="serv-tog">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M7 2v10" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </span>
      </div>
      <div className="serv-body">
        <div className="serv-body-inner">
          <p>{s.body}</p>
          <div className="serv-list">
            {s.deliv.map(d => <span key={d} className="serv-chip">· {d}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const aboutStyles = `
  .about-grid{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:flex-start}
  @media (max-width:960px){.about-grid{grid-template-columns:1fr;gap:32px}}

  .about-portrait{position:relative}
  .ap-frame{position:relative;aspect-ratio:4/5;max-height:560px;border-radius:14px;overflow:hidden;
    border:1px solid var(--line);background:var(--bg-2)}
  .ap-frame image-slot{position:absolute;inset:0;width:100%;height:100%;
    --is-bg:#1a1a1a;--is-fg:rgba(255,255,255,.55);--is-border:rgba(255,255,255,.1)}
  .ap-stamp{position:absolute;right:-30px;bottom:-30px;color:var(--accent);
    animation:rot 16s linear infinite;transform-origin:center}
  @keyframes rot{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  .ap-stamp-dot{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    width:14px;height:14px;border-radius:50%;background:var(--accent);
    box-shadow:0 0 18px var(--accent-glow)}

  .about-body{display:flex;flex-direction:column;gap:24px}
  .about-lead{font:400 28px/1.35 var(--sans);letter-spacing:-.005em;text-wrap:pretty}
  .about-lead strong{font-weight:600;color:var(--accent)}
  .about-p{font:400 17px/1.55 var(--sans);color:var(--fg-2);max-width:60ch;text-wrap:pretty}
  .about-p em{font-family:var(--serif);font-style:italic;color:var(--fg);font-size:18px}
  .about-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;
    padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
    margin:8px 0 0}
  .about-stats>div{display:flex;flex-direction:column;gap:4px}
  .about-stats b{font:500 40px/1 var(--sans);letter-spacing:-.03em;color:var(--fg)}
  .about-stats span{font:500 11px/1 var(--mono);text-transform:uppercase;
    letter-spacing:.06em;color:var(--fg-3)}

  /* Chip pit */
  .pit-wrap{margin-top:8px}
  .pit-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;
    font:500 11px/1 var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--fg-3)}
  .pit-hint{color:var(--accent)}
  .pit{position:relative;height:260px;border:1px dashed var(--line-2);border-radius:14px;
    background:radial-gradient(600px 200px at 50% 100%, rgba(255,85,0,.06), transparent 60%), var(--bg-2);
    overflow:hidden;user-select:none}
  .chip-pill{position:absolute;top:0;left:0;display:inline-flex;align-items:center;
    padding:9px 14px;border-radius:99px;background:#1c1c1c;
    border:1px solid var(--line-2);color:var(--fg);
    font:500 12px/1 var(--mono);text-transform:uppercase;letter-spacing:.04em;
    will-change:transform;transition:background .2s,border-color .2s,box-shadow .2s}
  .chip-pill:hover{background:#262626;border-color:var(--accent);color:var(--fg)}
  .chip-pill.is-grabbed{background:var(--accent);color:#000;border-color:var(--accent);
    box-shadow:0 18px 40px rgba(255,85,0,.35);transition:none}

  /* Services */
  .services{margin-top:120px}
  .serv-grid{display:flex;flex-direction:column;border-top:1px solid var(--line)}
  .serv-row{border-bottom:1px solid var(--line);transition:background .3s}
  .serv-row:hover{background:rgba(255,255,255,.015)}
  .serv-head{display:grid;grid-template-columns:64px 1fr 2fr 32px;gap:24px;align-items:center;
    padding:32px 0;cursor:none}
  .serv-n{font:500 12px/1 var(--mono);color:var(--accent);letter-spacing:.04em}
  .serv-t{font:500 clamp(28px,3.2vw,44px)/1 var(--sans);letter-spacing:-.02em;color:var(--fg);
    transition:color .3s,transform .3s}
  .serv-row:hover .serv-t{color:var(--accent);transform:translateX(6px)}
  .serv-deliv{font:500 12px/1.4 var(--mono);color:var(--fg-3);letter-spacing:.04em;text-transform:uppercase;text-align:right}
  .serv-tog{display:grid;place-items:center;color:var(--fg-2);transition:transform .3s,color .3s}
  .serv-open .serv-tog{transform:rotate(45deg);color:var(--accent)}
  .serv-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.2,.7,.2,1)}
  .serv-open .serv-body{grid-template-rows:1fr}
  .serv-body-inner{overflow:hidden}
  .serv-body-inner>*{padding:0 0 32px 88px}
  .serv-body p{font:400 18px/1.5 var(--sans);color:var(--fg-2);max-width:60ch}
  .serv-list{display:flex;gap:18px;flex-wrap:wrap;margin-top:14px}
  .serv-chip{font:500 11px/1 var(--mono);color:var(--fg-2);letter-spacing:.04em;text-transform:uppercase}
  @media (max-width:760px){
    .serv-head{grid-template-columns:40px 1fr 28px}
    .serv-deliv{display:none}
    .serv-body-inner>*{padding-left:64px}
  }
`;

window.About = About;
