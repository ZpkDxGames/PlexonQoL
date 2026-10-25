import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Command,
  Layers3,
  MoveRight,
} from "lucide-react";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { PANEL_URL, TOOLS } from "@/lib/navigation";

export default function Overview() {
  return (
    <>
      <header className="overview-heading">
        <div>
          <p className="eyebrow">
            <span className="status-dot" /> YOUR NEXT ADVENTURE STARTS HERE
          </p>
          <h1>
            Less looking up.
            <br />
            <span>More building.</span>
          </h1>
          <p>
            Your Minecraft essentials, connected in one thoughtful workspace.
          </p>
        </div>
        <div className="edition-stamp">
          <span>THE PLAYER’S TOOLKIT</span>
          <strong>
            01<span>/</span>05
          </strong>
          <small>EXPLORE · CREATE · OPTIMIZE</small>
        </div>
      </header>
      <div className="workspace-strip">
        <span>
          <span className="status-dot" /> All tools run in your browser
        </span>
        <span>No account needed</span>
        <span>Java 1.21.1 starter data</span>
      </div>
      <div className="overview-grid">
        <Link
          className="feature-card portal-feature"
          href="/nether-calculator/"
          data-tone="violet"
        >
          <div className="card-top">
            <span className="tool-symbol">
              <ToolIcon name="portal" size={23} />
            </span>
            <span className="tag">01 / EXPLORATION</span>
            <ArrowUpRight size={20} />
          </div>
          <div className="portal-art" aria-hidden="true">
            <div className="portal-frame">
              <div className="portal-interior">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="coord-tag coord-over">
              OVERWORLD <b>1,024 / 64 / −512</b>
            </div>
            <div className="coord-tag coord-nether">
              NETHER <b>128 / 64 / −64</b>
            </div>
            <span className="portal-ratio">
              8<span>:</span>1
            </span>
            <div className="ground-grid" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">TAKE THE SHORT WAY HOME</p>
            <h2>
              Two worlds.
              <br />
              One perfect connection.
            </h2>
            <p>
              Convert coordinates, plan portal links,
              <br />
              and keep your favorite waypoints close.
            </p>
            <span className="text-link">
              Open portal calculator <ArrowRight size={17} />
            </span>
          </div>
        </Link>
        <Link
          className="feature-card armor-feature"
          href="/armor-trims/"
          data-tone="amber"
        >
          <div className="card-top">
            <span className="tool-symbol">
              <ToolIcon name="armor" size={22} />
            </span>
            <span className="tag">02 / CUSTOMIZATION</span>
            <ArrowUpRight size={20} />
          </div>
          <div className="armor-art" aria-hidden="true">
            <svg viewBox="0 0 160 180">
              <path
                d="M58 12H102V51H58Z M47 60L23 69V118H45V102L53 99V119H107V99L115 102V118H137V69L113 60Z M54 125H78V167H53Z M84 125H108V167H83Z"
                fill="#27373e"
                stroke="#61767e"
                strokeWidth="2"
              />
              <path
                d="M60 25H100M60 39H100M53 72L80 88L107 72M57 104H103M61 130V158M93 130V158"
                fill="none"
                stroke="#e3bd73"
                strokeWidth="5"
              />
              <path d="M66 80L80 91L94 80L80 103Z" fill="#e3bd73" />
            </svg>
            <div className="swatch-rail">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="feature-copy">
            <p className="eyebrow">YOUR ARMOR. YOUR SIGNATURE.</p>
            <h2>Find your perfect finish.</h2>
            <p>
              18 patterns. 10 materials.
              <br />A style that’s entirely yours.
            </p>
            <span className="text-link">
              Enter the trim studio <ArrowRight size={17} />
            </span>
          </div>
        </Link>
        <div className="quick-tools">
          {TOOLS.slice(3).map((tool, index) => (
            <Link
              className="quick-tool"
              key={tool.href}
              href={tool.href}
              data-tone={tool.tone}
            >
              <span className="tool-symbol">
                <ToolIcon name={tool.icon} size={22} />
              </span>
              <div>
                <span className="eyebrow">
                  0{index + 3} / {tool.short}
                </span>
                <h2>{tool.label}</h2>
                <p>{tool.description}</p>
              </div>
              <ArrowUpRight size={19} />
            </Link>
          ))}
        </div>
        <section className="ecosystem-card">
          <div className="card-top">
            <Layers3 size={22} />
            <span className="tag">CONNECTED ECOSYSTEM</span>
            <ArrowUpRight size={18} />
          </div>
          <h2>
            From player
            <br />
            to operator.
          </h2>
          <p>
            Your server control room is
            <br />
            always one click away.
          </p>
          <a
            className="button"
            href={PANEL_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PlexonPanel <ArrowUpRight size={16} />
          </a>
          <div className="ecosystem-line">
            <span>PLAY</span>
            <MoveRight size={32} />
            <span>MANAGE</span>
          </div>
        </section>
      </div>
      <div className="workspace-tips">
        <span>
          <Command size={15} />
          <b>⌘ / Ctrl K</b> to jump anywhere
        </span>
        <span>
          <Bookmark size={15} /> Your waypoints & pins stay in this browser
        </span>
        <span>
          <ArrowDown size={15} /> Pick a tool. Make something great.
        </span>
      </div>
    </>
  );
}
