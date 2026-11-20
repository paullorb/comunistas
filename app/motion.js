"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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
    .from(".hero-people .hp", { y: 60, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, 1.5)
    .from(".hero-people .hp-hand", { rotation: 150, transformOrigin: "0% 100%", duration: 0.5, ease: "back.out(1.8)" }, 2.15)
    .from(".hero-art .art-caption, .hero-index", { opacity: 0, duration: 0.8 }, 2.2);
}

// Inertial wheel scrolling on the page's native scroll: sticky keeps working, touch stays native, and
// anchor links and scrollIntoView are left to the browser (Lenis follows them). It runs on GSAP's
// ticker so every scrubbed trigger reads the same scroll position.
function smoothScroll() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(raf); lenis.destroy(); };
}

// Leaving the hero: the copy lifts faster than the scroll and the illustration lags behind it.
function heroExit() {
  if (!window.matchMedia("(min-width: 901px)").matches) return;
  const scrollTrigger = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero-copy", { y: -70, ease: "none", scrollTrigger });
  gsap.to(".hero-art", { y: 60, ease: "none", scrollTrigger });
}

// The red line that draws down the date column of each timeline, and the footer wordmark rising.
function spineAndWordmark() {
  q(".timeline").forEach((el) => {
    gsap.fromTo(el, { "--spine": 0 }, { "--spine": 1, ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 60%", scrub: true } });
  });
  gsap.from(".foot-word > span", { yPercent: 100, ease: "none", scrollTrigger: { trigger: ".site-footer", start: "top 85%", end: "bottom bottom", scrub: 0.4 } });
}

function heroParallax() {
  const art = document.querySelector(".hero-art");
  if (!art) return;
  const layers = [
    [".city-back", 14],
    [".city-front", -22],
    [".warrant", 30],
    [".hero-people", -12],
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

// Section changes — paper → dark → paper → red → paper. An incoming dark or red section unfolds from an
// inset sheet with rounded top corners to full bleed as it rises; an outgoing one folds back into an
// inset sheet with rounded bottom corners, so the paper underneath shows through at the seams.
function sheets() {
  const FULL = "inset(0vh 0vw 0vh 0vw round 0px 0px 0px 0px)";
  const enter = (sel, start = "top 100%", end = "top 30%") => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.fromTo(el, { clipPath: "inset(9vh 5vw 0vh 5vw round 44px 44px 0px 0px)" }, {
      clipPath: FULL, ease: "none",
      scrollTrigger: { trigger: el, start, end, scrub: true },
    });
  };
  const leave = (sel, start = "bottom 100%", end = "bottom 40%") => {
    const el = document.querySelector(sel);
    if (!el) return;
    gsap.fromTo(el, { clipPath: FULL }, {
      clipPath: "inset(0vh 5vw 9vh 5vw round 0px 0px 44px 44px)", ease: "none", immediateRender: false,
      scrollTrigger: { trigger: el, start, end, scrub: true },
    });
  };
  enter(".band");
  leave(".enemy");
  enter(".closing");
  leave(".closing");
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

// One scrubbed micro-animation per chapter scene, keyed on the visual's type class. Targets are the
// "sc-" hooks inside app/scenes.js; animated groups carry no transform attribute of their own.
const $ = (el, sel) => el.querySelector(sel);
const $$ = (el, sel) => [...el.querySelectorAll(sel)];

const SCENES = {
  coup(el, tl, cue) {
    tl.fromTo($(el, ".sc-smoke"), { y: 40, scale: 0.7, opacity: 0.2, transformOrigin: "50% 100%" }, { y: -24, scale: 1.15, opacity: 1 }, 0)
      .fromTo($$(el, ".sc-jet"), { x: -90, y: -30, opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: 0.15 }, 0)
      .fromTo($(el, ".sc-traj"), { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0.2)
      .fromTo($(el, ".sc-building"), { y: 18 }, { y: 0 }, 0)
      .fromTo($$(el, ".sc-soldier"), { x: -50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.25 }, 0.1)
      .fromTo($(el, ".sc-general"), { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }, 0.5);
    cue(0, 0.3); cue(1, 0.58); cue(2, 0.82);
  },
  arrival(el, tl, cue) {
    tl.fromTo($(el, ".sc-plane"), { x: 90, y: -50, opacity: 0.2 }, { x: 0, y: 0, opacity: 1 }, 0)
      .fromTo($(el, ".sc-approach"), { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0.1)
      .fromTo($(el, ".sc-center"), { strokeDashoffset: 60 }, { strokeDashoffset: 0 }, 0)
      .fromTo($(el, ".sc-visitor"), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }, 0.25)
      .fromTo($(el, ".sc-judge"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.4)
      .fromTo($(el, ".sc-request"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.28 }, 0.6)
      .fromTo($(el, ".sc-request-head"), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.86);
    cue(0, 0.3); cue(1, 0.56); cue(2, 0.88);
  },
  arrest(el, tl, cue) {
    tl.fromTo($(el, ".sc-glow"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0)
      .fromTo($(el, ".sc-madrid"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.35 }, 0.1)
      .fromTo($(el, ".sc-lit"), { opacity: 0.25 }, { opacity: 1, duration: 0.2 }, 0.35)
      .fromTo($$(el, ".sc-officer"), { x: -46, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.12, duration: 0.25 }, 0.4)
      .fromTo($(el, ".sc-stamp"), { scale: 3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.14, ease: "power4.in" }, 0.8);
    cue(0, 0.3); cue(1, 0.7); cue(2, 0.92);
  },
  court(el, tl, cue) {
    const vote = $(el, ".sc-vote");
    const state = { a: 0, b: 0 };
    tl.fromTo($$(el, ".sc-lord"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.3 }, 0)
      .fromTo($$(el, ".sc-hand"), { rotation: 150, transformOrigin: "0% 100%" }, { rotation: 0, stagger: 0.06, duration: 0.16, ease: "back.out(1.6)" }, 0.45)
      .to(state, { a: 3, b: 2, duration: 0.3, onUpdate: () => { if (vote) vote.textContent = `${Math.round(state.a)} : ${Math.round(state.b)}`; } }, 0.45)
      .fromTo($(el, ".sc-void"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.1 }, 0.86);
    cue(0, 0.6); cue(1, 0.72); cue(2, 0.93);
  },
  ruling(el, tl, cue) {
    tl.fromTo($(el, ".sc-sheet"), { y: 60, rotation: 8, opacity: 0.2, transformOrigin: "50% 50%" }, { y: 0, rotation: 0, opacity: 1, duration: 0.4 }, 0)
      .fromTo($$(el, ".sc-lord"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.03, duration: 0.15 }, 0.2)
      .fromTo($$(el, ".sc-line"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, stagger: 0.06, duration: 0.2 }, 0.3)
      .fromTo($$(el, ".sc-strike"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, stagger: 0.06, duration: 0.14 }, 0.62)
      .fromTo($(el, ".sc-seal"), { scale: 3, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.12, ease: "power4.in" }, 0.84);
    cue(0, 0.42); cue(1, 0.74); cue(2, 0.92);
  },
  commit(el, tl, cue) {
    tl.fromTo($(el, ".sc-leaf-l"), { scaleX: 1, transformOrigin: "0% 50%" }, { scaleX: 0.12, duration: 0.4 }, 0.05)
      .fromTo($(el, ".sc-leaf-r"), { scaleX: 1, transformOrigin: "100% 50%" }, { scaleX: 0.12, duration: 0.4 }, 0.05)
      .fromTo($(el, ".sc-light"), { opacity: 0 }, { opacity: 0.9, duration: 0.35 }, 0.05)
      .fromTo($(el, ".sc-magistrate"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, 0.2)
      .fromTo($(el, ".sc-arrow"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3 }, 0.52)
      .fromTo($(el, ".sc-arrow-head"), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.8)
      .fromTo($(el, ".sc-minister"), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, 0.6);
    cue(0, 0.46); cue(1, 0.9);
  },
  end(el, tl, cue) {
    tl.fromTo($(el, ".sc-board"), { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0)
      .fromTo($$(el, ".sc-doctor"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.14 }, 0.1)
      .fromTo($(el, ".sc-escort"), { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35 }, 0.32)
      .fromTo($(el, ".sc-climb"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 0.55)
      .fromTo($(el, ".sc-plane2"), { x: -200, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.4 }, 0.55);
    cue(0, 0.28); cue(1, 0.64); cue(2, 0.93);
  },
  return(el, tl, cue) {
    tl.fromTo($(el, ".sc-salute"), { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25 }, 0)
      .fromTo($(el, ".sc-chair"), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.3 }, 0.2)
      .fromTo($(el, ".sc-figure"), { y: 26, scaleY: 0.7, opacity: 0, transformOrigin: "50% 100%" }, { y: 0, scaleY: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 0.55);
    cue(0, 0.26); cue(1, 0.5); cue(2, 0.86);
  },
  immunity(el, tl, cue) {
    tl.fromTo($(el, ".sc-shield"), { opacity: 0.2 }, { opacity: 1, duration: 0.3 }, 0)
      .fromTo($(el, ".sc-crack"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5 }, 0.25)
      .fromTo($$(el, ".sc-person"), { scale: 0, transformOrigin: "50% 100%" }, { scale: 1, stagger: 0.02, duration: 0.14, ease: "back.out(2)" }, 0.3);
    cue(0, 0.62); cue(1, 0.82);
  },
  verdict(el, tl, cue) {
    tl.fromTo($(el, ".sc-beam"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
      .fromTo($(el, ".sc-dock"), { opacity: 0.3 }, { opacity: 1, duration: 0.3 }, 0)
      .fromTo($$(el, ".sc-witness"), { y: 50 }, { y: 0, stagger: 0.05, duration: 0.25 }, 0.15)
      .fromTo($(el, ".sc-open"), { strokeDashoffset: 1 }, { strokeDashoffset: 0.26, duration: 0.6 }, 0.25)
      .fromTo($(el, ".sc-verdict"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.7);
    cue(0, 0.5); cue(1, 0.88);
  },
};

// A cue is one beat of a scene told twice: the red tag appears in the picture and, at the same
// scroll position, the phrase it repeats is underlined in the copy beside it.
function cueSync(el, tl) {
  const chapter = el.closest(".chapter");
  return (i, at) => {
    const tag = el.querySelector(`.tag[data-tag="${i}"] .tag-in`);
    const phrase = chapter?.querySelector(`.cue[data-cue="${i}"]`);
    if (tag) tl.fromTo(tag, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.07, ease: "back.out(2)" }, at);
    if (phrase) tl.fromTo(phrase, { "--on": 0 }, { "--on": 1, duration: 0.07 }, at);
  };
}

function chapterScenes() {
  q(".chapter-visual").forEach((el) => {
    const type = [...el.classList].find((c) => c.startsWith("visual-"))?.slice(7);
    const build = SCENES[type];
    if (!build) return;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el, start: "top 88%", end: "center 45%", scrub: 0.7 },
    });
    build(el, tl, cueSync(el, tl));
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
  q(".chapter-fig > .visual-caption").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 10, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 94%", once: true } });
  });
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
      const offSmooth = smoothScroll();
      heroIntro();
      heroExit();
      scrollProgress();
      sheets();
      contextBand();
      headings();
      chapterScenes();
      dateRails();
      spineAndWordmark();
      const offParallax = heroParallax();
      const offTilt = window.matchMedia("(hover: hover)").matches ? tilt() : undefined;
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => {
        document.documentElement.classList.remove("motion");
        offSmooth();
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
