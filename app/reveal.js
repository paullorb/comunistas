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

  return (
    <article id={id} ref={ref} className={`chapter ${className}`}>
      {children}
    </article>
  );
}
