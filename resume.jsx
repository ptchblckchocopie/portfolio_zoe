// Resume / CV timeline + Contact footer

function Resume() {
  const items = [
    {
      yr: "Feb — May 2026",
      role: "Full-Stack Developer (OJT)",
      org: "Veent Apps Inc.",
      loc: "Cagayan de Oro",
      note: "Shipped five production systems for Veent: Cashless Piso WiFi (Maya payments + FreeRADIUS), VeentBot (dual-KB RAG chatbots on Groq), VeentSnap (face-match photo search with pgvector), Bidmoto (real-time auction marketplace with SSE), and an Event Ticket Builder.",
      tags: ["Full-Stack","AI / RAG","Real-Time","5 shipped"],
    },
    {
      yr: "Jan — Dec 2025",
      role: "Backend Developer (Capstone)",
      org: "USTP",
      loc: "Cagayan de Oro (Academic)",
      note: "Built an inventory management system with a React 19 front-end and FastAPI/MySQL back-end. Added Facebook Prophet for monthly demand forecasting and a restock simulation that outputs exactly how much to order each month.",
      tags: ["Backend","ML / Forecasting","FastAPI"],
    },
    {
      yr: "2021 — 2025",
      role: "BS Information Technology",
      org: "University of Science and Technology of Southern Philippines",
      loc: "Cagayan de Oro",
      note: "Electives in Database Management and Machine Learning. Graduated 2025.",
      tags: ["Education","DB Management","ML"],
    },
  ];

  return (
    <section id="resume" className="resume">
      <div className="container">
        <div className="section-head reveal">
          <div>
            <div className="section-eyebrow">05 / Curriculum Vitae</div>
            <h2 className="section-title">A timeline of <em>good problems.</em></h2>
          </div>
          <div className="section-meta">
            <div>One internship, one capstone, one degree</div>
            <div>PDF available on request</div>
          </div>
        </div>

        <div className="cv-wrap">
          <div className="cv-rail"></div>
          {items.map((it, i) => <CvRow key={i} it={it} />)}
        </div>

        <div className="cv-foot reveal">
          <div className="cv-foot-row">
            <div>
              <div className="meta-k">/ Core stack</div>
              <ul className="cv-list">
                <li><span>Front</span> SvelteKit · Svelte 5 · React · React Native · TypeScript · Tailwind</li>
                <li><span>Back</span> FastAPI · Express / Node · Payload CMS 3 · Python · PHP</li>
                <li><span>Data</span> PostgreSQL · MySQL · Redis · pgvector · Drizzle ORM</li>
                <li><span>Infra</span> Docker · Docker Compose · FreeRADIUS · OpenWRT · Sentry</li>
              </ul>
            </div>
            <div>
              <div className="meta-k">/ Recently explored</div>
              <ul className="cv-list">
                <li><span>AI</span> Dify · Groq (Llama-3.1-8b) · Gemini embeddings · RAG patterns</li>
                <li><span>ML</span> Facebook Prophet · pandas · Immich ML (ArcFace) · joblib</li>
                <li><span>RT</span> Server-Sent Events · Redis pub/sub · FreeRADIUS CoA · APScheduler</li>
                <li><span>Tools</span> Playwright · sharp · jsPDF · Maya payments · Figma · Git</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{resumeStyles}</style>
    </section>
  );
}

