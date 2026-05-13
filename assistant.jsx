// Live AI assistant — meta-demonstration of Zoe's RAG/LLM integration skill
// applied to the portfolio itself. Powered by window.claude.complete.

const PORTFOLIO_KB = `
You are an assistant embedded on the portfolio of Zoe Mart Derick R. Pabillaran (Zoe Mart), a Full-Stack Developer based in Cagayan de Oro, Philippines. You answer questions about Zoe's work, skills, and experience for visitors — clients, recruiters, collaborators. Reply in 2–4 short sentences. Be direct, warm, professional. Refer to Zoe in third person. Never invent facts beyond what is below; if you don't know, say so and suggest contacting Zoe directly.

ABOUT ZOE:
- BS Information Technology, University of Science and Technology of Southern Philippines (USTP), 2021–2025.
- Electives: Database Management and Machine Learning.
- Just finished a four-month Full-Stack OJT at Veent Apps Inc. (Feb–May 2026), shipping five production systems.
- Available for full-time, contract, and junior roles. Comfortable working remotely.

CORE STACK:
- Languages: TypeScript, JavaScript, Python, PHP, SQL.
- Front: SvelteKit, Svelte 5, React, React Native (Expo), TailwindCSS.
- Back: FastAPI, Express/Node, Payload CMS 3.
- Data: PostgreSQL, MySQL, Redis, pgvector, Drizzle ORM.
- Infra: Docker, Docker Compose, FreeRADIUS, OpenWRT, Sentry, APScheduler.
- AI/ML: Dify, Groq (Llama-3.1-8b), Gemini embeddings, Facebook Prophet, Immich ML (ArcFace), pandas, joblib.

PROJECTS (all shipped during 2026 Veent OJT unless noted):

1. BIDMOTO — Live auction marketplace (Feb 2026).
   Problem: Auctions ran on chat threads and spreadsheets; bidders missed price changes; organizers reconciled winners by hand.
   Solution: Bids enter a Redis queue, a worker processes them in strict order, prices push to every bidder over Server-Sent Events. SvelteKit + Payload CMS 3 + PostgreSQL + Redis + Express SSE + Sentry, all in six Docker services. Redis-backed rate limiting blocks bid spam.
   Outcome: Bidders see price ticks instantly; organizers run an auction with one tab open; six services, one compose file.

2. VEENTSNAP — Selfie-to-photo face match (Apr 2026).
   Problem: Event attendees scrolled through hundreds of photos hoping to find themselves; most gave up. Organizers got "where am I?" DMs for days.
   Solution: Immich's ArcFace produces face embeddings; pgvector stores them; cosine similarity does the matching. sharp paints a three-layer watermark on unpurchased photos. Matches cache per user for 24h. Seven Docker Compose services.
   Outcome: Matches return in about two seconds; the gallery searches itself.

3. CASHLESS PISO WIFI — Payments-integrated public WiFi (May 2026).
   Problem: Piso WiFi operators emptied coin boxes by hand, drove site-to-site to top up vouchers, and SSH'd into each OpenWRT router to make changes.
   Solution: Maya payment webhooks trigger FreeRADIUS sessions the second money clears. One dashboard runs every router. APScheduler reconciles overnight. Telegram bot pings operators on outages. FreeRADIUS CoA lets users pause and resume sessions.
   Stack: Python, PostgreSQL, Redis, FreeRADIUS, Maya, OpenWRT, Docker.
   Outcome: Operators check revenue from their phone; customers tap-to-pay and are online in seconds.

4. VEENTBOT — Dual-knowledge-base AI chatbots (Apr 2026).
   Problem: Support inbox drowning in repetitive buyer FAQs and organizer onboarding questions; a shared bot risked leaking organizer-only info to buyers.
   Solution: Two strictly isolated Dify knowledge bases — one for buyers, one for organizers. Llama-3.1-8b via Groq for inference. Gemini embeddings for semantic search. Retrieval weights tuned to 0.7 keyword / 0.3 semantic. Playwright crawler regenerates KB files automatically.
   Outcome: Instant FAQ answers; no cross-audience leaks; the team gets their inbox back for questions that need a human.

5. EVENT TICKET BUILDER (Feb 2026, also Veent).
   Vanilla JS canvas editor with drag/resize/rotate, CSV-driven batch personalization, 50-step undo/redo, QR + barcode generation, template save/load to localStorage, and batch ZIP PNG export. Non-developers can lay out tickets visually.

6. STOCKWISE (Capstone, Jan–Dec 2025, USTP).
   Backend role on an inventory management system. React 19 front-end, FastAPI on MySQL.
   Problem: Partner business reordered by gut feel — slow movers piled up, fast movers stocked out, reports lived in spreadsheets.
   Solution: Facebook Prophet trains nightly on each SKU's history; forecasts next-month and six-month demand. Falls back to a 3-month moving average when an item has < 12 months of data or < 10 issuances. Restock simulation walks the 6-month forecast month-by-month and outputs exactly how much to order. Models persist via joblib; stock cards log every receipt and issuance.
   Outcome: Staff reorder before stockouts; inventory reports export from the browser via jsPDF + AutoTable in two clicks.

WHAT ZOE OFFERS AS SERVICES:
- Full-Stack Build (database to deployed Docker stack)
- AI / RAG Integration (LLM chatbots, embeddings, semantic search)
- Real-Time Systems (Redis queues, SSE, FreeRADIUS sessions)
- Forecasting & ML (Prophet pipelines with auto retrain)

CONTACT: zoempabillaran@gmail.com

STYLE RULES:
- Keep replies under 90 words.
- No emoji. No markdown headers. Plain text with short paragraphs.
- If asked "who built you" or "what model": you're an assistant embedded on Zoe's portfolio site. Built using window.claude.complete from the portfolio — the same kind of LLM integration Zoe built for VeentBot at Veent.
- If asked about topics unrelated to Zoe (general coding help, current events, etc.), politely redirect: "I'm here to answer questions about Zoe's portfolio. Is there a project or skill you'd like to know more about?"
`.trim();

