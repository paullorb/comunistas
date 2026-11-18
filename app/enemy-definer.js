"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const COLS = 24;
const ROWS = 15;
const GAP = 20;
const TOTAL = COLS * ROWS; // 360
const COUNT_KILLED = Math.round((3065 / 40018) * TOTAL); // ≈ 28 dots

const COLORS = {
  neutral: "#9a968b",
  named: "#bf2727",
  suspended: "#c98a1b",
  counted: "#191916",
  killed: "#bf2727",
};

// Deterministic shuffle so the field looks the same on server and client and between visits.
function buildRanks() {
  let seed = 1973;
  const rand = () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = Array.from({ length: TOTAL }, (_, i) => i);
  for (let i = TOTAL - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = Array.from({ length: TOTAL });
  order.forEach((dot, r) => { rank[dot] = r; });
  return rank;
}

const RANK = buildRanks();
const RING_DOTS = [69, 267, 292];

function dotState(stage, i) {
  if (stage.mode === "count") return RANK[i] < COUNT_KILLED ? "killed" : "counted";
  const r = RANK[i];
  if (r < stage.named) return "named";
  if (r < stage.named + stage.suspended) return "suspended";
  return "neutral";
}

const px = (i) => (i % COLS) * GAP + GAP / 2;
const py = (i) => Math.floor(i / COLS) * GAP + GAP / 2;

const Field = memo(function Field() {
  return (
    <svg className="enemy-svg" viewBox={`0 0 ${COLS * GAP} ${ROWS * GAP}`} aria-hidden="true">
      {Array.from({ length: TOTAL }, (_, i) => (
        <circle key={i} className="dot" cx={px(i)} cy={py(i)} r="6.4" />
      ))}
      {RING_DOTS.map((i) => (
        <circle key={`ring-${i}`} className="dot-ring" data-ring={i} cx={px(i)} cy={py(i)} r="13" />
      ))}
    </svg>
  );
});

export default function EnemyDefiner({ stages, locale, t }) {
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const statRef = useRef(null);
  const statValueRef = useRef(null);
  const prevStageRef = useRef(null);
  const counter = useRef({ v: 0 });

  // Which step is under the reading line drives the field.
  useEffect(() => {
    const steps = rootRef.current?.querySelectorAll("[data-step]");
    if (!steps?.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.step));
        }
      },
      { rootMargin: window.matchMedia("(max-width: 900px)").matches ? "-62% 0px -30% 0px" : "-42% 0px -48% 0px", threshold: 0 },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  // The field responds to the active step.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = stages[active];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dots = root.querySelectorAll(".dot");
    const rings = root.querySelectorAll(".dot-ring");
    const prev = prevStageRef.current;
    prevStageRef.current = stage;

    {
      const next = Array.from(dots, (_, i) => dotState(stage, i));
      const before = prev ? Array.from(dots, (_, i) => dotState(prev, i)) : null;
      const changed = [];
      next.forEach((s, i) => { if (!before || before[i] !== s) changed.push(dots[i]); });

      if (reduce) {
        dots.forEach((dot, i) => { dot.style.fill = COLORS[next[i]]; });
      } else if (changed.length) {
        gsap.to(changed, {
          fill: (i, el) => COLORS[next[Array.prototype.indexOf.call(dots, el)]],
          duration: 0.55,
          ease: "power2.out",
          stagger: { amount: 0.9, from: "center", grid: [ROWS, COLS] },
          overwrite: "auto",
        });
        gsap.fromTo(
          changed,
          { scale: 1.9 },
          { scale: 1, duration: 0.7, ease: "back.out(2.4)", stagger: { amount: 0.9, from: "center" }, overwrite: "auto" },
        );
      }

      // Rings: outline the people killed outside Chile.
      rings.forEach((ring) => {
        const shown = stage.rings?.includes(Number(ring.dataset.ring));
        gsap.to(ring, {
          opacity: shown ? 1 : 0,
          scale: shown ? 1 : 2.4,
          duration: reduce ? 0 : 0.7,
          ease: "power3.out",
        });
      });

      // Stat counter.
      const statEl = statRef.current;
      const valueEl = statValueRef.current;
      if (statEl && valueEl) {
        if (stage.stat) {
          const target = stage.stat.value;
          const from = counter.current.v > target ? 0 : counter.current.v;
          counter.current.v = from;
          gsap.to(statEl, { opacity: 1, y: 0, duration: reduce ? 0 : 0.4 });
          gsap.to(counter.current, {
            v: target,
            duration: reduce ? 0 : target > 1000 ? 1.6 : 0.8,
            ease: "power2.out",
            onUpdate: () => { valueEl.textContent = Math.round(counter.current.v).toLocaleString(locale); },
          });
        } else {
          gsap.to(statEl, { opacity: 0, y: 8, duration: reduce ? 0 : 0.3 });
        }
      }
    }
  }, [active, locale]);

  const goTo = useCallback((i) => {
    const step = rootRef.current?.querySelector(`[data-step="${i}"]`);
    step?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  }, []);

  const stage = stages[active];

  return (
    <section className="enemy" id="enemy" ref={rootRef} aria-label={t.aria}>
      <div className="enemy-head">
        <p className="eyebrow"><span>02</span> {t.eyebrow}</p>
        <h2>{t.h2[0]}<br />{t.h2[1]}<em>{t.h2[2]}</em></h2>
        <p>{t.intro}</p>
      </div>

      <div className="enemy-stage">
        <div className="enemy-sticky">
          <nav className="enemy-nav" aria-label={t.nav}>
            {stages.map((s, i) => (
              <button key={s.key} type="button" aria-current={i === active ? "step" : undefined} aria-label={`${s.date}: ${s.title}`} onClick={() => goTo(i)} className={i === active ? "is-active" : i < active ? "is-past" : ""}>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
          <figure className="enemy-figure">
            <Field />
            <figcaption>
              <ul className="enemy-legend" aria-live="polite">
                {stage.legend.map(([kind, text]) => (
                  <li key={kind + text}><i className={`swatch swatch-${kind}`} />{text}</li>
                ))}
              </ul>
            </figcaption>
          </figure>
          <div className={`enemy-stat${stage.stat ? "" : " is-empty"}`} ref={statRef}>
            <strong ref={statValueRef}>0</strong>
            <span>{stage.stat?.label ?? ""}</span>
          </div>
          <p className="enemy-disclaimer">{stage.mode === "count" ? t.disclaimerCount : t.disclaimer}</p>
        </div>

        <ol className="enemy-steps">
          {stages.map((s, i) => (
            <li key={s.key} data-step={i} className={i === active ? "is-active" : ""}>
              <p className="enemy-date">{s.date}</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.note && <p className="fact-note">{s.note}</p>}
              {s.source && <a className="enemy-source" href={s.source.href} target="_blank" rel="noreferrer">{s.source.label} <span aria-hidden="true">↗</span></a>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
