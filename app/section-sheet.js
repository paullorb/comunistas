"use client";

import { useEffect, useRef, useState } from "react";

// Compact section menu for screens where the side rail is hidden: a button in the sticky bar
// opening a full-width sheet of links. Escape or a link closes it and focus returns to the button.
export default function SectionSheet({ label, closeLabel, title, items }) {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") { setOpen(false); button.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sheet">
      <button ref={button} type="button" className="sheet-btn" aria-expanded={open} aria-controls="section-sheet" onClick={() => setOpen((v) => !v)}>
        <span className="sheet-bars" aria-hidden="true" />
        <span>{open ? closeLabel : label}</span>
      </button>
      {/* data-lenis-prevent: let the wheel scroll this overflowing panel natively instead of the page behind it. */}
      <nav id="section-sheet" ref={panel} className={`sheet-panel${open ? " is-open" : ""}`} aria-label={title} data-lenis-prevent>
        <ul>
          {items.map((item) => (
            <li key={item.href}><a href={item.href} onClick={() => setOpen(false)}>{item.label}<span aria-hidden="true">→</span></a></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
