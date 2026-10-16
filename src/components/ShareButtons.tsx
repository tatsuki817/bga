"use client";

import { useState } from "react";

export function ShareButtons({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={copy} className="rounded-full border border-border px-5 py-2 text-sm font-semibold hover:bg-card">
        {copied ? "コピーしました" : "結果のリンクをコピー"}
      </button>
      <a
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
      >
        X でシェア
      </a>
    </div>
  );
}