const SUGGESTED = [
  "What was the most impressive project?",
  "How does VeentSnap work technically?",
  "What's Zoe's strongest skillset?",
  "Why hire Zoe?",
];

function Assistant() {
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState([]); // {role, text, typed?}
  const [busy, setBusy] = React.useState(false);
  const [hint, setHint] = React.useState(true);
  const scrollRef = React.useRef(null);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || busy) return;
    setInput("");
    setHint(false);
    const userMsg = { role: "user", text: q };
    setHistory((h) => [...h, userMsg, { role: "assistant", text: "", pending: true }]);
    setBusy(true);
    try {
      const messages = [
        ...history.flatMap(m => m.pending ? [] : [{ role: m.role, content: m.text }]),
        { role: "user", content: q },
      ];
      const reply = await window.claude.complete({
        system: PORTFOLIO_KB,
        messages,
      });
      setHistory((h) => {
        const next = [...h];
        const last = next[next.length - 1];
        if (last && last.pending) { last.text = reply; last.pending = false; last.typed = false; }
        return next;
      });
    } catch (e) {
      setHistory((h) => {
        const next = [...h];
        const last = next[next.length - 1];
        if (last && last.pending) {
          last.text = "Sorry — couldn't reach the model just now. Try again in a moment, or email zoempabillaran@gmail.com.";
          last.pending = false;
          last.typed = true;
        }
        return next;
      });
    } finally {
      setBusy(false);
    }
  };

  // auto-scroll on new content
  React.useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const onKey = (e) => { if (e.key === "Enter") send(); };

  return (
    <section id="ask" className="ask">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-eyebrow">06 / Live Demo</div>
            <h2 className="section-title">Ask my <em>portfolio.</em></h2>
          </div>
          <div className="section-meta">
            <div>Powered by Claude</div>
            <div>Same pattern as VeentBot's RAG</div>
            <div className="ask-live"><span className="ask-live-dot"></span> Online</div>
          </div>
        </div>

        <div className="ask-shell reveal">
          <div className="ask-header">
            <div className="ask-h-l">
              <div className="ask-h-avatar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3"/>
                </svg>
              </div>
              <div>
                <div className="ask-h-name">Portfolio Assistant</div>
                <div className="ask-h-sub">Knows everything on this page · {busy ? "thinking…" : "ready"}</div>
              </div>
            </div>
            <div className="ask-h-r">
              <span className="meta-k">window.claude.complete</span>
            </div>
          </div>

          <div className="ask-stream" ref={scrollRef}>
            {hint && history.length === 0 && (
              <div className="ask-empty">
                <div className="ask-empty-h">Type a question or pick one below.</div>
                <div className="ask-empty-sub">This isn't a canned widget — it's a live Claude call with a system prompt that contains everything you can read on this page. Same architecture Zoe built for VeentBot.</div>
              </div>
            )}
            {history.map((m, i) => (
              <Msg key={i} m={m} latest={i === history.length - 1} />
            ))}
          </div>

          <div className="ask-suggested">
            {SUGGESTED.map((s) => (
              <button key={s} className="ask-sug" onClick={() => send(s)} disabled={busy} data-cursor="ask">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5h7M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3"/></svg>
                {s}
              </button>
            ))}
          </div>

          <div className="ask-input">
            <span className="ask-prompt">{">"}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about a project, skill, or hiring availability…"
              disabled={busy}
              data-cursor="type"
            />
            <button className="ask-send" onClick={() => send()} disabled={busy || !input.trim()} data-cursor="send">
              {busy ? (
                <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeDasharray="9 18" style={{animation:"askSpin 1s linear infinite",transformOrigin:"center"}}/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              )}
            </button>
          </div>

          <div className="ask-foot">
            <span>This is a real LLM call — answers can vary.</span>
            <span>Esc to clear focus · ↵ to send</span>
          </div>
        </div>
      </div>
      <style>{askStyles}</style>
    </section>
  );
}

