"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./enemy.css";

// The signature moment. One canvas holds 40,018 dots — exactly the number of victims Chile later
// recognised (2011 Valech revision). While the label spreads, the field is a country; in the last
// step every dot is a recognised victim and 3,065 of them (killed or disappeared) turn red.
const N = 40018;
const KILLED = 3065;
const BASE_TOTAL = 360; // the stage counts in app/data.js are expressed out of 360

const BG = [25, 25, 22];
const COLORS = {
  neutral: [119, 116, 107],
  named: [224, 72, 63],
  suspended: [224, 160, 50],
  counted: [216, 211, 198],
  killed: [224, 72, 63],
  person: [244, 239, 228],
};

// Individuals who were killed abroad, placed as fractions of the field so they stay left of the cards.
const SPOTS = [
  { fx: 0.2, fy: 0.3, label: "Carlos Prats" },
  { fx: 0.4, fy: 0.64, label: "Orlando Letelier" },
  { fx: 0.43, fy: 0.69, label: "Ronni Moffitt" },
];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// RANK[i] says when dot i is reached by the label; DELAY_NOISE decorrelates the wave from the rank.
const { RANK, NOISE } = (() => {
  const rand = mulberry32(1973);
  const order = new Uint32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }
  const rank = new Uint32Array(N);
  for (let r = 0; r < N; r++) rank[order[r]] = r;
  const noise = new Float32Array(N);
  for (let i = 0; i < N; i++) noise[i] = rand();
  return { RANK: rank, NOISE: noise };
})();

function kindFor(stage, rank) {
  if (stage.mode === "count") return rank < KILLED ? "killed" : "counted";
  const named = Math.round((stage.named / BASE_TOTAL) * N);
  const suspended = Math.round((stage.suspended / BASE_TOTAL) * N);
  if (rank < named) return "named";
  if (rank < named + suspended) return "suspended";
  return "neutral";
}

const pack = (c) => (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];

