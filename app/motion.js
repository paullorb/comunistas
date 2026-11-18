"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Wrap each word of an element in a span (recursing through inline children) so words can be animated.
function splitWords(el) {
  // Effects can run twice in development (StrictMode); never split twice.
  if (el.dataset.split) return [...el.querySelectorAll(".w > span")];
  el.dataset.split = "1";
  const words = [];
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const wrap = document.createElement("span");
          wrap.className = "w";
          const inner = document.createElement("span");
          inner.textContent = part;
          wrap.append(inner);
          frag.append(wrap);
          words.push(inner);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(el);
  return words;
}

const q = (sel, root = document) => [...root.querySelectorAll(sel)];

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero .eyebrow", { opacity: 0, y: 14, duration: 0.6 })
    .from(".hero h1 .ln > span", { yPercent: 110, duration: 0.9, stagger: 0.12 }, "-=0.35")
    .from(".hero .intro, .hero .scroll-link", { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, "-=0.45")
    .from(".hero-art", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" }, 0.1)
    .from(".city i", { scaleY: 0, transformOrigin: "bottom", duration: 0.8, stagger: 0.05, ease: "power2.out" }, 0.6)
    .from(".hero-art .red-line", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power3.inOut" }, 0.9)
    .from(".warrant", { y: -260, rotation: -22, opacity: 0, duration: 0.9, ease: "back.out(1.4)" }, 1)
    .from(".warrant b", { scale: 2.6, opacity: 0, rotation: 8, duration: 0.35, ease: "power4.in" }, 1.85)
    .to(".warrant", { x: "+=4", y: "+=3", duration: 0.05, repeat: 5, yoyo: true, ease: "none" }, 2.2)
    .from(".hero-art .art-caption, .hero-index", { opacity: 0, duration: 0.8 }, 2.2);
}

function heroParallax() {
  const art = document.querySelector(".hero-art");
  if (!art) return;
  const layers = [
    [".city-back", 14],
    [".city-front", -22],
    [".warrant", 30],
  ].map(([sel, depth]) => {
    const el = art.querySelector(sel);
    return el && { depth, x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }) };
  }).filter(Boolean);
  const onMove = (e) => {
    const r = art.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach((l) => { l.x(nx * l.depth); l.y(ny * l.depth * 0.6); });
  };
  const onLeave = () => layers.forEach((l) => { l.x(0); l.y(0); });
  art.addEventListener("pointermove", onMove);
  art.addEventListener("pointerleave", onLeave);
  return () => { art.removeEventListener("pointermove", onMove); art.removeEventListener("pointerleave", onLeave); };
}

function scrollProgress() {
  gsap.to(".progress-bar", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
  });
  q("[data-rail]").forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: "top 55%",
      end: "bottom 55%",
      toggleClass: { targets: link, className: "is-active" },
    });
  });
}

function contextBand() {
  const statement = document.querySelector(".context-statement");
  if (!statement) return;
  const words = splitWords(statement);
  statement.classList.add("is-split");
  gsap.fromTo(
    words,
    { opacity: 0.16 },
    { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: statement, start: "top 78%", end: "bottom 48%", scrub: 0.4 } },
  );
  gsap.fromTo(".context-statement > span", { "--underline": 0 }, { "--underline": 1, ease: "none", scrollTrigger: { trigger: statement, start: "bottom 70%", end: "bottom 40%", scrub: true } });
}

function headings() {
  q(".chapter-copy h2, .enemy-head h2, .closing h2").forEach((h) => {
    const words = splitWords(h);
    gsap.from(words, {
      yPercent: 105,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
      scrollTrigger: { trigger: h, start: "top 88%", once: true },
    });
  });
}

