"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API can be blocked (no HTTPS, no permission) — the
      // handle is still visible on screen to select manually.
    }
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
        copied ? "bg-gold text-deep-2" : "bg-deep text-paper"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
