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

// The hero has one beat: the headline sets, then the warrant lands and is stamped. Everything else in
// the illustration is already there when it appears.
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero .eyebrow", { opacity: 0, y: 14, duration: 0.5 })
    .from(".hero h1 .ln > span", { yPercent: 110, duration: 0.8, stagger: 0.1 }, "-=0.3")
    .from(".hero .intro, .hero .scroll-link", { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, "-=0.4")
    .from(".hero-art", { opacity: 0, duration: 0.6, ease: "power2.out" }, 0.2)
    .from(".warrant", { y: -200, rotation: -18, opacity: 0, duration: 0.8, ease: "back.out(1.3)" }, 1.1)
    .from(".warrant b", { scale: 2.4, opacity: 0, rotation: 8, duration: 0.3, ease: "power4.in" }, 1.8);
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

// Only the two section openers set word by word. A chapter's heading stays still: its scene is the
// thing that moves there, and two moving things side by side split the reader's eye.
function headings() {
  q(".enemy-head h2, .closing h2").forEach((h) => {
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

// One scrubbed micro-animation per chapter scene, keyed on the visual's type class: the only motion in
// a chapter, so the eye has one place to go. Targets are the "sc-" hooks inside app/scenes.js; animated groups carry no transform attribute of their own.
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
      // It plays while the panel sits mid-screen, where the copy beside it is being read, not while it
      // is still entering at the bottom edge.
      scrollTrigger: { trigger: el, start: "top 72%", end: "center 42%", scrub: 0.7 },
    });
    build(el, tl, cueSync(el, tl));
  });
}

export default function Motion() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      document.documentElement.classList.add("motion");
      const offSmooth = smoothScroll();
      heroIntro();
      scrollProgress();
      contextBand();
      headings();
      chapterScenes();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => {
        document.documentElement.classList.remove("motion");
        offSmooth();
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