function CvRow({ it }) {
  return (
    <div className="cv-row reveal">
      <div className="cv-yr">
        <span className="cv-bullet"></span>
        {it.yr}
      </div>
      <div className="cv-body">
        <div className="cv-h">
          <h3 className="cv-role">{it.role}</h3>
          <span className="cv-org">@ {it.org}</span>
        </div>
        <p className="cv-note">{it.note}</p>
        <div className="cv-tags">
          {it.tags.map(t => <span key={t} className="cv-tag">{t}</span>)}
          <span className="cv-loc">— {it.loc}</span>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [copied, setCopied] = React.useState(false);
  const email = "zoempabillaran@gmail.com";
  const copy = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="ct-eye reveal">
          <span className="section-eyebrow">06 / Contact</span>
          <span className="meta-k">Coordinates · 8.4542° N, 124.6319° E</span>
        </div>

        <h2 className="ct-h reveal">
          Let's make <em>something</em> <br/>
          <button className="ct-mail" onClick={copy} data-cursor={copied ? "copied!" : "copy email"}>
            <span className="ct-mail-text">{email}</span>
            <span className="ct-mail-ic">
              {copied ? (
                <svg width="22" height="22" viewBox="0 0 22 22"><path d="M5 11l4 4 8-9" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22"><rect x="6" y="6" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/><rect x="3" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" opacity=".5"/></svg>
              )}
            </span>
          </button>
        </h2>

        <div className="ct-rows reveal">
          <a href="#" className="ct-row" data-cursor="open"><span>LinkedIn</span><span>linkedin.com/in/zoe-pabillaran</span><Arrow/></a>
          <a href="#" className="ct-row" data-cursor="open"><span>GitHub</span><span>github.com/zoempabillaran</span><Arrow/></a>
          <a href="#" className="ct-row" data-cursor="open"><span>Read.cv</span><span>read.cv/zoempabillaran</span><Arrow/></a>
          <a href="#" className="ct-row" data-cursor="open"><span>X / Twitter</span><span>@zmdpabillaran</span><Arrow/></a>
        </div>

        <footer className="footer">
          <div className="footer-l">
            <div className="footer-name">Zoe Mart Derick R. Pabillaran</div>
            <div className="footer-sub">Designed & built in <span style={{color:"var(--accent)"}}>HTML, CSS, JS</span>. Portfolio v3.0 — 2026.</div>
          </div>
          <div className="footer-r">
            <div className="footer-grid-l">
              <span>© 2026</span>
              <span>All rights reserved</span>
            </div>
            <a href="#top" className="footer-top" data-cursor="back up">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 14V2M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              Back to top
            </a>
          </div>
        </footer>

        <BigSignature />
      </div>
      <style>{contactStyles}</style>
    </section>
  );
}

function Arrow() { return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="ct-arr"><path d="M4 14L14 4M14 4H6M14 4V12" stroke="currentColor" strokeWidth="1.4"/></svg>; }

function BigSignature() {
  // Giant outlined name as a closing flourish; on hover, fills with accent
  return (
    <div className="big-sig" aria-hidden>
      <span>PABILLARAN</span>
    </div>
  );
}

const resumeStyles = `
  .cv-wrap{position:relative;padding-left:0}
  .cv-rail{position:absolute;left:160px;top:0;bottom:0;width:1px;background:var(--line)}
  @media (max-width:760px){.cv-rail{left:0}}
  .cv-row{display:grid;grid-template-columns:160px 1fr;gap:48px;padding:36px 0;
    border-bottom:1px solid var(--line);position:relative}
  .cv-yr{position:relative;font:500 13px/1.4 var(--mono);color:var(--fg-2);
    text-transform:uppercase;letter-spacing:.06em;padding-left:24px}
  .cv-bullet{position:absolute;left:154px;top:6px;width:10px;height:10px;border-radius:50%;
    background:var(--bg);border:2px solid var(--accent);
    box-shadow:0 0 0 4px rgba(255,85,0,.08)}
  @media (max-width:760px){
    .cv-row{grid-template-columns:1fr;gap:8px;padding-left:24px}
    .cv-bullet{left:-4px}
    .cv-yr{padding-left:0}
  }
  .cv-body{display:flex;flex-direction:column;gap:8px}
  .cv-h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
  .cv-role{font:500 26px/1.15 var(--sans);letter-spacing:-.02em}
  .cv-org{font-family:var(--serif);font-style:italic;font-size:22px;color:var(--fg-2)}
  .cv-note{font:400 16px/1.55 var(--sans);color:var(--fg-2);max-width:65ch}
  .cv-tags{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:4px}
  .cv-tag{font:500 10px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;
    padding:5px 9px;border:1px solid var(--line-2);border-radius:99px;color:var(--fg-2)}
  .cv-loc{font:500 11px/1 var(--mono);color:var(--fg-3);text-transform:uppercase;letter-spacing:.06em}

  .cv-foot{margin-top:72px}
  .cv-foot-row{display:grid;grid-template-columns:1fr 1fr;gap:48px;
    padding-top:48px;border-top:1px solid var(--line)}
  @media (max-width:760px){.cv-foot-row{grid-template-columns:1fr;gap:32px}}
  .cv-list{list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:10px}
  .cv-list li{font:400 15px/1.5 var(--sans);color:var(--fg);display:grid;grid-template-columns:60px 1fr;gap:18px}
  .cv-list span{font-family:var(--mono);font-size:12px;color:var(--accent);letter-spacing:.04em}
  .cv-list em{font-family:var(--serif);font-style:italic;color:var(--fg-2)}
`;