function Msg({ m, latest }) {
  const [shown, setShown] = React.useState(m.typed ? m.text : (m.role === "user" ? m.text : ""));
  React.useEffect(() => {
    if (m.role === "user") { setShown(m.text); return; }
    if (m.pending) { setShown(""); return; }
    if (m.typed) { setShown(m.text); return; }
    // typewriter reveal at ~28 chars / 100ms — but feel-tuned via random jitter
    let i = 0;
    const target = m.text;
    setShown("");
    let to;
    const step = () => {
      i = Math.min(target.length, i + 2 + Math.floor(Math.random() * 3));
      setShown(target.slice(0, i));
      if (i < target.length) to = setTimeout(step, 14 + Math.random() * 22);
      else m.typed = true;
    };
    step();
    return () => clearTimeout(to);
  }, [m.pending, m.text]);

  if (m.role === "user") {
    return (
      <div className="msg msg-u">
        <div className="msg-tag">YOU</div>
        <div className="msg-body">{m.text}</div>
      </div>
    );
  }
  return (
    <div className="msg msg-a">
      <div className="msg-tag">AI</div>
      <div className="msg-body">
        {m.pending ? <span className="msg-dots"><span/><span/><span/></span> : (
          <>
            {shown}
            {latest && shown.length < m.text.length && <span className="msg-cur">▍</span>}
          </>
        )}
      </div>
    </div>
  );
}

