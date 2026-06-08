import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,300;1,300&family=JetBrains+Mono:wght@300;400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0B0D11;
    --bg2: #111418;
    --bg3: #181C22;
    --text: #E8EAF0;
    --text2: #8C92A4;
    --text3: #555C6E;
    --accent: #00E5A0;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Newsreader', serif; font-weight: 300; overflow-x: hidden; cursor: none; }

  .cursor-dot {
    position: fixed; pointer-events: none; z-index: 9999;
    width: 8px; height: 8px; background: var(--accent); border-radius: 50%;
    transform: translate(-50%, -50%); transition: transform 0.1s;
  }
  .cursor-ring {
    position: fixed; pointer-events: none; z-index: 9998;
    width: 40px; height: 40px; border: 1px solid var(--accent); border-radius: 50%;
    transform: translate(-50%, -50%); opacity: 0.45;
    transition: width 0.2s, height 0.2s, opacity 0.2s;
  }
  .cursor-ring.hovered { width: 64px; height: 64px; opacity: 0.2; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 3rem;
    background: rgba(11,13,17,0.85); backdrop-filter: blur(16px);
    border-bottom: 0.5px solid var(--border);
  }
  .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; letter-spacing: 0.04em; color: var(--text); text-decoration: none; }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a { text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text2); transition: color 0.2s; }
  .nav-links a:hover { color: var(--accent); }
  .nav-status { display: flex; align-items: center; gap: 0.6rem; font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--accent); letter-spacing: 0.08em; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }

  .hero {
    min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
    padding: 9rem 3rem 5rem; position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    pointer-events: none;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(26px); } to { opacity:1; transform:translateY(0); } }
  .hero-tag { font-family:'JetBrains Mono',monospace; font-size:0.7rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); margin-bottom:2rem; animation: fadeUp 0.7s 0.2s both; }
  .hero-name { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(3.5rem,8vw,8rem); line-height:0.92; letter-spacing:-0.025em; margin-bottom:1.75rem; animation: fadeUp 0.8s 0.4s both; }
  .hero-name .hollow { -webkit-text-stroke:1px rgba(232,234,240,0.28); color:transparent; }
  .hero-name .green { color:var(--accent); }
  .hero-desc { max-width:52ch; font-size:1.05rem; line-height:1.8; color:var(--text2); margin-bottom:3rem; animation: fadeUp 0.8s 0.6s both; }
  .hero-actions { display:flex; gap:1rem; align-items:center; animation: fadeUp 0.8s 0.8s both; }
  .btn-primary { display:inline-flex; align-items:center; gap:0.4rem; padding:0.85rem 2rem; background:var(--accent); color:#0B0D11; font-family:'Syne',sans-serif; font-weight:700; font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border:none; cursor:none; transition:transform 0.2s,box-shadow 0.2s; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,229,160,0.3); }
  .btn-outline { display:inline-flex; align-items:center; gap:0.4rem; padding:0.85rem 2rem; background:transparent; color:var(--text); font-family:'Syne',sans-serif; font-weight:600; font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; border:0.5px solid var(--border2); cursor:none; transition:border-color 0.2s,color 0.2s; }
  .btn-outline:hover { border-color:var(--accent); color:var(--accent); }

  section { padding:6rem 3rem; border-top:0.5px solid var(--border); }
  .sec-label { font-family:'JetBrains Mono',monospace; font-size:0.65rem; letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); margin-bottom:1rem; }
  .sec-title { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(2rem,4vw,3.5rem); letter-spacing:-0.02em; line-height:1.05; margin-bottom:3rem; }

  .reveal { opacity:0; transform:translateY(28px); transition:opacity 0.8s ease,transform 0.8s ease; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:start; }
  .about-text p { font-size:1rem; line-height:1.85; color:var(--text2); margin-bottom:1.25rem; }
  .about-sidebar { display:flex; flex-direction:column; gap:1rem; }
  .info-card { background:var(--bg2); border:0.5px solid var(--border); padding:1.1rem 1.4rem; }
  .info-card-label { font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--text3); margin-bottom:0.35rem; }
  .info-card-value { font-family:'Syne',sans-serif; font-weight:600; font-size:0.9rem; color:var(--text); }
  .info-card-value a { color:var(--accent); text-decoration:none; }
  .info-card-value a:hover { text-decoration:underline; }

  .skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1px; background:var(--border); border:0.5px solid var(--border); }
  .skill-group { background:var(--bg); padding:2rem; }
  .skill-group-title { font-family:'Syne',sans-serif; font-weight:700; font-size:0.88rem; color:var(--accent); margin-bottom:1.25rem; }
  .skill-tags { display:flex; flex-wrap:wrap; gap:0.5rem; }
  .skill-tag { padding:0.3rem 0.8rem; border:0.5px solid var(--border2); font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:var(--text2); letter-spacing:0.05em; transition:border-color 0.2s,color 0.2s,background 0.2s; cursor:default; }
  .skill-tag:hover { border-color:var(--accent); color:var(--accent); background:rgba(0,229,160,0.06); }

  .exp-item { display:grid; grid-template-columns:220px 1fr; gap:3rem; padding:2.5rem 0; border-bottom:0.5px solid var(--border); }
  .exp-item:last-child { border-bottom:none; }
  .exp-meta-label { font-family:'JetBrains Mono',monospace; font-size:0.6rem; letter-spacing:0.16em; text-transform:uppercase; color:var(--text3); margin-bottom:0.35rem; }
  .exp-meta-val { font-family:'JetBrains Mono',monospace; font-size:0.78rem; color:var(--text2); margin-bottom:1.25rem; }
  .exp-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.15rem; margin-bottom:0.4rem; }
  .exp-sub { font-size:0.82rem; color:var(--accent); margin-bottom:1.25rem; font-family:'JetBrains Mono',monospace; letter-spacing:0.06em; }
  .exp-bullets { list-style:none; display:flex; flex-direction:column; gap:0.75rem; }
  .exp-bullets li { font-size:0.95rem; line-height:1.7; color:var(--text2); padding-left:1.25rem; position:relative; }
  .exp-bullets li::before { content:'▸'; position:absolute; left:0; color:var(--accent); font-size:0.7rem; top:0.28rem; }

  .projects-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:0.5px solid var(--border); }
  .project-card { background:var(--bg); padding:2.5rem; position:relative; overflow:hidden; transition:background 0.3s; cursor:default; }
  .project-card:hover { background:var(--bg2); }
  .project-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--accent); transform:scaleX(0); transform-origin:left; transition:transform 0.4s ease; }
  .project-card:hover::after { transform:scaleX(1); }
  .project-num { font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:var(--text3); letter-spacing:0.18em; margin-bottom:1.25rem; }
  .project-title { font-family:'Syne',sans-serif; font-weight:700; font-size:1.05rem; margin-bottom:0.75rem; }
  .project-desc { font-size:0.9rem; line-height:1.7; color:var(--text2); }
  .project-tags { display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:1.5rem; }
  .project-tag { padding:0.25rem 0.65rem; background:rgba(0,229,160,0.08); border:0.5px solid rgba(0,229,160,0.2); font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:var(--accent); letter-spacing:0.06em; }

  .edu-timeline { display:flex; flex-direction:column; }
  .edu-item { display:grid; grid-template-columns:220px 1fr; padding:2rem 0; border-bottom:0.5px solid var(--border); }
  .edu-item:last-child { border-bottom:none; }
  .edu-year { font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:var(--text3); padding-top:0.2rem; }
  .edu-degree { font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; margin-bottom:0.3rem; }
  .edu-school { font-size:0.9rem; color:var(--text2); margin-bottom:0.25rem; }
  .edu-gpa { font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:var(--accent); }

  .cert-list { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1rem; }
  .cert-card { background:var(--bg2); border:0.5px solid var(--border); padding:1.4rem; display:flex; align-items:flex-start; gap:1rem; transition:border-color 0.2s; }
  .cert-card:hover { border-color:var(--accent); }
  .cert-icon { width:36px; height:36px; border-radius:50%; background:rgba(0,229,160,0.1); border:0.5px solid rgba(0,229,160,0.25); display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
  .cert-name { font-family:'Syne',sans-serif; font-weight:600; font-size:0.88rem; line-height:1.45; padding-top:0.2rem; }

  .contact-inner { display:grid; grid-template-columns:1fr 1fr; gap:4rem; }
  .contact-big { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(2.5rem,5vw,5rem); letter-spacing:-0.025em; line-height:1; margin-bottom:1.5rem; }
  .contact-big em { font-style:italic; font-family:'Newsreader',serif; font-weight:300; color:var(--accent); }
  .contact-sub { font-size:1rem; line-height:1.75; color:var(--text2); max-width:44ch; }
  .contact-links { display:flex; flex-direction:column; gap:0.75rem; }
  .contact-link { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.4rem; background:var(--bg2); border:0.5px solid var(--border); text-decoration:none; color:var(--text); transition:border-color 0.2s,background 0.2s; }
  .contact-link:hover { border-color:var(--accent); background:rgba(0,229,160,0.04); }
  .contact-link-label { font-family:'Syne',sans-serif; font-weight:600; font-size:0.88rem; }
  .contact-link-value { font-family:'JetBrains Mono',monospace; font-size:0.68rem; color:var(--text2); margin-top:0.2rem; }
  .contact-link-arrow { color:var(--accent); font-size:1.1rem; transition:transform 0.2s; }
  .contact-link:hover .contact-link-arrow { transform:translateX(5px); }

  footer { padding:2rem 3rem; border-top:0.5px solid var(--border); display:flex; justify-content:space-between; align-items:center; }
  .footer-copy { font-family:'JetBrains Mono',monospace; font-size:0.62rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--text3); }
  .footer-made { font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:var(--text3); }
  .footer-made span { color:var(--accent); }

  @media(max-width:900px){
    nav { padding:1rem 1.5rem; }
    .nav-links { display:none; }
    section { padding:4rem 1.5rem; }
    .hero { padding:7rem 1.5rem 4rem; }
    .about-grid,.contact-inner { grid-template-columns:1fr; }
    .exp-item,.edu-item { grid-template-columns:1fr; gap:0.75rem; }
    .projects-grid { grid-template-columns:1fr; }
    footer { flex-direction:column; gap:1rem; text-align:center; padding:2rem 1.5rem; }
  }
