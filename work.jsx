// Work: 5 projects in an asymmetric grid, hover transforms, click → case study modal

const PROJECTS = [
  {
    n: "01",
    title: "Bidmoto",
    sub: "From chat-thread auctions to a real-time bidding floor",
    tags: ["Full-Stack", "Real-Time", "Web App"],
    year: "2026",
    role: "Full-Stack Developer · OJT",
    duration: "Feb 2026",
    accent: "#ff5500",
    problem: "Veent's auction events were running on chat threads and spreadsheets. Bidders missed price changes between refreshes, two people would post the same number seconds apart, and organizers reconciled winners by hand after every event. The honest answer to \"who's winning right now?\" was \"hold on, let me scroll.\"",
    solution: "A purpose-built auction marketplace. Bids enter a Redis queue and a separate worker processes them in strict order, then pushes price updates to every connected screen through Server-Sent Events. No polling, no refresh. SvelteKit and Payload CMS 3 handle listings and admin; Sentry catches every production stack trace; Redis-backed rate limiting blocks automated bid spam.",
    outcome: "An auction now runs with one tab open. Bidders see the price tick the instant it changes; organizers stop reconciling by hand because the system already has the answer. Seven Docker services, one compose file, same config in dev and prod.",
    pal: ["#0a0a0a", "#ff5500", "#f5f5f5"],
    monogram: "BM",
    span: "large",
    impact: [
      ["0", "Refresh-to-see-price"],
      ["1", "Tab to run an auction"],
      ["7", "Services, one compose"],
    ],
    stack: ["Svelte 5", "SvelteKit", "Payload CMS 3", "PostgreSQL", "Redis", "Express SSE", "Docker", "Sentry"],
    github: "https://github.com/ptchblckchocopie/Bidtomo",
  },
  {
    n: "02",
    title: "VeentSnap",
    sub: "Attendees find their event photos in seconds, not hours",
    tags: ["Web App", "ML / pgvector", "Full-Stack"],
    year: "2026",
    role: "Full-Stack Developer · OJT",
    duration: "Apr 2026",
    accent: "#5b8cff",
    problem: "After every event, attendees would scroll through hundreds, sometimes thousands, of photos hoping to spot themselves, and most gave up before buying any. Organizers ended up answering \"can you find me?\" DMs for days, doing manual search inside their own galleries.",
    solution: "Upload a selfie, get every photo you're in. Immich's ArcFace model produces face embeddings, pgvector stores them, and cosine similarity does the matching. Sharp paints a three-layer watermark on unpurchased photos so previews can't be stolen, and matches cache per user for 24 hours so repeat visits don't re-hit the ML.",
    outcome: "What used to take attendees twenty minutes takes under two seconds. Organizers stop being a search engine for their own galleries. The gallery searches itself. The whole stack stands up with one `docker compose up`.",
    pal: ["#0a0a0a", "#5b8cff", "#a7c0ff"],
    monogram: "VS",
    span: "tall",
    impact: [
      ["~2s", "Selfie → matches"],
      ["0", "Manual DM searches"],
      ["24h", "Match cache TTL"],
    ],
    stack: ["SvelteKit", "Drizzle ORM", "PostgreSQL", "pgvector", "Immich ML (ArcFace)", "sharp", "Docker Compose"],
    github: "https://github.com/ptchblckchocopie/veent_image",
  },
  {
    n: "03",
    title: "Cashless Piso WiFi",
    sub: "Operators stop emptying coin boxes and check revenue from their phone",
    tags: ["Backend", "Infra", "Payments"],
    year: "2026",
    role: "Full-Stack Developer · OJT",
    duration: "May 2026",
    accent: "#3fdc6e",
    problem: "Piso WiFi operators were collecting coins by hand, driving from site to site to top up vouchers and reconcile takings, and physically logging into each OpenWRT router whenever something needed changing. Customers paid in coins, or skipped it entirely if they didn't have any.",
    solution: "Maya payments hooked into FreeRADIUS. The session starts the second money clears. No vouchers, no kiosk. One dashboard runs every franchise router instead of operators touching each box individually. APScheduler expires dead sessions and reconciles payments overnight, a Telegram bot pings operators on outages, and FreeRADIUS CoA lets users pause a session and resume the remaining time later.",
    outcome: "Operators check revenue from their phone instead of unlocking coin boxes. Customers tap-to-pay and they're online in seconds. The captive portal is plain HTML/JS so it loads fast even on cheap phones, dropping users right on the payment page.",
    pal: ["#0d130f", "#3fdc6e", "#bef2c9"],
    monogram: "CW",
    span: "wide",
    impact: [
      ["0", "Coin boxes to empty"],
      ["1", "Dashboard, every site"],
      ["CoA", "Pause & resume sessions"],
    ],
    stack: ["Python", "PostgreSQL", "Redis", "FreeRADIUS", "Maya", "OpenWRT", "APScheduler", "Docker"],
    github: "https://github.com/ptchblckchocopie/cashless-piso-wifi",
  },
  {
    n: "04",
    title: "VeentBot",
    sub: "Two AI chatbots that take repetitive support off the team",
    tags: ["AI / RAG", "LLM", "Web"],
    year: "2026",
    role: "Full-Stack Developer · OJT",
    duration: "Apr 2026",
    accent: "#b347ff",
    problem: "Veent's support inbox handled the same buyer FAQs and the same organizer onboarding questions over and over. Hiring out wasn't the answer, but a single shared chatbot risked leaking organizer-only settings into a buyer's reply, which was worse than no bot at all.",
    solution: "Two chatbots, one platform, two strictly isolated Dify knowledge bases. Llama-3.1-8b via Groq handles inference (fast, no model to babysit); Gemini embeddings power semantic search; retrieval weights tuned to 0.7 keyword / 0.3 semantic after testing. A Playwright crawler scrapes veent.io listings and regenerates the knowledge base files automatically, so nobody has to update them by hand.",
    outcome: "Buyers get instant answers without waiting for a human; organizers get help with onboarding without seeing buyer-side content (and vice versa). Chat history persists in localStorage so a refresh doesn't reset the conversation. The team gets their inbox back for the questions that actually need a human.",
    pal: ["#0c0a14", "#b347ff", "#e6cfff"],
    monogram: "VB",
    span: "small",
    impact: [
      ["2", "Isolated knowledge bases"],
      ["0", "Cross-audience leaks"],
      ["auto", "KB stays fresh"],
    ],
    stack: ["SvelteKit", "TypeScript", "Dify", "Groq (Llama-3.1-8b)", "Gemini embeddings", "Playwright"],
    github: "https://github.com/ptchblckchocopie/veent-chatbots",
  },
  {
    n: "05",
    title: "Inventory Management System",
    sub: "Stop guessing what to reorder. Forecast it.",
    tags: ["Backend", "ML / Forecasting", "Capstone"],
    year: "2025",
    role: "Backend Developer · Capstone",
    duration: "Jan–Dec 2025",
    accent: "#ff4d6d",
    problem: "The partner business was reordering by gut. Slow-moving items piled up; fast movers went out of stock at the worst possible times. Reports lived in spreadsheets, were assembled by hand at month-end, and arrived too late to act on. \"How much do we need?\" was answered after the answer no longer mattered.",
    solution: "An inventory system that does the forecasting itself. Facebook Prophet trains nightly on each item's order history and predicts next-month and six-month demand. Below the 12-month threshold (or 10 issuances), it falls back to a moving average of the last 3 non-zero months. A restock simulation walks the 6-month forecast month-by-month and outputs exactly how much to order each month. Models persist with joblib; stock cards log every receipt, issuance, and adjustment so there's a clear trail when numbers look off.",
    outcome: "Staff reorder before they run out, not after. Forecasts and inventory reports export from the browser in two clicks via jsPDF and AutoTable instead of being assembled by hand. Nobody kicks off training manually. It happens overnight against the live database.",
    pal: ["#0a0a0a", "#ff4d6d", "#ffb3c1"],
    monogram: "IMS",
    span: "small",
    impact: [
      ["6 mo.", "Forecast horizon"],
      ["Nightly", "Auto retrain"],
      ["0", "Manual report assembly"],
    ],
    stack: ["React 19", "FastAPI", "MySQL", "Facebook Prophet", "joblib", "jsPDF", "AutoTable"],
    github: "https://github.com/KentJhon/capstone_itrack",
  },
];

