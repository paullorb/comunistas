"use client";

import { useState } from "react";

// Native share sheet where the browser has one, copy-to-clipboard everywhere else.
export default function ShareButtons({ title, text, labels }) {
  const [status, setStatus] = useState("");
  const url = () => window.location.href.split("#")[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setStatus(labels.copied);
    } catch {
      setStatus(labels.copyFailed);
    }
    setTimeout(() => setStatus(""), 2400);
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text, url: url() }); return; } catch { /* dismissed: fall through */ }
    }
    copy();
  };

  return (
    <div className="share">
      <button type="button" onClick={share}>{labels.share} <span aria-hidden="true">↗</span></button>
      <button type="button" onClick={copy}>{labels.copy}</button>
      <span className="share-status" role="status" aria-live="polite">{status}</span>
    </div>
  );
}
