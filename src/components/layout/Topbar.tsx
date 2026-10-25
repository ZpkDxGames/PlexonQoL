"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MapPin, Menu, Search } from "lucide-react";
import { PANEL_URL, routeFor } from "@/lib/navigation";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocalStorage } from "@/lib/useLocalStorage";

const isScratchpad = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 200;

export function Topbar({
  onMenu,
  onSearch,
}: {
  onMenu: () => void;
  onSearch: () => void;
}) {
  const route = routeFor(usePathname());
  const [scratchOpen, setScratchOpen] = useState(false);
  const [scratch, setScratch, error] = useLocalStorage(
    "scratchpad",
    "",
    isScratchpad,
  );
  return (
    <header className="topbar">
      <div className="topbar-location">
        <button
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu size={20} />
        </button>
        <span className="topbar-breadcrumb">
          Workspace <span>/</span>
        </span>
        <strong>{route.label}</strong>
      </div>
      <div className="topbar-actions">
        <button
          className="search-trigger"
          onClick={onSearch}
          aria-label="Search tools and recipes"
        >
          <Search size={16} />
          <span>Search anything...</span>
          <kbd>⌘ / Ctrl K</kbd>
        </button>
        <details
          className="scratchpad"
          open={scratchOpen}
          onToggle={(event) => setScratchOpen(event.currentTarget.open)}
        >
          <summary aria-label="Coordinate scratchpad">
            <MapPin size={18} />
          </summary>
          <div className="scratchpad-content">
            <label className="field">
              <span>Coordinate scratchpad</span>
              <input
                value={scratch}
                placeholder="Base · 128, 64, -256"
                maxLength={200}
                onChange={(event) => setScratch(event.target.value)}
              />
            </label>
            <CopyButton value={scratch} label="Copy coordinates" />
            {error && <p role="status">{error}</p>}
            <small>Saved in this browser.</small>
          </div>
        </details>
        <a
          className="button panel-shortcut"
          href={PANEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open PlexonPanel Dashboard"
        >
          <span>
            Open PlexonPanel <span className="desktop-word">Dashboard</span>
          </span>
          <ArrowUpRight size={16} />
        </a>
      </div>
    </header>
  );
}
