"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string | (() => string);
  label?: string;
}) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        typeof value === "function" ? value() : value,
      );
      setMessage("Copied");
    } catch {
      setMessage("Clipboard unavailable");
    }
  }
  return (
    <button className="button secondary" onClick={copy} aria-label={label}>
      {message === "Copied" ? <Check size={15} /> : <Copy size={15} />}
      <span role="status">{message || label}</span>
    </button>
  );
}