// One scrubbed micro-animation per chapter scene, keyed on the visual's type class.
const SCENES = {
  coup(el, tl) {
    tl.fromTo(el.querySelector(".smoke"), { y: 30, scale: 0.6, opacity: 0.1 }, { y: -70, scale: 1.9, opacity: 0.65, ease: "none" }, 0)
      .fromTo(el.querySelectorAll(".palace i"), { scaleY: 0.2, transformOrigin: "bottom" }, { scaleY: 1, stagger: 0.08, ease: "none" }, 0);
  },
  arrival(el, tl) {
    tl.fromTo(el.querySelector(".arrival-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "none" }, 0)
      .fromTo(el.querySelector(".plane"), { x: -150, y: 40, rotation: -35, opacity: 0.2 }, { x: 150, y: -50, rotation: -12, opacity: 1, ease: "none" }, 0);
  },
  arrest(el, tl) {
    tl.fromTo(el.querySelector(".paper-stack"), { rotation: -14, x: -40, opacity: 0.4 }, { rotation: -5, x: 0, opacity: 1, ease: "none", duration: 0.6 }, 0)
      .fromTo(el.querySelector(".stamp"), { scale: 3.2, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: -13, ease: "power4.in", duration: 0.25 }, 0.6);
  },
  court(el, tl) {
    const vote = el.querySelector(".vote");
    const state = { a: 0, b: 0 };
    tl.fromTo(el.querySelectorAll(".bench i"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, ease: "none", duration: 0.5 }, 0)
      .to(state, { a: 3, b: 2, ease: "none", duration: 0.5, onUpdate: () => { if (vote) vote.textContent = `${Math.round(state.a)} : ${Math.round(state.b)}`; } }, 0.5);
  },
  ruling(el, tl) {
    tl.fromTo(el.querySelector(".ruling-sheet"), { rotation: 14, y: 60, opacity: 0.2 }, { rotation: 4, y: 0, opacity: 1, ease: "none", duration: 0.5 }, 0)
      .fromTo(el.querySelectorAll(".ruling-sheet i"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, stagger: 0.12, ease: "none", duration: 0.4 }, 0.5)
      .fromTo(el.querySelector(".ruling-sheet strong"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.4 }, 0.3);
  },
  commit(el, tl) {
    tl.fromTo(el.querySelector(".door"), { scaleX: 0.55, transformOrigin: "left center" }, { scaleX: 1, ease: "none", duration: 0.6 }, 0)
      .fromTo(el.querySelector(".arrow"), { x: -90, opacity: 0 }, { x: 0, opacity: 1, ease: "none", duration: 0.5 }, 0.5);
  },
  end(el, tl) {
    tl.fromTo(el.querySelector(".departure"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: "none", duration: 0.5 }, 0)
      .fromTo(el.querySelector(".end-line"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, ease: "none", duration: 0.6 }, 0.4);
  },
  return(el, tl) {
    tl.fromTo(el.querySelector(".sv-plane"), { x: -220, y: -40 }, { x: 0, y: 0, ease: "none", duration: 0.5 }, 0)
      .fromTo(el.querySelector(".sv-figure"), { y: 22, scaleY: 0.72, transformOrigin: "bottom" }, { y: 0, scaleY: 1, ease: "back.out(2)", duration: 0.3 }, 0.6);
  },
  immunity(el, tl) {
    tl.fromTo(el.querySelector(".sv-shield"), { opacity: 0.2, scale: 0.9, transformOrigin: "center" }, { opacity: 1, scale: 1, ease: "none", duration: 0.3 }, 0)
      .fromTo(el.querySelector(".sv-crack"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", duration: 0.5 }, 0.3)
      .fromTo(el.querySelector(".sv-bar-yes"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "none", duration: 0.4 }, 0.6)
      .fromTo(el.querySelector(".sv-bar-no"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, ease: "none", duration: 0.4 }, 0.6);
  },
  verdict(el, tl) {
    tl.fromTo(el.querySelector(".sv-dock"), { opacity: 0.3 }, { opacity: 1, ease: "none", duration: 0.3 }, 0)
      .fromTo(el.querySelector(".sv-open-line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0.28, ease: "none", duration: 0.7 }, 0.2)
      .fromTo(el.querySelector(".sv-verdict"), { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.7);
  },
};

function chapterScenes() {
  q(".chapter-visual").forEach((el) => {
    const type = [...el.classList].find((c) => c.startsWith("visual-"))?.slice(7);
    const build = SCENES[type];
    if (!build) return;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 38%", scrub: 0.7 },
    });
    build(el, tl);
  });
}

// Pointer-driven 3D tilt on the chapter scenes and the warrant.
function tilt() {
  const cleanups = [];
  q(".chapter-visual").forEach((el) => {
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    gsap.set(el, { transformPerspective: 900 });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
  });
  return () => cleanups.forEach((fn) => fn());
}

function dateRails() {
  q(".chapter-date").forEach((el) => {
    gsap.from(el, { opacity: 0, x: -14, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  q(".fact-note, .chapter-detail").forEach((el) => {
    gsap.from(el, { opacity: 0, x: 18, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
}

export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.documentElement.classList.add("motion");
      heroIntro();
      scrollProgress();
      contextBand();
      headings();
      chapterScenes();
      dateRails();
      const offParallax = heroParallax();
      const offTilt = window.matchMedia("(hover: hover)").matches ? tilt() : undefined;
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => {
        document.documentElement.classList.remove("motion");
        offParallax?.();
        offTilt?.();
        window.removeEventListener("load", refresh);
      };
    });
    // Reduced motion keeps the rail and progress highlight, which don't move content.
    mm.add("(prefers-reduced-motion: reduce)", () => {
      q("[data-rail]").forEach((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) ScrollTrigger.create({ trigger: target, start: "top 55%", end: "bottom 55%", toggleClass: { targets: link, className: "is-active" } });
      });
    });
    return () => mm.revert();
  }, []);
  return null;
}
