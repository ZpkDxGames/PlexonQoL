"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { TOOLS } from "@/lib/navigation";
import { ToolIcon } from "@/components/ui/ToolIcon";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const element = dialog.current;
    if (open && !element?.open) element?.showModal();
    else if (!open && element?.open) element.close();
  }, [open]);
  const matches = TOOLS.filter((tool) =>
    `${tool.label} ${tool.description}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <dialog
      className="command-dialog"
      ref={dialog}
      aria-labelledby="command-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <form method="dialog" className="command-head">
        <Search size={20} />
        <label className="sr-only" htmlFor="command-search" id="command-title">
          Search tools and recipes
        </label>
        <input
          autoFocus
          id="command-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="What are you building?"
        />
        <button className="icon-button" aria-label="Close search">
          <X size={18} />
        </button>
      </form>
      <div className="command-results">
        {matches.map((tool) => (
          <Link
            href={tool.href}
            key={tool.href}
            onClick={onClose}
            data-tone={tool.tone}
          >
            <ToolIcon name={tool.icon} />
            <span>
              <strong>{tool.label}</strong>
              <small>{tool.short}</small>
            </span>
            <ArrowRight size={16} />
          </Link>
        ))}
        {query.trim() && (
          <Link
            href={`/jei-recipes/?q=${encodeURIComponent(query.trim())}`}
            onClick={onClose}
          >
            <Search size={18} />
            <span>Search recipes for “{query.trim()}”</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
      <div className="command-foot">
        <span>Tab to navigate · Enter to open</span>
        <kbd>Esc to close</kbd>
      </div>
    </dialog>
  );
}