function Work() {
  const [open, setOpen] = React.useState(null);
  const [filter, setFilter] = React.useState("All");
  const filters = ["All", "Full-Stack", "AI / ML", "Backend"];
  const matchFilter = (p) => {
    if (filter === "All") return true;
    if (filter === "Full-Stack") return p.tags.some(t => /Full-Stack|Web App|Real-Time/.test(t));
    if (filter === "AI / ML") return p.tags.some(t => /AI|RAG|LLM|ML|pgvector|Forecasting/.test(t));
    if (filter === "Backend") return p.tags.some(t => /Backend|Infra|Payments/.test(t));
    return true;
  };
  return (
    <section id="work" className="work">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-eyebrow">02 / Selected Work</div>
            <h2 className="section-title">Projects, <em>shipped & studied.</em></h2>
          </div>
          <div className="work-filter" role="tablist">
            {filters.map(f => (
              <button key={f} role="tab" aria-selected={filter===f}
                className={"chip" + (filter === f ? " chip-on" : "")}
                onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="work-grid">
          {PROJECTS.filter(matchFilter).map((p, i) => (
            <ProjectCard key={p.n} p={p} idx={i} onOpen={() => setOpen(p)} />
          ))}
        </div>

        <div className="work-foot reveal">
          <div className="work-foot-l">
            <span className="meta-k" style={{color:"var(--fg-3)"}}>/ Archive</span>
            <div className="work-foot-h">Plus a CSV-driven event ticket builder<br/>and assorted side experiments.</div>
          </div>
          <a className="link-arrow" href="#contact" data-cursor="say hi">
            Ask for the long version
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 17L17 5M17 5H7M17 5V15" stroke="currentColor" strokeWidth="1.4"/></svg>
          </a>
        </div>
      </div>

      {open && <CaseStudy p={open} onClose={() => setOpen(null)} />}

      <style>{workStyles}</style>
    </section>
  );
}

function ProjectCard({ p, idx, onOpen }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -100px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    el.style.setProperty("--rx", (y * -6) + "deg");
    el.style.setProperty("--ry", (x * 8) + "deg");
    el.style.setProperty("--mx", (x * 16) + "px");
    el.style.setProperty("--my", (y * 16) + "px");
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  };
  return (
    <article ref={ref} className={"pcard pcard-" + p.span} onMouseMove={onMove} onMouseLeave={onLeave}
      onClick={onOpen} data-cursor="open case"
      style={{"--pAccent": p.accent, "--in-delay": (idx % 3) * 90 + "ms"}}>
      <div className="pcard-frame">
        <div className="pcard-canvas">
          <CardArt p={p} />
        </div>

        <div className="pcard-overlay">
          <div className="pcard-top">
            <span className="pcard-n">{p.n}</span>
            <span className="pcard-year">{p.year}</span>
          </div>
          <div className="pcard-bot">
            <div className="pcard-title-row">
              <h3 className="pcard-title">{p.title}</h3>
              <div className="pcard-open">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              </div>
            </div>
            <p className="pcard-sub">{p.sub}</p>
            <div className="pcard-tags">
              {p.tags.map(t => <span key={t} className="pcard-tag">{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Procedural card artwork: each project gets a distinct, brand-aligned scene
function CardArt({ p }) {
  if (p.title === "Bidmoto") return <BidmotoArt p={p} />;
  if (p.title === "Inventory Management System") return <StockwiseArt p={p} />;
  if (p.title === "VeentSnap") return <SnapArt p={p} />;
  if (p.title === "VeentBot") return <BotArt p={p} />;
  if (p.title === "Cashless Piso WiFi") return <WifiArt p={p} />;
  return null;
}

function BidmotoArt({ p }) {
  // Phone-like card showing a live auction, price ticks up periodically
  const [price, setPrice] = React.useState(148000);
  const [bumps, setBumps] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => {
      setPrice(v => v + 2000);
      setBumps(b => b + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="art art-nimbus" style={{background:"linear-gradient(180deg,#0d0d0d 0%,#1a0f08 100%)"}}>
      <div className="art-phone">
        <div className="art-phone-top"><span className="art-dot" style={{animation:"pulse 1.4s infinite ease-in-out"}}></span><span style={{flex:1, color:"var(--fg-2)"}}>LIVE · LOT #284</span><span className="art-pill">2:14</span></div>
        <div className="art-phone-hello">Current bid · 14 bidders</div>
        <div className="art-phone-bal" key={bumps} style={{animation:"priceBump .5s cubic-bezier(.2,.7,.2,1)"}}>
          <span>₱</span>{price.toLocaleString()}<small style={{color:p.accent}}> ↑</small>
        </div>
        <div className="art-phone-row">
          <div className="art-phone-chip" style={{background:p.accent, color:"#000", borderColor:p.accent}}>+₱2,000 Bid</div>
          <div className="art-phone-chip">+₱5K</div>
          <div className="art-phone-chip">+₱10K</div>
        </div>
        <div className="art-phone-list">
          {["@rica.b · ₱148,000  →  2s ago","@drift_co · ₱146,000  →  6s ago","@m.tan · ₱144,000  →  11s ago"].map(t => (
            <div key={t} className="art-phone-li">{t}</div>
          ))}
        </div>
        <div className="art-phone-graph">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none" width="100%" height="40">
            <path d="M0 34 L 20 32 L 40 28 L 60 28 L 80 22 L 100 22 L 120 16 L 140 16 L 160 12 L 180 8 L 200 6" fill="none" stroke={p.accent} strokeWidth="1.4"/>
          </svg>
        </div>
      </div>
      <style>{`@keyframes priceBump{0%{transform:translateY(-4px);color:${p.accent}}100%{transform:none;color:#fff}}`}</style>
    </div>
  );
}

function StockwiseArt({ p }) {
  // Forecast chart with history + forecast band
  const hist = Array.from({length:14},(_,i)=>30 + Math.sin(i*0.55)*14 + i*1.3);
  const fc = Array.from({length:10},(_,i)=>hist[hist.length-1] + i*2.4 + Math.sin(i*0.7)*4);
  return (
    <div className="art art-spectra" style={{background:"linear-gradient(160deg,#0a0a0a,#1a0710)"}}>
      <div className="art-spec-grid">
        {Array.from({length:48}).map((_,i)=><div key={i} className="art-spec-cell"/>)}
      </div>
      <div className="art-spec-card">
        <div className="art-spec-h">
          <span className="art-spec-tit">Sku · Monthly demand</span>
          <span className="art-spec-num">+18.4% <span style={{fontSize:11,color:"var(--fg-3)"}}>6mo</span></span>
        </div>
        <div style={{position:"relative",height:90}}>
          <svg width="100%" height="90" viewBox="0 0 240 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id="fcg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={p.accent} stopOpacity=".4"/>
                <stop offset="1" stopColor={p.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* history line */}
            <polyline fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="1.4"
              points={hist.map((y,i)=>`${i*8},${88-y}`).join(" ")}/>
            {/* divider */}
            <line x1={(hist.length-1)*8} y1="0" x2={(hist.length-1)*8} y2="90" stroke="rgba(255,255,255,.25)" strokeDasharray="2 2"/>
            {/* forecast area */}
            <path fill="url(#fcg)" d={`M${(hist.length-1)*8},${88-hist[hist.length-1]} ${fc.map((y,i)=>`L${(hist.length-1+i+1)*8},${88-y}`).join(" ")} L${(hist.length+fc.length)*8-8},90 L${(hist.length-1)*8},90 Z`}/>
            <polyline fill="none" stroke={p.accent} strokeWidth="1.4" strokeDasharray="3 2"
              points={fc.map((y,i)=>`${(hist.length-1+i+1)*8},${88-y}`).join(" ")}/>
          </svg>
        </div>
        <div className="art-spec-foot">
          <span>Jan</span><span>Now</span><span>+6mo</span>
        </div>
      </div>
      <div className="art-spec-q" style={{background:"rgba(255,77,109,.12)",borderColor:"rgba(255,77,109,.35)"}}>
        Reorder 240 units · before Aug<span className="art-spec-cur" style={{color:p.accent}}> ●</span>
      </div>
    </div>
  );
}

function SnapArt({ p }) {
  // Photo grid with a scanning line that sweeps and highlights matches
  const tiles = Array.from({length:9},(_,i)=>i);
  const [match, setMatch] = React.useState(4);
  React.useEffect(() => {
    const sequence = [4, 7, 2, 5, 4];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % sequence.length;
      setMatch(sequence[i]);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="art art-orbit" style={{background:"linear-gradient(160deg,#070912,#0a0a0a)"}}>
      <div style={{position:"relative",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
        {tiles.map(i => {
          const isMatch = i === match;
          return (
            <div key={i} style={{
              position:"relative",aspectRatio:"1/1",borderRadius:8,overflow:"hidden",
              background:`linear-gradient(${135+i*40}deg, rgba(91,140,255,.${(i%5)+2}5), rgba(91,140,255,.05))`,
              border: isMatch ? `1.5px solid ${p.accent}` : "1px solid rgba(255,255,255,.06)",
              boxShadow: isMatch ? `0 0 0 4px rgba(91,140,255,.18)` : "none",
              transition:"border-color .35s, box-shadow .35s",
            }}>
              {isMatch && (
                <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",animation:"snapPop .4s cubic-bezier(.2,.7,.2,1)"}}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="9" r="3.5" stroke={p.accent} strokeWidth="1.4"/>
                    <path d="M5 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={p.accent} strokeWidth="1.4"/>
                  </svg>
                </div>
              )}
              {isMatch && <div style={{position:"absolute",left:4,top:4,font:"500 8px/1 var(--mono)",color:"#000",background:p.accent,padding:"3px 5px",borderRadius:3,letterSpacing:".06em"}}>0.94</div>}
            </div>
          );
        })}
        {/* scanning line */}
        <div style={{
          position:"absolute",left:0,right:0,height:2,
          background:`linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
          boxShadow:`0 0 12px ${p.accent}`,
          animation:"snapScan 2.2s cubic-bezier(.5,0,.5,1) infinite",
          pointerEvents:"none",opacity:.6,
        }} />
      </div>
      <div className="art-orb-perf">
        <div><span className="meta-k">Embedded</span><b style={{color:p.accent}}>10,284</b></div>
        <div><span className="meta-k">Matched</span><b style={{color:p.accent}}>6</b></div>
        <div><span className="meta-k">Similarity</span><b style={{color:p.accent}}>0.94</b></div>
      </div>
      <style>{`
        @keyframes snapScan{0%{top:-2px}100%{top:100%}}
        @keyframes snapPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  );
}

function BotArt({ p }) {
  // Two-bot config + a live typing chat preview
  const phrases = [
    "How do I reset my organizer password?",
    "What payment methods are supported?",
    "Where do my event photos go after upload?",
  ];
  const [phraseI, setPhraseI] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  React.useEffect(() => {
    let i = 0; let dir = 1;
    const target = phrases[phraseI];
    const id = setInterval(() => {
      i = i + dir;
      if (i >= target.length) { dir = -1; setTimeout(() => {}, 600); }
      if (i <= 0) { setPhraseI(p => (p + 1) % phrases.length); dir = 1; clearInterval(id); return; }
      setTyped(target.slice(0, i));
    }, dir === 1 ? 50 : 28);
    return () => clearInterval(id);
  }, [phraseI]);

  return (
    <div className="art art-cascade" style={{background:"radial-gradient(900px 320px at 50% 50%, rgba(179,71,255,.16), transparent 60%), #0c0a14",padding:"18px 22px",display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
      <div className="art-csc-token" style={{borderColor:"rgba(179,71,255,.22)",width:"100%"}}>
        <div className="art-csc-row"><span className="art-csc-k" style={{color:p.accent}}>kb: buyer</span><span className="art-csc-sw" style={{background:p.accent}}/><span className="art-csc-v">isolated</span></div>
        <div className="art-csc-row"><span className="art-csc-k" style={{color:p.accent}}>kb: organizer</span><span className="art-csc-sw" style={{background:"#e6cfff"}}/><span className="art-csc-v">isolated</span></div>
        <div className="art-csc-row"><span className="art-csc-k" style={{color:p.accent}}>model</span><span className="art-csc-v" style={{flex:1,textAlign:"right"}}>llama-3.1-8b · Groq</span></div>
      </div>
      <div style={{
        background:"rgba(179,71,255,.08)",border:"1px solid rgba(179,71,255,.25)",
        borderRadius:10,padding:"10px 12px",
        font:"500 11px/1.3 var(--mono)",color:"#fff",
        display:"flex",alignItems:"center",gap:8,minHeight:34,
      }}>
        <span style={{color:p.accent,fontWeight:600}}>U</span>
        <span style={{flex:1}}>{typed}<span style={{color:p.accent,marginLeft:2,animation:"blink 1s infinite"}}>▍</span></span>
      </div>
    </div>
  );
}

function WifiArt({ p }) {
  // Network topology: a hub (payment) connected to router nodes (sites)
  const nodes = [[110,70,16,"hub"],[40,40,10],[180,42,10],[40,100,10],[180,98,10],[110,20,9],[110,120,9]];
  const links = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]];
  return (
    <div className="art art-reso" style={{background:"radial-gradient(800px 400px at 50% 50%, rgba(63,220,110,.16), transparent 60%), #0a0a0a"}}>
      <svg width="100%" height="100%" viewBox="0 0 220 140">
        <defs>
          <radialGradient id="hubg">
            <stop offset="0" stopColor={p.accent} stopOpacity=".9"/>
            <stop offset="1" stopColor={p.accent} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <g stroke={p.accent} strokeWidth=".7" fill="none" opacity=".55">
          {links.map((l,i)=>{
            const a = nodes[l[0]], b = nodes[l[1]];
            return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} strokeDasharray="2 3"/>;
          })}
        </g>
        {/* pulses */}
        <g>
          {links.map((l,i)=>{
            const a = nodes[l[0]], b = nodes[l[1]];
            return (
              <circle key={i} r="2" fill={p.accent}>
                <animateMotion dur={`${1.6 + i*0.3}s`} repeatCount="indefinite" path={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`}/>
              </circle>
            );
          })}
        </g>
        <circle cx="110" cy="70" r="34" fill="url(#hubg)" opacity=".5"/>
        {nodes.map((n,i)=>(
          <g key={i}>
            <circle cx={n[0]} cy={n[1]} r={n[2]+4} fill={p.accent} opacity=".12"/>
            <circle cx={n[0]} cy={n[1]} r={n[2]} fill="#0a0a0a" stroke={p.accent} strokeWidth={i===0 ? 1.6 : 1}/>
            {i===0 && <text x={n[0]} y={n[1]+3} textAnchor="middle" fill={p.accent} style={{font:"500 8px Geist Mono"}}>MAYA</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

// Scroll rail for the case-study sheet: a document minimap with chapter ticks,
// a live percentage readout, and drag-to-scrub. Replaces the native scrollbar.
function CaseRail({ sheetRef }) {
  const [win, setWin] = React.useState({ top: 0, h: 1, pct: 0 });
  const [marks, setMarks] = React.useState([]);
  const [active, setActive] = React.useState(-1);
  const [live, setLive] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const trackRef = React.useRef(null);
  const marksRef = React.useRef([]);
  const dragRef = React.useRef(false);
  const liveTo = React.useRef(null);

  React.useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    // .cs-sheet is unpositioned, so measure against its own rect rather than offsetTop
    const topOf = (node) =>
      node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;

    const measure = () => {
      setOk(el.scrollHeight - el.clientHeight > 60);
      const m = Array.from(el.querySelectorAll(".cs-block")).map((b) => {
        const top = topOf(b);
        return {
          n: (b.querySelector(".cs-block-n")?.textContent || "").trim(),
          lbl: (b.querySelector(".cs-block-lbl > span:last-child")?.textContent || "").trim(),
          top,
          pos: Math.min(1, Math.max(0, top / Math.max(1, el.scrollHeight))),
        };
      });
      marksRef.current = m;
      setMarks(m);
    };

    const onScroll = () => {
      const sh = Math.max(1, el.scrollHeight);
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      setWin({
        top: el.scrollTop / sh,
        h: Math.min(1, el.clientHeight / sh),
        pct: Math.min(1, Math.max(0, el.scrollTop / max)),
      });
      const probe = el.scrollTop + el.clientHeight * 0.3;
      let cur = -1;
      marksRef.current.forEach((mk, i) => { if (mk.top <= probe) cur = i; });
      setActive(cur);
      setLive(true);
      clearTimeout(liveTo.current);
      liveTo.current = setTimeout(() => setLive(false), 900);
    };

    measure(); onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    // re-measure once the open animation and webfonts have settled
    const t = setTimeout(() => { measure(); onScroll(); }, 450);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      clearTimeout(t); clearTimeout(liveTo.current);
    };
  }, [sheetRef]);

  // drag anywhere on the track: the visible band centres on the pointer
  const scrub = (clientY) => {
    const el = sheetRef.current, tr = trackRef.current;
    if (!el || !tr) return;
    const r = tr.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientY - r.top) / Math.max(1, r.height)));
    const winH = el.clientHeight / Math.max(1, el.scrollHeight);
    const target = (f - winH / 2) * el.scrollHeight;
    el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, Math.max(0, target));
  };
  const onDown = (e) => {
    dragRef.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    scrub(e.clientY);
  };
  const onMove = (e) => { if (dragRef.current) scrub(e.clientY); };
  const onUp = (e) => {
    dragRef.current = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  if (!ok) return null;
  const pc = (v) => (v * 100).toFixed(2) + "%";

  return (
    <div className={"cs-rail" + (live ? " is-live" : "")}>
      <div className="cs-rail-track" ref={trackRef} data-cursor="scrub"
           onPointerDown={onDown} onPointerMove={onMove}
           onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="cs-rail-line" />
        <div className="cs-rail-read" style={{ height: pc(win.top) }} />
        <div className="cs-rail-band" style={{ top: pc(win.top), height: pc(win.h) }} />
        {marks.map((mk, i) => (
          <button key={i} type="button" data-cursor={mk.lbl}
                  className={"cs-tick" + (i === active ? " on" : "")}
                  style={{ top: pc(mk.pos) }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    sheetRef.current?.scrollTo({ top: Math.max(0, mk.top - 32), behavior: "smooth" });
                  }}>
            <b>{mk.lbl}</b><span>{mk.n}</span><i />
          </button>
        ))}
        <div className="cs-thumb" style={{ top: pc(win.top + win.h / 2) }}>
          {Math.round(win.pct * 100)}%
        </div>
      </div>
    </div>
  );
}

function CaseStudy({ p, onClose }) {
  const sheetRef = React.useRef(null);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="cs-back" onClick={onClose}>
      <div className="cs-sheet" ref={sheetRef} onClick={e => e.stopPropagation()} style={{"--pAccent": p.accent}}>
        <div className="cs-railwrap"><CaseRail sheetRef={sheetRef} /></div>
        <button className="cs-close" onClick={onClose} data-cursor="close">
          <span>Close</span>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>

        <div className="cs-hero">
          <div className="cs-hero-meta">
            <span className="meta-k">{p.n} / Case</span>
            <span className="meta-k">{p.year}</span>
          </div>
          <div className="cs-hero-title">
            <h2>{p.title}</h2>
            <p>{p.sub}</p>
          </div>
          <div className="cs-hero-art"><CardArt p={p} /></div>
        </div>

        <div className="cs-body">
          <div className="cs-meta">
            <div><div className="meta-k">Role</div><div className="meta-v">{p.role}</div></div>
            <div><div className="meta-k">Duration</div><div className="meta-v">{p.duration}</div></div>
            <div><div className="meta-k">Stack</div><div className="meta-v">{p.stack.join(" · ")}</div></div>
            <div><div className="meta-k">Year</div><div className="meta-v">{p.year}</div></div>
          </div>

          <div className="cs-story">
            <div className="cs-block cs-block-problem">
              <div className="cs-block-lbl">
                <span className="cs-block-n">01</span>
                <span>The problem</span>
              </div>
              <p className="cs-lead">{p.problem}</p>
            </div>

            <div className="cs-block">
              <div className="cs-block-lbl">
                <span className="cs-block-n">02</span>
                <span>What I built</span>
              </div>
              <p className="cs-body-p">{p.solution}</p>
              <div className="cs-stack">
                {p.stack.map(s => <span key={s} className="cs-stack-chip">{s}</span>)}
              </div>
            </div>

            <div className="cs-block cs-block-outcome">
              <div className="cs-block-lbl">
                <span className="cs-block-n">03</span>
                <span>How it made things easier</span>
              </div>
              <p className="cs-body-p">{p.outcome}</p>
            </div>

            <div className="cs-block">
              <div className="cs-block-lbl">
                <span className="cs-block-n">04</span>
                <span>By the numbers</span>
              </div>
              <div className="cs-impact">
                {p.impact.map((it,i)=>(
                  <div key={i} className="cs-stat">
                    <div className="cs-stat-n">{it[0]}</div>
                    <div className="cs-stat-l">{it[1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {p.github && (
              <a className="cs-source" href={p.github} target="_blank" rel="noopener noreferrer" data-cursor="view source">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.5 3.18-1.18 3.18-1.18.62 1.58.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
                </svg>
                <span>View source on GitHub</span>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M4 14L14 4M14 4H6M14 4V12" stroke="currentColor" strokeWidth="1.4"/></svg>
              </a>
            )}
          </div>

          <div className="cs-strip">
            <span>Press <kbd>Esc</kbd> to close</span>
            <span>Full case study on request →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const workStyles = `
  .work-filter{display:flex;gap:8px}
  .chip{font:500 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;
    padding:10px 14px;border:1px solid var(--line-2);border-radius:99px;color:var(--fg-2);
    white-space:nowrap;
    transition:all .2s}
  .chip:hover{color:var(--fg);border-color:var(--fg-3)}
  .chip-on{background:var(--fg);color:#000;border-color:var(--fg)}

  .work-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:20px;perspective:1400px}
  .pcard{position:relative;border-radius:18px;overflow:hidden;
    transform-style:preserve-3d;
    transform:rotateX(var(--rx,0)) rotateY(var(--ry,0));
    opacity:0;translate:0 40px;
    transition:opacity .9s cubic-bezier(.2,.7,.2,1) var(--in-delay,0ms),
               translate .9s cubic-bezier(.2,.7,.2,1) var(--in-delay,0ms),
               transform .4s cubic-bezier(.2,.7,.2,1)}
  .pcard.is-in{opacity:1;translate:0 0}
  @media (prefers-reduced-motion:reduce){
    .pcard{opacity:1;translate:0 0;transition:none}
  }
  .pcard-large{grid-column:span 7;aspect-ratio:16/11}
  .pcard-tall{grid-column:span 5;aspect-ratio:5/6}
  .pcard-wide{grid-column:span 7;aspect-ratio:16/9}
  .pcard-small{grid-column:span 5;aspect-ratio:5/4}
  @media (max-width:980px){
    .pcard-large,.pcard-tall,.pcard-wide,.pcard-small{grid-column:span 12;aspect-ratio:16/10}
  }
  .pcard-frame{position:relative;width:100%;height:100%;background:var(--bg-2);
    border:1px solid var(--line);border-radius:18px;overflow:hidden;
    transition:border-color .3s, box-shadow .3s}
  .pcard:hover .pcard-frame{border-color:var(--pAccent);
    box-shadow:0 30px 80px -20px color-mix(in srgb, var(--pAccent) 22%, transparent), 0 0 0 1px var(--pAccent) inset}
  .pcard-canvas{position:absolute;inset:0;transform:translate(var(--mx,0),var(--my,0)) scale(1.02);
    transition:transform .4s cubic-bezier(.2,.7,.2,1)}
  .pcard:hover .pcard-canvas{transform:translate(calc(var(--mx,0)*1.5),calc(var(--my,0)*1.5)) scale(1.06)}
  .pcard-overlay{position:absolute;inset:0;padding:20px 22px;display:flex;flex-direction:column;
    justify-content:space-between;pointer-events:none;
    background:linear-gradient(180deg,rgba(10,10,10,.4) 0%,rgba(10,10,10,0) 30%,rgba(10,10,10,0) 60%,rgba(10,10,10,.78) 100%)}
  .pcard-top{display:flex;justify-content:space-between;font:500 11px/1 var(--mono);
    letter-spacing:.1em;text-transform:uppercase;color:var(--fg-2)}
  .pcard-n{color:var(--pAccent)}
  .pcard-bot{display:flex;flex-direction:column;gap:10px}
  .pcard-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .pcard-title{font:500 clamp(24px,2.6vw,36px)/1 var(--sans);letter-spacing:-.02em}
  .pcard-open{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.08);
    display:grid;place-items:center;color:var(--fg);transition:all .3s;backdrop-filter:blur(8px)}
  .pcard:hover .pcard-open{background:var(--pAccent);color:#000;transform:rotate(-15deg) scale(1.1)}
  .pcard-sub{font:400 14px/1.4 var(--sans);color:var(--fg-2);max-width:42ch}
  .pcard-tags{display:flex;gap:8px;flex-wrap:wrap}
  .pcard-tag{font:500 10px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;
    padding:6px 10px;border-radius:99px;background:rgba(255,255,255,.06);
    border:1px solid var(--line);color:var(--fg-2)}

  /* Footer */
  .work-foot{margin-top:64px;display:flex;justify-content:space-between;align-items:flex-end;
    padding-top:32px;border-top:1px solid var(--line);gap:32px;flex-wrap:wrap}
  .work-foot-h{font:500 28px/1.15 var(--sans);letter-spacing:-.02em;margin-top:10px}
  .link-arrow{display:inline-flex;align-items:center;gap:10px;
    font:500 14px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;
    color:var(--fg);padding:14px 18px;border:1px solid var(--line-2);border-radius:99px;
    transition:all .2s}
  .link-arrow:hover{background:var(--accent);color:#000;border-color:var(--accent)}
  .link-arrow:hover svg{transform:rotate(45deg)}
  .link-arrow svg{transition:transform .3s}

  /* Art: Nimbus */
  .art{position:absolute;inset:0;overflow:hidden}
  .art-nimbus{display:grid;place-items:center;padding:32px}
  .art-phone{width:240px;height:88%;max-height:380px;background:#0d1117;
    border:1px solid rgba(255,255,255,.12);border-radius:28px;padding:18px 16px;
    display:flex;flex-direction:column;gap:10px;
    box-shadow:0 30px 60px rgba(255,85,0,.15)}
  .art-phone-top{display:flex;align-items:center;gap:6px;font:500 10px/1 var(--mono);color:var(--fg-3)}
  .art-phone-top .art-dot{width:6px;height:6px;border-radius:50%;background:#ff5500}
  .art-phone-top .art-pill{color:var(--fg-2)}
  .art-phone-hello{font:500 11px/1 var(--mono);color:var(--fg-3);letter-spacing:.06em;text-transform:uppercase}
  .art-phone-bal{font:500 38px/1 var(--sans);letter-spacing:-.03em;color:#fff}
  .art-phone-bal span{color:var(--fg-3);font-size:18px;margin-right:2px}
  .art-phone-bal small{color:var(--fg-2);font-size:18px;font-weight:400}
  .art-phone-row{display:flex;gap:6px}
  .art-phone-chip{flex:1;text-align:center;padding:9px 4px;border-radius:10px;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);
    font:500 10px/1 var(--mono);color:#fff;letter-spacing:.04em}
  .art-phone-list{display:flex;flex-direction:column;gap:4px;margin-top:4px}
  .art-phone-li{font:500 10px/1.4 var(--mono);color:var(--fg-2);padding:6px 0;
    border-bottom:1px solid rgba(255,255,255,.05)}
  .art-phone-graph{margin-top:auto;color:#ff5500}

  /* Art: Spectra */
  .art-spectra{padding:24px;background:linear-gradient(160deg,#0a0a0a,#0a0f1c)}
  .art-spec-grid{position:absolute;inset:0;display:grid;
    grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);opacity:.4}
  .art-spec-cell{border-right:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}
  .art-spec-card{position:relative;background:rgba(15,18,28,.7);
    border:1px solid rgba(91,140,255,.25);border-radius:14px;padding:16px;
    backdrop-filter:blur(12px);display:flex;flex-direction:column;gap:12px;
    box-shadow:0 30px 60px rgba(91,140,255,.18);
    margin:auto;max-width:88%;}
  .art-spec-h{display:flex;justify-content:space-between;align-items:baseline}
  .art-spec-tit{font:500 10px/1 var(--mono);text-transform:uppercase;color:var(--fg-3);letter-spacing:.08em}
  .art-spec-num{font:500 22px/1 var(--sans);letter-spacing:-.02em;color:#fff}
  .art-spec-bars{display:flex;gap:3px;align-items:flex-end;height:80px}
  .art-spec-bar{flex:1;border-radius:2px;min-height:6px}
  .art-spec-foot{display:flex;justify-content:space-between;font:500 9px/1 var(--mono);color:var(--fg-3)}
  .art-spec-q{position:absolute;left:24px;bottom:24px;font:500 11px/1 var(--mono);color:#fff;
    background:rgba(91,140,255,.15);border:1px solid rgba(91,140,255,.35);padding:8px 10px;border-radius:6px}
  .art-spec-tic{color:#a7c0ff}
  .art-spec-cur{color:#5b8cff;animation:blink 1s infinite}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}

  /* Art: Orbit */
  .art-orbit{padding:24px;display:flex;flex-direction:column;justify-content:space-between;
    background:linear-gradient(160deg,#0d130f,#0a0a0a)}
  .art-orb-stack{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;perspective:600px}
  .art-orb-card{background:rgba(255,255,255,.04);border:1px solid rgba(63,220,110,.2);
    border-radius:12px;padding:10px;transform:rotateY(calc(var(--i) * -2deg)) translateY(calc(var(--i)*4px));
    display:flex;flex-direction:column;gap:8px}
  .art-orb-img{height:60px;border-radius:8px}
  .art-orb-label{font:500 10px/1 var(--mono);color:#fff;letter-spacing:.04em}
  .art-orb-price{font:500 11px/1 var(--mono);color:#3fdc6e}
  .art-orb-perf{display:flex;gap:18px;padding-top:14px;border-top:1px solid rgba(63,220,110,.15)}
  .art-orb-perf>div{display:flex;flex-direction:column;gap:4px}
  .art-orb-perf b{font:500 18px/1 var(--sans);color:#3fdc6e;letter-spacing:-.02em}

  /* Art: Cascade */
  .art-cascade{background:radial-gradient(900px 320px at 50% 50%, rgba(179,71,255,.16), transparent 60%), #0c0a14;
    display:grid;place-items:center;padding:24px}
  .art-csc-token{width:88%;background:rgba(20,16,30,.7);border:1px solid rgba(179,71,255,.22);
    border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:9px;
    backdrop-filter:blur(8px)}
  .art-csc-row{display:flex;align-items:center;gap:10px;font:500 11px/1 var(--mono);color:#fff}
  .art-csc-k{flex:0 0 auto;color:#b347ff;min-width:108px}
  .art-csc-sw{width:14px;height:14px;border-radius:3px;display:inline-block}
  .art-csc-v{color:var(--fg-2);font-size:11px}

  /* Art: Resonance */
  .art-reso{background:radial-gradient(800px 400px at 30% 60%, rgba(255,77,109,.18), transparent 60%), #0a0a0a;
    display:grid;place-items:center;padding:8px}

  /* Case study */
  .cs-back{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.7);
    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    display:grid;place-items:center;padding:32px;
    animation:csfade .2s ease-out}
  @keyframes csfade{from{opacity:0}to{opacity:1}}
  .cs-sheet{width:100%;max-width:1100px;max-height:calc(100vh - 64px);overflow-y:auto;
    background:var(--bg-2);border:1px solid var(--line);border-radius:24px;
    animation:csup .35s cubic-bezier(.2,.7,.2,1);
    scrollbar-width:none;-ms-overflow-style:none}
  .cs-sheet::-webkit-scrollbar{width:0;height:0;display:none}
  @keyframes csup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}

  /* Scroll rail: document minimap with chapter ticks, replaces the native bar */
  .cs-railwrap{position:sticky;top:0;height:0;z-index:6;pointer-events:none}
  .cs-rail{position:absolute;top:0;right:16px;height:calc(100vh - 64px);
    display:flex;align-items:center;justify-content:flex-end;
    pointer-events:auto;opacity:.45;transition:opacity .35s}
  .cs-rail:hover,.cs-rail.is-live{opacity:1}
  .cs-rail-track{position:relative;width:22px;height:calc(100% - 104px);
    cursor:none;touch-action:none}
  .cs-rail-line{position:absolute;right:0;top:0;bottom:0;width:1px;background:var(--line-2)}
  .cs-rail-read{position:absolute;right:0;top:0;width:1px;
    background:var(--pAccent);opacity:.28}
  .cs-rail-band{position:absolute;right:-1px;width:3px;min-height:24px;border-radius:99px;
    background:var(--pAccent);box-shadow:0 0 12px -2px var(--pAccent);
    transition:box-shadow .3s}
  .cs-rail:hover .cs-rail-band{box-shadow:0 0 18px 0 var(--pAccent)}
  .cs-tick{position:absolute;right:0;transform:translateY(-50%);
    display:flex;align-items:center;justify-content:flex-end;gap:7px;
    background:none;border:0;padding:0;cursor:none;color:var(--fg-3);
    font:500 9px/1 var(--mono);letter-spacing:.09em;text-transform:uppercase;
    white-space:nowrap;transition:color .25s}
  .cs-tick i{display:block;width:7px;height:1px;background:currentColor;opacity:.5;
    transition:width .3s cubic-bezier(.2,.7,.2,1),opacity .3s}
  .cs-tick:hover{color:var(--fg)}
  .cs-tick.on{color:var(--pAccent)}
  .cs-tick.on i,.cs-tick:hover i{width:15px;opacity:1}
  .cs-tick b{font-weight:500;opacity:0;max-width:0;overflow:hidden;padding:0;border-radius:99px;
    background:rgba(10,10,10,.82);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    transition:opacity .25s,max-width .35s cubic-bezier(.2,.7,.2,1),padding .25s}
  /* labels are transient: they surface while scrolling or on hover, never sit over the copy */
  .cs-rail:hover .cs-tick b,.cs-rail.is-live .cs-tick.on b{opacity:1;max-width:150px;padding:4px 9px}
  .cs-thumb{position:absolute;right:8px;transform:translateY(-50%);
    padding:3px 7px;border:1px solid var(--pAccent);border-radius:99px;
    background:rgba(10,10,10,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    color:var(--pAccent);font:500 9px/1 var(--mono);letter-spacing:.06em;
    box-shadow:0 0 16px -6px var(--pAccent);pointer-events:none;
    opacity:0;transition:opacity .3s}
  .cs-rail:hover .cs-thumb,.cs-rail.is-live .cs-thumb{opacity:1}
  @media (max-width:980px){
    .cs-railwrap{display:none}
    .cs-sheet{scrollbar-width:thin}
    .cs-sheet::-webkit-scrollbar{width:6px;display:block}
    .cs-sheet::-webkit-scrollbar-track{background:transparent}
    .cs-sheet::-webkit-scrollbar-thumb{background:var(--pAccent);border-radius:99px;opacity:.6}
  }
  .cs-close{position:absolute;top:48px;right:48px;display:inline-flex;align-items:center;gap:8px;
    padding:10px 16px;background:rgba(255,255,255,.06);border:1px solid var(--line-2);border-radius:99px;
    font:500 11px/1 var(--mono);text-transform:uppercase;letter-spacing:.06em;z-index:5}
  .cs-close:hover{background:var(--pAccent);color:#000;border-color:var(--pAccent)}
  .cs-hero{position:relative;padding:48px 48px 0}
  .cs-hero-meta{display:flex;gap:24px;font-family:var(--mono)}
  .cs-hero-title{margin:24px 0 32px}
  .cs-hero-title h2{font:500 clamp(48px,6vw,88px)/.95 var(--sans);letter-spacing:-.03em}
  .cs-hero-title p{font:400 18px/1.4 var(--sans);color:var(--fg-2);margin-top:8px;max-width:60ch}
  .cs-hero-art{position:relative;height:340px;border-radius:18px;overflow:hidden;
    border:1px solid var(--line)}
  .cs-body{padding:48px}
  .cs-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:24px 0;
    border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .cs-meta>div{display:flex;flex-direction:column;gap:8px}
  .cs-story{display:flex;flex-direction:column;padding:8px 0 0}
  .cs-block{padding:40px 0;border-top:1px solid var(--line)}
  .cs-block:first-child{border-top:0}
  .cs-block-lbl{display:flex;align-items:baseline;gap:14px;margin-bottom:18px;
    font:500 11px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--fg-3)}
  .cs-block-lbl>span:last-child{color:var(--fg-2)}
  .cs-block-n{color:var(--pAccent);font-weight:600}
  .cs-block-problem .cs-block-n,
  .cs-block-problem .cs-block-lbl>span:last-child{color:var(--pAccent)}
  .cs-lead{font:400 26px/1.4 var(--sans);color:var(--fg);max-width:60ch;
    letter-spacing:-.01em;text-wrap:pretty}
  .cs-body-p{font:400 19px/1.55 var(--sans);color:var(--fg);max-width:60ch;
    letter-spacing:-.005em;text-wrap:pretty}
  .cs-block-outcome{padding:48px 32px;margin:8px 0;border-top:0;
    background:linear-gradient(180deg, color-mix(in srgb, var(--pAccent) 10%, transparent), transparent);
    border-radius:18px;border:1px solid color-mix(in srgb, var(--pAccent) 25%, transparent)}
  .cs-block-outcome .cs-block-lbl>span:last-child{color:var(--fg)}
  .cs-stack{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
  .cs-stack-chip{font:500 11px/1 var(--mono);letter-spacing:.04em;
    padding:8px 12px;border-radius:99px;color:var(--fg-2);
    background:rgba(255,255,255,.04);border:1px solid var(--line-2)}
  .cs-impact{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;
    background:var(--line);border-radius:14px;overflow:hidden;
    border:1px solid var(--line)}
  .cs-stat{display:flex;flex-direction:column;gap:8px;padding:28px 24px;
    background:var(--bg-2);border-top:0}
  .cs-stat-n{font:500 56px/1 var(--sans);letter-spacing:-.03em;color:var(--pAccent);min-width:0}
  .cs-stat-l{font:500 11px/1.4 var(--mono);color:var(--fg-2);text-transform:uppercase;letter-spacing:.06em}
  @media (max-width:760px){
    .cs-impact{grid-template-columns:1fr}
    .cs-block-outcome{padding:32px 20px}
    .cs-lead{font-size:22px}
    .cs-body-p{font-size:17px}
  }
  .cs-source{display:inline-flex;align-items:center;gap:14px;margin-top:40px;
    padding:18px 26px;border:1px solid var(--line-2);border-radius:99px;
    font:500 14px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;
    color:var(--fg);background:var(--bg-2);transition:all .25s;cursor:none}
  .cs-source:hover{background:var(--pAccent);color:#000;border-color:var(--pAccent);
    transform:translateY(-2px);box-shadow:0 12px 32px -8px color-mix(in srgb, var(--pAccent) 35%, transparent)}
  .cs-source svg:last-child{transition:transform .25s}
  .cs-source:hover svg:last-child{transform:rotate(45deg)}
  .cs-strip{display:flex;justify-content:space-between;padding-top:32px;margin-top:40px;border-top:1px solid var(--line);
    font:500 11px/1 var(--mono);color:var(--fg-3);text-transform:uppercase;letter-spacing:.06em}
  .cs-strip kbd{font:500 10px/1 var(--mono);padding:3px 6px;border:1px solid var(--line-2);border-radius:4px;color:var(--fg-2)}
  @media (max-width:760px){
    .cs-hero,.cs-body{padding:32px 20px}
    .cs-meta{grid-template-columns:repeat(2,1fr)}
    .cs-close{top:20px;right:20px}
  }
`;

window.Work = Work;
