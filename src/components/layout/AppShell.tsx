"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";

export function AppShell({ children }: { children: ReactNode }) {
  const drawer = useRef<HTMLDialogElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const editing = (event.target as HTMLElement)?.closest(
        "input,textarea,select,[contenteditable=true]",
      );
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((previous) => !previous);
      } else if (
        event.key === "/" &&
        !editing &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <Sidebar />
      <div className="main-shell">
        <Topbar
          onMenu={() => drawer.current?.showModal()}
          onSearch={() => setSearchOpen(true)}
        />
        <main id="workspace" className="workspace" tabIndex={-1}>
          {children}
        </main>
        <footer className="workspace-footer">
          <span>Made for the way you play.</span>
          <span>
            PLEXON QOL <b>/</b> COMMUNITY TOOLKIT
          </span>
        </footer>
      </div>
      <dialog
        ref={drawer}
        className="navigation-dialog"
        aria-label="Navigation"
      >
        <Sidebar mobile onNavigate={() => drawer.current?.close()} />
      </dialog>
      <CommandPalette open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