function createField(canvas) {
  const ctx = canvas.getContext("2d");
  const from = new Uint8Array(N * 3);
  const to = new Uint8Array(N * 3);
  const cur = new Uint8Array(N * 3);
  const delay = new Float32Array(N);
  const posX = new Int32Array(N);
  const posY = new Int32Array(N);
  const prog = { p: 1 };
  const ringT = { v: 0 };
  let dpr = 1, W = 0, H = 0, cols = 1, rows = 1, pitchX = 2, pitchY = 2, sizeX = 1, sizeY = 1, offX = 0, offY = 0;
  let img = null, buf = null;
  let stage = null, stageIndex = 0, spots = [];

  function layout() {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width); H = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    // Integer pixel pitches (separate for x and y so the field fills the width): every column and
    // every row repeats at a whole number of device pixels, so the lattice never shows moiré.
    const Wd = canvas.width, Hd = canvas.height;
    // Try column counts around the ideal one and keep the one whose whole-pixel grid covers the
    // box best, so the field reaches the edges instead of leaving a rounding margin.
    const ideal = Math.sqrt((N * Wd) / Hd);
    let best = { score: -1, c: 1, px: 1, py: 1 };
    for (let c = Math.max(1, Math.floor(ideal * 0.8)); c <= Math.ceil(ideal * 1.25); c++) {
      const r = Math.ceil(N / c);
      const px = Math.floor(Wd / c), py = Math.floor(Hd / r);
      if (px < 1 || py < 1) continue;
      const score = ((px * c) / Wd) * ((py * r) / Hd) - Math.abs(px - py) * 0.01;
      if (score > best.score) best = { score, c, px, py };
    }
    cols = best.c; rows = Math.ceil(N / cols);
    pitchX = Math.max(1, best.px); pitchY = Math.max(1, best.py);
    sizeX = pitchX >= 3 ? pitchX - 1 : 1;
    sizeY = pitchY >= 3 ? pitchY - 1 : 1;
    offX = Math.floor((Wd - cols * pitchX) / 2); offY = Math.floor((Hd - rows * pitchY) / 2);
    img = ctx.createImageData(Wd, Hd);
    buf = new Uint32Array(img.data.buffer);
    for (let i = 0; i < N; i++) {
      posX[i] = offX + (i % cols) * pitchX + ((pitchX - sizeX) >> 1);
      posY[i] = offY + ((i / cols) | 0) * pitchY + ((pitchY - sizeY) >> 1);
    }
    spots = SPOTS.map((s) => {
      const c = Math.round(s.fx * (cols - 1)), r = Math.round(s.fy * (rows - 1));
      const i = Math.min(N - 1, r * cols + c);
      return { i, label: s.label };
    });
  }

  function draw() {
    if (!buf) return;
    const bg = pack(BG);
    buf.fill(bg);
    const p = prog.p;
    const cw = canvas.width;
    const ch = canvas.height;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      let t = (p - delay[i] * 0.55) / 0.45;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      t = t * t * (3 - 2 * t);
      const r = (from[k] + (to[k] - from[k]) * t) | 0;
      const g = (from[k + 1] + (to[k + 1] - from[k + 1]) * t) | 0;
      const b = (from[k + 2] + (to[k + 2] - from[k + 2]) * t) | 0;
      cur[k] = r; cur[k + 1] = g; cur[k + 2] = b;
      const color = (255 << 24) | (b << 16) | (g << 8) | r;
      const x0 = posX[i], y0 = posY[i];
      for (let dy = 0; dy < sizeY; dy++) {
        const y = y0 + dy;
        if (y < 0 || y >= ch) continue;
        const inset = sizeX >= 5 && sizeY >= 5 && (dy === 0 || dy === sizeY - 1) ? 1 : 0;
        const xs = Math.max(0, x0 + inset), xe = Math.min(cw, x0 + sizeX - inset);
        if (xe > xs) buf.fill(color, y * cw + xs, y * cw + xe);
      }
    }
    ctx.putImageData(img, 0, 0);
    // Rings and names for the people killed abroad.
    if (ringT.v > 0.001 && stage?.rings?.length) {
      const shown = spots.slice(0, stage.rings.length);
      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = "#f4efe4";
      ctx.fillStyle = "#f4efe4";
      ctx.font = `${12 * dpr}px "DM Mono", monospace`;
      ctx.textBaseline = "middle";
      for (const s of shown) {
        const x = posX[s.i] + sizeX / 2;
        const y = posY[s.i] + sizeY / 2;
        const rad = (10 + (1 - ringT.v) * 26) * dpr;
        ctx.globalAlpha = ringT.v;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke();
        ctx.fillText(s.label.toUpperCase(), x + 20 * dpr, y);
      }
      ctx.globalAlpha = 1;
    }
  }

  function setStage(next, index, instant) {
    const forward = !stage || index >= stageIndex;
    stage = next; stageIndex = index;
    from.set(cur);
    const shown = spots.slice(0, next.rings?.length || 0).map((s) => s.i);
    for (let i = 0; i < N; i++) {
      const c = shown.includes(i) ? COLORS.person : COLORS[kindFor(next, RANK[i])];
      to[i * 3] = c[0]; to[i * 3 + 1] = c[1]; to[i * 3 + 2] = c[2];
      if (next.mode === "count") {
        const dx = ((i % cols) + 0.5) / cols - 0.5, dy = (((i / cols) | 0) + 0.5) / rows - 0.5;
        delay[i] = Math.min(1, Math.hypot(dx * (W / H), dy) * 1.1) * 0.7 + NOISE[i] * 0.3;
      } else {
        const x = ((i % cols) + 0.5) / cols;
        delay[i] = (forward ? x : 1 - x) * 0.7 + NOISE[i] * 0.3;
      }
    }
    gsap.killTweensOf(prog);
    gsap.killTweensOf(ringT);
    const wantRings = next.rings?.length ? 1 : 0;
    if (instant) {
      from.set(to); prog.p = 1; ringT.v = wantRings; draw();
    } else {
      prog.p = 0;
      gsap.to(prog, { p: 1, duration: 2.6, ease: "power1.inOut", onUpdate: draw });
      gsap.to(ringT, { v: wantRings, duration: 1.2, delay: wantRings ? 1.2 : 0, ease: "power3.out", onUpdate: draw });
    }
  }

  return {
    init() { layout(); from.set(to); cur.fill(0); for (let i = 0; i < N; i++) { cur[i * 3] = BG[0]; cur[i * 3 + 1] = BG[1]; cur[i * 3 + 2] = BG[2]; } },
    setStage,
    resize() { layout(); if (stage) { const keep = stage; setStage(keep, stageIndex, true); } },
    destroy() { gsap.killTweensOf(prog); gsap.killTweensOf(ringT); },
  };
}