const askStyles = `
  .ask{padding:120px 0}
  .ask-live{display:inline-flex;align-items:center;gap:8px;color:var(--fg)!important}
  .ask-live-dot{width:8px;height:8px;border-radius:50%;background:#3fdc6e;
    box-shadow:0 0 10px rgba(63,220,110,.55);animation:pulse 2s infinite ease-in-out}

  .ask-shell{border:1px solid var(--line-2);border-radius:18px;overflow:hidden;
    background:linear-gradient(180deg, rgba(255,85,0,.04), rgba(255,85,0,0) 30%), var(--bg-2);
    display:flex;flex-direction:column;min-height:520px;
    box-shadow:0 30px 80px -30px var(--accent-glow), 0 0 0 1px var(--line) inset}
  .ask-header{display:flex;justify-content:space-between;align-items:center;
    padding:18px 22px;border-bottom:1px solid var(--line)}
  .ask-h-l{display:flex;align-items:center;gap:14px}
  .ask-h-avatar{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;
    background:rgba(255,85,0,.12);color:var(--accent);
    border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)}
  .ask-h-name{font:500 15px/1.2 var(--sans);color:var(--fg);letter-spacing:-.01em}
  .ask-h-sub{font:500 11px/1 var(--mono);color:var(--fg-3);letter-spacing:.04em;text-transform:uppercase;margin-top:4px}
  .ask-h-r{font:500 11px/1 var(--mono);letter-spacing:.04em;color:var(--accent);text-transform:lowercase}

  .ask-stream{flex:1;padding:24px 22px;overflow-y:auto;display:flex;flex-direction:column;gap:18px;
    min-height:260px;max-height:520px;
    scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}
  .ask-stream::-webkit-scrollbar{width:8px}
  .ask-stream::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}

  .ask-empty{padding:48px 24px;display:flex;flex-direction:column;gap:10px;text-align:center;color:var(--fg-2);align-items:center}
  .ask-empty-h{font:500 22px/1.3 var(--sans);color:var(--fg);letter-spacing:-.01em}
  .ask-empty-sub{font:400 14px/1.5 var(--sans);max-width:48ch;color:var(--fg-3)}

  .msg{display:grid;grid-template-columns:48px 1fr;gap:14px;align-items:start;animation:msgIn .35s cubic-bezier(.2,.7,.2,1)}
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .msg-tag{font:500 10px/1 var(--mono);text-transform:uppercase;letter-spacing:.1em;
    padding:8px 0;color:var(--fg-3);text-align:left}
  .msg-u .msg-tag{color:var(--fg-2)}
  .msg-a .msg-tag{color:var(--accent)}
  .msg-body{font:400 16px/1.55 var(--sans);color:var(--fg);text-wrap:pretty;
    padding:6px 0}
  .msg-u .msg-body{color:var(--fg)}
  .msg-a .msg-body{color:var(--fg)}
  .msg-cur{display:inline-block;color:var(--accent);margin-left:2px;animation:blink 1s infinite}

  .msg-dots{display:inline-flex;gap:4px;padding:8px 0}
  .msg-dots span{width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:.4;animation:dot 1s infinite ease-in-out}
  .msg-dots span:nth-child(2){animation-delay:.15s}
  .msg-dots span:nth-child(3){animation-delay:.3s}
  @keyframes dot{0%,80%,100%{opacity:.3;transform:scale(.85)}40%{opacity:1;transform:scale(1)}}

  .ask-suggested{display:flex;gap:8px;padding:0 22px 16px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:14px}
  .ask-sug{display:inline-flex;align-items:center;gap:8px;
    padding:8px 12px;border:1px solid var(--line-2);border-radius:99px;
    font:500 12px/1 var(--mono);color:var(--fg-2);letter-spacing:.02em;
    transition:all .2s}
  .ask-sug:hover:not(:disabled){background:var(--accent);color:#000;border-color:var(--accent)}
  .ask-sug:disabled{opacity:.4}
  .ask-sug svg{color:var(--accent);transition:color .2s}
  .ask-sug:hover:not(:disabled) svg{color:#000}

  .ask-input{display:grid;grid-template-columns:24px 1fr 40px;gap:12px;align-items:center;
    padding:14px 22px;border-top:1px solid var(--line);background:rgba(0,0,0,.25)}
  .ask-prompt{font:500 16px/1 var(--mono);color:var(--accent)}
  .ask-input input{flex:1;background:transparent;border:0;outline:0;color:var(--fg);
    font:400 16px/1.4 var(--sans);padding:8px 0;width:100%}
  .ask-input input::placeholder{color:var(--fg-3)}
  .ask-send{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;
    background:var(--accent);color:#000;transition:all .2s}
  .ask-send:hover:not(:disabled){transform:translateX(2px) rotate(-10deg)}
  .ask-send:disabled{background:rgba(255,255,255,.06);color:var(--fg-3)}

  .ask-foot{display:flex;justify-content:space-between;padding:10px 22px;border-top:1px solid var(--line);
    font:500 10px/1 var(--mono);text-transform:uppercase;letter-spacing:.08em;color:var(--fg-3)}

  @keyframes askSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

  @media (max-width:760px){
    .ask-header{flex-direction:column;align-items:flex-start;gap:10px}
    .msg{grid-template-columns:36px 1fr;gap:10px}
    .ask-input{grid-template-columns:18px 1fr 36px}
  }
`;

window.Assistant = Assistant;
