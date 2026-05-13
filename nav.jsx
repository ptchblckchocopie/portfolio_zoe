// Top navigation bar
function Nav({ onTweaksAvail }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState("home");
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const ids = ["work","about","resume","ask","contact"];
    const onScrollActive = () => {
      const pos = window.scrollY + window.innerHeight * 0.35;
      let cur = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollActive, { passive: true });

    // Smooth scroll for any in-page anchor link (nav, "Back to top", inline links).
    // Tween scrollY with easeInOutCubic; duration scales with distance, capped so
    // long jumps feel snappy and short ones don't feel sluggish.
    let raf = 0;
    const tween = (toY, duration) => {
      const fromY = window.scrollY;
      const dy = toY - fromY;
      if (Math.abs(dy) < 2) return;
      const start = performance.now();
      const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      cancelAnimationFrame(raf);
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        window.scrollTo(0, fromY + dy * ease(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      // bail on user input
      const cancel = () => { cancelAnimationFrame(raf); cleanup(); };
      const cleanup = () => {
        window.removeEventListener("wheel", cancel, { passive: true });
        window.removeEventListener("touchstart", cancel, { passive: true });
        window.removeEventListener("keydown", onKey);
      };
      const onKey = (e) => { if (["ArrowDown","ArrowUp","PageDown","PageUp","Home","End"," "].includes(e.key)) cancel(); };
      window.addEventListener("wheel", cancel, { passive: true });
      window.addEventListener("touchstart", cancel, { passive: true });
      window.addEventListener("keydown", onKey);
      setTimeout(cleanup, duration + 50);
    };
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = href === "#top" ? null : document.getElementById(href.slice(1));
      if (href !== "#top" && !target) return;
      e.preventDefault();
      const navH = 72;
      const toY = href === "#top" ? 0 : Math.max(0, target.getBoundingClientRect().top + window.scrollY - navH);
      const dist = Math.abs(toY - window.scrollY);
      // 600ms minimum, ~1ms per 4px of distance, cap at 1400ms.
      const duration = Math.min(1400, Math.max(600, dist * 0.55));
      tween(toY, duration);
      // update hash without jumping
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollActive);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav className={"nav" + (scrolled ? " nav-scrolled" : "")}>
      <a href="#top" className="nav-brand" data-cursor="top">
        <span className="dot"></span>
        <span>ZMD<span style={{color:"var(--fg-3)"}}>.</span>PABILLARAN</span>
      </a>
      <div className="nav-links">
        <a href="#work" className={active==="work"?"is-on":""}><span className="num">02</span>Work</a>
        <a href="#about" className={active==="about"?"is-on":""}><span className="num">03</span>About</a>
        <a href="#resume" className={active==="resume"?"is-on":""}><span className="num">05</span>CV</a>
        <a href="#ask" className={active==="ask"?"is-on":""}><span className="num">06</span>Ask</a>
        <a href="#contact" className={active==="contact"?"is-on":""}><span className="num">07</span>Contact</a>
      </div>
      <a href="#contact" className="nav-cta" data-cursor="say hi">
        <span className="ic"></span>
        Available
      </a>
      <style>{`
        .nav-scrolled{background:rgba(10,10,10,.85);border-bottom:1px solid var(--line)}
        .nav-links a.is-on{color:var(--fg)}
        .nav-links a.is-on .num{color:var(--accent)}
      `}</style>
    </nav>
  );
}
window.Nav = Nav;