const contactStyles = `
  .contact{padding:120px 0 0;border-top:1px solid var(--line)}
  .ct-eye{display:flex;justify-content:space-between;align-items:center;gap:24px;
    padding-bottom:32px;border-bottom:1px solid var(--line);margin-bottom:48px;flex-wrap:wrap}
  .ct-h{font:500 clamp(56px,9vw,140px)/.95 var(--sans);letter-spacing:-.04em;text-wrap:balance}
  .ct-h em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--fg-2)}
  .ct-mail{display:inline-flex;align-items:center;gap:18px;border:0;
    color:var(--accent);cursor:none;padding:0;line-height:.95;text-align:left;
    font:inherit;letter-spacing:inherit;background:transparent}
  .ct-mail-text{position:relative;transition:color .2s}
  .ct-mail-text::after{content:"";position:absolute;left:0;right:0;bottom:6%;height:6px;
    background:var(--accent);opacity:.4;transition:height .2s}
  .ct-mail:hover .ct-mail-text::after{height:14%}
  .ct-mail-ic{display:inline-grid;place-items:center;width:60px;height:60px;border-radius:50%;
    border:1px solid var(--accent);color:var(--accent);transition:all .25s}
  .ct-mail:hover .ct-mail-ic{background:var(--accent);color:#000;transform:rotate(-8deg) scale(1.05)}

  .ct-rows{display:flex;flex-direction:column;margin-top:80px;border-top:1px solid var(--line)}
  .ct-row{display:grid;grid-template-columns:200px 1fr 32px;gap:24px;align-items:center;
    padding:24px 0;border-bottom:1px solid var(--line);
    font:400 22px/1.2 var(--sans);letter-spacing:-.01em;transition:padding .25s, color .25s}
  .ct-row>span:first-child{font-family:var(--mono);font-size:13px;font-weight:500;
    text-transform:uppercase;letter-spacing:.08em;color:var(--fg-3)}
  .ct-row:hover{padding-left:16px;color:var(--accent)}
  .ct-row .ct-arr{color:var(--fg-3);transition:color .25s,transform .25s}
  .ct-row:hover .ct-arr{color:var(--accent);transform:rotate(-45deg)}
  @media (max-width:760px){
    .ct-row{grid-template-columns:1fr 24px;gap:8px}
    .ct-row>span:first-child{grid-column:1/-1;font-size:10px}
  }

  .footer{display:flex;justify-content:space-between;align-items:flex-end;
    padding:64px 0 48px;gap:32px;flex-wrap:wrap}
  .footer-name{font:500 18px/1 var(--sans);letter-spacing:-.01em}
  .footer-sub{font:500 11px/1.6 var(--mono);color:var(--fg-3);text-transform:uppercase;letter-spacing:.06em;margin-top:8px}
  .footer-r{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
  .footer-grid-l{display:flex;gap:24px;font:500 11px/1 var(--mono);color:var(--fg-3);text-transform:uppercase;letter-spacing:.06em}
  .footer-top{display:inline-flex;align-items:center;gap:8px;font:500 11px/1 var(--mono);
    color:var(--fg-2);text-transform:uppercase;letter-spacing:.08em}
  .footer-top:hover{color:var(--accent)}

  .big-sig{padding:48px 0 24px;overflow:hidden;border-top:1px solid var(--line)}
  .big-sig span{display:block;font:700 clamp(80px,18vw,300px)/.8 var(--sans);
    letter-spacing:-.05em;color:transparent;-webkit-text-stroke:1px var(--fg-3);
    text-align:center;white-space:nowrap;transition:color .4s,-webkit-text-stroke-color .4s}
  .big-sig:hover span{color:var(--accent);-webkit-text-stroke-color:var(--accent)}
`;

window.Resume = Resume;
window.Contact = Contact;
