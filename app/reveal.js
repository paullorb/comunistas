"use client";

import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", id }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) return;

    // Chapters are visible by default; the hidden state exists only once the observer is running.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold: 0.16 },
    );

    node.classList.add("reveal-pending");
    observer.observe(node);
    return () => { observer.disconnect(); node.classList.remove("reveal-pending"); };
  }, []);

  // A marked phrase in the copy and the red tag of the same number in the panel answer each other:
  // pointing at (or tapping) either one lights both.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const light = (event, on) => {
      const hit = event.target.closest?.("[data-cue],[data-tag]");
      if (!hit || !node.contains(hit)) return;
      const i = hit.dataset.cue ?? hit.dataset.tag;
      node.querySelectorAll(`[data-cue="${i}"],[data-tag="${i}"]`).forEach((el) => el.classList.toggle("is-hot", on));
    };
    const over = (event) => light(event, true);
    const out = (event) => light(event, false);
    node.addEventListener("pointerover", over);
    node.addEventListener("pointerout", out);
    return () => { node.removeEventListener("pointerover", over); node.removeEventListener("pointerout", out); };
  }, []);

  return (
    <article id={id} ref={ref} className={`chapter ${className}`}>
      {children}
    </article>
  );
}
