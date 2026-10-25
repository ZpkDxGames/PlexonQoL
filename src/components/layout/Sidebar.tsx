"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Box, Layers3, X } from "lucide-react";
import { PANEL_URL, routeFor, TOOLS } from "@/lib/navigation";
import { ToolIcon } from "@/components/ui/ToolIcon";

export function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const active = routeFor(usePathname());
  return (
    <aside
      className={`sidebar ${mobile ? "sidebar-mobile" : "sidebar-desktop"}`}
      aria-label="Workspace sidebar"
    >
      <div className="brand-row">
        <Link className="brand" href="/" onClick={onNavigate}>
          <span className="brand-mark">
            <Layers3 size={24} />
          </span>
          <span>
            plexon<span className="brand-suffix">qol</span>
            <small>MINECRAFT WORKSPACE</small>
          </span>
        </Link>
        {mobile && (
          <button
            className="icon-button"
            onClick={onNavigate}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="workspace-label">
        <span className="status-dot" /> Personal workspace{" "}
        <span className="tag">01</span>
      </div>
      <p className="nav-caption">WORKBENCH</p>
      <nav aria-label="Tool navigation">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            onClick={onNavigate}
            className="nav-link"
            data-tone={tool.tone}
            aria-current={active.href === tool.href ? "page" : undefined}
          >
            <ToolIcon name={tool.icon} />
            <span>{tool.label}</span>
            {active.href === tool.href && <i className="active-dot" />}
          </Link>
        ))}
      </nav>
      <div className="sidebar-note">
        <Box size={18} />
        <div>
          <strong>Built for your next build.</strong>
          <p>Five tools. One open workspace.</p>
        </div>
      </div>
      <div className="sidebar-footer">
        <p className="nav-caption">PLEXON ECOSYSTEM</p>
        <a
          className="operator-card"
          href={PANEL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="operator-icon">
            <Layers3 size={21} />
          </span>
          <span>
            <strong>PlexonPanel</strong>
            <small>Open server dashboard</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
        <div className="sidebar-meta">
          <span>
            PlexonQoL <b>0.1</b>
          </span>
          <span>Local by design</span>
        </div>
      </div>
    </aside>
  );
}