export default function EnemyDefiner({ stages, locale, t }) {
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);
  const statRef = useRef(null);
  const statValueRef = useRef(null);
  const counter = useRef({ v: 0 });
  const stageRef = useRef({ stages, active: 0 });
  stageRef.current = { stages, active };

  // Mount: build the canvas field and keep it sized to its box.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const field = createField(canvas);
    fieldRef.current = field;
    field.init();
    field.resize();
    const { stages: list, active: idx } = stageRef.current;
    field.setStage(list[idx], idx, true);
    const ro = new ResizeObserver(() => field.resize());
    ro.observe(canvas);
    return () => { ro.disconnect(); field.destroy(); fieldRef.current = null; };
  }, []);

  // Which step is under the reading line drives the field.
  useEffect(() => {
    const steps = rootRef.current?.querySelectorAll("[data-step]");
    if (!steps?.length || !("IntersectionObserver" in window)) return;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const observer = new IntersectionObserver(
      (entries) => { for (const entry of entries) if (entry.isIntersecting) setActive(Number(entry.target.dataset.step)); },
      { rootMargin: mobile ? "-62% 0px -30% 0px" : "-45% 0px -45% 0px", threshold: 0 },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  // The field and the counter respond to the active step.
  useEffect(() => {
    const stage = stages[active];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fieldRef.current?.setStage(stage, active, reduce);
    const statEl = statRef.current;
    const valueEl = statValueRef.current;
    if (statEl && valueEl) {
      if (stage.stat) {
        const target = stage.stat.value;
        counter.current.v = counter.current.v > target ? 0 : counter.current.v;
        gsap.to(statEl, { opacity: 1, y: 0, duration: reduce ? 0 : 0.4 });
        gsap.to(counter.current, {
          v: target,
          duration: reduce ? 0 : 2.4,
          ease: "power2.out",
          onUpdate: () => { valueEl.textContent = Math.round(counter.current.v).toLocaleString(locale); },
        });
      } else {
        gsap.to(statEl, { opacity: 0, y: 8, duration: reduce ? 0 : 0.3 });
      }
    }
  }, [active, stages, locale]);

  const goTo = useCallback((i) => {
    const step = rootRef.current?.querySelector(`[data-step="${i}"]`);
    step?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  }, []);

  const stage = stages[active];
  const summary = `${stage.title} ${stage.legend.map(([, text]) => text).join(", ")}`;

  return (
    <section className="enemy" id="enemy" ref={rootRef} aria-label={t.aria}>
      <div className="enemy-head">
        <p className="eyebrow"><span>{t.part}</span> {t.eyebrow}</p>
        <h2>{t.h2[0]}<br />{t.h2[1]}<em>{t.h2[2]}</em></h2>
        <p>{t.intro}</p>
      </div>

      <div className="enemy-stage">
        <div className="enemy-field">
          <canvas ref={canvasRef} className="enemy-canvas" role="img" aria-label={summary} />
          <nav className="enemy-nav" aria-label={t.nav}>
            {stages.map((s, i) => (
              <button key={s.key} type="button" aria-current={i === active ? "step" : undefined} aria-label={`${s.date}: ${s.title}`} onClick={() => goTo(i)} className={i === active ? "is-active" : i < active ? "is-past" : ""}>
                <i aria-hidden="true" /><span>{s.short}</span>
              </button>
            ))}
          </nav>
          <div className="enemy-hud">
            <div className={`enemy-stat${stage.stat ? "" : " is-empty"}`} ref={statRef}>
              <strong ref={statValueRef}>0</strong>
              <span>{stage.stat?.label ?? ""}</span>
            </div>
            <ul className="enemy-legend" aria-live="polite">
              {stage.legend.map(([kind, text]) => (
                <li key={kind + text}><i className={`swatch swatch-${kind}`} />{text}</li>
              ))}
            </ul>
            <p className="enemy-disclaimer">{stage.mode === "count" ? t.disclaimerCount : t.disclaimer}</p>
          </div>
        </div>

        <ol className="enemy-steps">
          {stages.map((s, i) => (
            <li key={s.key} data-step={i} className={i === active ? "is-active" : ""}>
              <div className="enemy-card">
                <p className="enemy-date">{s.date}</p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                {s.note && <p className="fact-note">{s.note}</p>}
                {s.source && <a className="enemy-source" href={s.source.href} target="_blank" rel="noreferrer">{s.source.label} <span aria-hidden="true">↗</span></a>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