`;

// ── Data ──────────────────────────────────────────────────
const SKILLS = [
  { group: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "React.js"] },
  { group: "Backend",  items: ["Node.js", "PHP", "Python", "Java", "C/C++"] },
  { group: "Data & AI", items: ["Machine Learning", "Artificial Intelligence", "YOLOv8", "SQL Server", "Database Design"] },
  { group: "Tools & Other", items: ["WordPress", "IT & Networking", "QA", "Full Stack Dev", "Teamwork"] },
];

const PROJECTS = [
  { num: "01 — THESIS", title: "Real-Time Object Detection Framework", desc: "Developed a real-time detection system using YOLOv8 and Python capable of identifying objects in images and videos. Completed all research and implementation independently.", tags: ["YOLOv8","Python","Deep Learning","Computer Vision"] },
  { num: "02 — PROJECT", title: "Rain Detection & Cloth Saving System", desc: "An automated system designed to detect rainfall and trigger a cloth-saving mechanism — combining hardware logic and software control.", tags: ["IoT","Automation","Sensors"] },
  { num: "03 — WEB", title: "Full-Stack Web Applications", desc: "Multiple web applications built with JavaScript, Python frameworks, PHP, and Node.js — focused on clean UX and solid architecture.", tags: ["JavaScript","PHP","Node.js","SQL"] },
  { num: "04 — AI/ML", title: "AI-Powered Productivity Tools", desc: "Exploring and building applications that leverage machine learning and AI to enhance user workflows, combining prompt engineering with ML implementation.", tags: ["Machine Learning","AI","Prompt Engineering"] },
];

const EDUCATION = [
  { year: "2022 — 2026", degree: "Bachelor of Computer Science & Engineering", school: "City University, Bangladesh", gpa: "CGPA: 2.88" },
  { year: "2019 — 2021", degree: "Higher Secondary Certificate (HSC)", school: "College of Finance & Management · Science Group", gpa: "GPA: 4.08" },
  { year: "2017 — 2019", degree: "Secondary School Certificate (SSC)", school: "Nayarhat Ganabidyapith · Science Group", gpa: "GPA: 3.94" },
];

const CERTS = [
  { icon: "🤖", name: "AI Cert's Prompt Engineer Level 1" },
  { icon: "💻", name: "Grace Hopper Programming Camp" },
  { icon: "🏥", name: "Doctor's ICT Chamber" },
  { icon: "🌐", name: "Netcom Learning" },
  { icon: "🎓", name: "City University Computer Club Membership" },
];

const CONTACTS = [
  { label: "Email",    value: "soiedebnea@gmail.com",        href: "mailto:soiedebnea@gmail.com" },
  { label: "Phone",    value: "+880 1609 244 817",            href: "tel:+8801609244817" },
  { label: "LinkedIn", value: "linkedin.com/in/ebena-soied", href: "https://linkedin.com/in/ebena-soied" },
  { label: "GitHub",   value: "github.com/soiedebnea",       href: "https://github.com/soiedebnea" },
];

// ── Hooks ─────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = e => { pos.current.x = e.clientX; pos.current.y = e.clientY; };
    document.addEventListener("mousemove", onMove);
    let raf;
    const loop = () => {
      const p = pos.current;
      p.rx += (p.x - p.rx) * 0.13;
      p.ry += (p.y - p.ry) * 0.13;
      if (dotRef.current)  { dotRef.current.style.left  = p.x  + "px"; dotRef.current.style.top  = p.y  + "px"; }
      if (ringRef.current) { ringRef.current.style.left = p.rx + "px"; ringRef.current.style.top = p.ry + "px"; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const hoverEls = document.querySelectorAll("a, button, .skill-tag, .cert-card, .project-card");
    const on  = () => ringRef.current?.classList.add("hovered");
    const off = () => ringRef.current?.classList.remove("hovered");
    hoverEls.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });

    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return { dotRef, ringRef };
}

// ── Main Component ────────────────────────────────────────
export default function Portfolio() {
  useScrollReveal();
  const { dotRef, ringRef } = useCursor();

  return (
    <>
      <style>{style}</style>

      {/* Cursor */}
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />

      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">ESS<span>.</span></a>
        <ul className="nav-links">
          {["about","skills","experience","projects","education","contact"].map(s => (
            <li key={s}><a href={`#${s}`}>{s}</a></li>
          ))}
        </ul>
        <div className="nav-status">
          <div className="status-dot" />
          Open to work
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ border: "none", paddingTop: "9rem" }}>
        <div className="hero-grid" />
        <p className="hero-tag">Web Developer &amp; AI Enthusiast — Savar, Dhaka</p>
        <h1 className="hero-name">
          Ebnea<br />
          Soied<br />
          <span className="hollow">Siyam<span className="green">.</span></span>
        </h1>
        <p className="hero-desc">
          Motivated web developer with a foundation in programming, software engineering, and AI.
          Proficient in HTML, CSS, JavaScript, React, and backend technologies — passionate about
          building applications that enhance user productivity through artificial intelligence.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary">Get in touch ↗</a>
          <a href="#projects" className="btn-outline">View projects</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <p className="sec-label reveal">01 — About</p>
        <div className="about-grid">
          <div className="about-text reveal">
            <h2 className="sec-title">Building things<br /><em style={{ fontFamily: "'Newsreader',serif", fontStyle: "italic", fontWeight: 300, color: "var(--accent)" }}>that matter.</em></h2>
            <p>I'm a Computer Science & Engineering student at City University (2022–2026) with a deep passion for web development and artificial intelligence.</p>
            <p>My journey spans front-end craftsmanship with HTML, CSS and JavaScript to backend systems with PHP, Node.js and database design — and into machine learning with my YOLOv8 thesis project.</p>
            <p>I'm seeking an entry-level role where I can contribute meaningfully, keep learning, and build things worth using.</p>
          </div>
          <div className="about-sidebar reveal">
            {[
              { label: "Location",  value: "Savar, Dhaka, Bangladesh" },
              { label: "Email",     value: <a href="mailto:soiedebnea@gmail.com">soiedebnea@gmail.com</a> },
              { label: "Phone",     value: "+880 1609 244 817" },
              { label: "LinkedIn",  value: <a href="https://linkedin.com/in/ebena-soied" target="_blank" rel="noreferrer">linkedin.com/in/ebena-soied</a> },
              { label: "GitHub",    value: <a href="https://github.com/soiedebnea" target="_blank" rel="noreferrer">github.com/soiedebnea</a> },
              { label: "Languages", value: "English & Bangla (Native)" },
            ].map(({ label, value }) => (
              <div className="info-card" key={label}>
                <p className="info-card-label">{label}</p>
                <p className="info-card-value">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <p className="sec-label reveal">02 — Skills</p>
        <h2 className="sec-title reveal">What I work with</h2>
        <div className="skills-grid reveal">
          {SKILLS.map(({ group, items }) => (
            <div className="skill-group" key={group}>
              <p className="skill-group-title">{group}</p>
              <div className="skill-tags">
                {items.map(t => <span className="skill-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience">
        <p className="sec-label reveal">03 — Experience</p>
        <h2 className="sec-title reveal">Work &amp; projects</h2>
        <div className="exp-item reveal">
          <div>
            <p className="exp-meta-label">Role</p>
            <p className="exp-meta-val">Junior Web Developer</p>
            <p className="exp-meta-label">Location</p>
            <p className="exp-meta-val">Dhaka, Bangladesh</p>
            <p className="exp-meta-label">Type</p>
            <p className="exp-meta-val">Academic &amp; Personal Projects</p>
          </div>
          <div>
            <h3 className="exp-title">Independent Development Projects</h3>
            <p className="exp-sub">Self-directed · Dhaka, Bangladesh</p>
            <ul className="exp-bullets">
              <li>Developed software applications with Java, HTML, CSS and JavaScript, building robust front-end interfaces with engaging user experiences.</li>
              <li>Built web applications using JavaScript and Python frameworks, enhancing user experience and engagement across multiple project scopes.</li>
              <li>Designed and implemented databases using SQL Server Management Studio, supporting data management needs for various applications.</li>
              <li>Researched emerging technologies and proposed innovative solutions that informed project direction and architecture decisions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <p className="sec-label reveal">04 — Projects &amp; Thesis</p>
        <h2 className="sec-title reveal">Things I've built</h2>
        <div className="projects-grid reveal">
          {PROJECTS.map(({ num, title, desc, tags }) => (
            <div className="project-card" key={title}>
              <p className="project-num">{num}</p>
              <h3 className="project-title">{title}</h3>
              <p className="project-desc">{desc}</p>
              <div className="project-tags">
                {tags.map(t => <span className="project-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <p className="sec-label reveal">05 — Education</p>
        <h2 className="sec-title reveal">Academic background</h2>
        <div className="edu-timeline">
          {EDUCATION.map(({ year, degree, school, gpa }) => (
            <div className="edu-item reveal" key={year}>
              <div className="edu-year">{year}</div>
              <div>
                <p className="edu-degree">{degree}</p>
                <p className="edu-school">{school}</p>
                <p className="edu-gpa">{gpa}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATES */}
      <section>
        <p className="sec-label reveal">06 — Certificates</p>
        <h2 className="sec-title reveal">Credentials &amp; training</h2>
        <div className="cert-list reveal">
          {CERTS.map(({ icon, name }) => (
            <div className="cert-card" key={name}>
              <div className="cert-icon">{icon}</div>
              <p className="cert-name">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <p className="sec-label reveal">07 — Contact</p>
        <div className="contact-inner">
          <div className="reveal">
            <h2 className="contact-big">Let's<br /><em>connect</em></h2>
            <p className="contact-sub">I'm open to entry-level web development roles, freelance projects, and collaboration on exciting AI or web projects. Don't hesitate to reach out.</p>
          </div>
          <div className="contact-links reveal">
            {CONTACTS.map(({ label, value, href }) => (
              <a className="contact-link" href={href} key={label} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <div>
                  <p className="contact-link-label">{label}</p>
                  <p className="contact-link-value">{value}</p>
                </div>
                <span className="contact-link-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p className="footer-copy">© 2026 Ebnea Soied Siyam. All rights reserved.</p>
        <p className="footer-made">Built with <span>♥</span> in Dhaka, Bangladesh</p>
      </footer>
    </>
  );
}