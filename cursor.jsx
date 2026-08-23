// Custom cursor: dot + ring with hover/drag states
function Cursor({ style = "default" }) {
  const dotRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const labelRef = React.useRef(null);
  const target = React.useRef({ x: 0, y: 0 });
  const ring = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    let raf;
    const onMove = (e) => { target.current.x = e.clientX; target.current.y = e.clientY; };
    const onOver = (e) => {
      const t = e.target;
      const link = t.closest && t.closest("a,button,[data-cursor]");
      const drag = t.closest && t.closest("[data-drag]");
      const label = link && link.getAttribute("data-cursor");
      if (drag) {
        ringRef.current?.classList.add("is-drag");
        ringRef.current?.classList.remove("is-link");
      } else if (link) {
        ringRef.current?.classList.add("is-link");
        ringRef.current?.classList.remove("is-drag");
      } else {
        ringRef.current?.classList.remove("is-link","is-drag");
      }
      if (label && labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.classList.add("show");
      } else {
        labelRef.current?.classList.remove("show");
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    const tick = () => {
      ring.current.x += (target.current.x - ring.current.x) * 0.18;
      ring.current.y += (target.current.y - ring.current.y) * 0.18;
      if (dotRef.current) dotRef.current.style.transform =
        `translate(${target.current.x}px, ${target.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform =
        `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      if (labelRef.current) labelRef.current.style.transform =
        `translate(${ring.current.x}px, ${ring.current.y + 44}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (style === "off") return null;
  return (
    <>
      <div ref={ringRef} className="cur-ring" />
      <div ref={dotRef} className="cur-dot" />
      <div ref={labelRef} className="cur-label"></div>
    </>
  );
}

window.Cursor = Cursor;

// Reveal-on-scroll hook
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-stagger");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
window.useReveal = useReveal;
