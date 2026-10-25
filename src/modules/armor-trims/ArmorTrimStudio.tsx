"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Shuffle } from "lucide-react";
import data from "@/data/armor-trims.json";
import { CopyButton } from "@/components/ui/CopyButton";
import {
  duplicationCost,
  parseArmorState,
  serializeArmorState,
  SLOTS,
  type ArmorPiece,
  type ArmorSet,
  type ArmorSlot,
} from "./model";
import { ArmorPreview } from "./ArmorPreview";

export function ArmorTrimStudio() {
  const params = useSearchParams();
  const state = parseArmorState(params.toString());
  const [slot, setSlot] = useState<ArmorSlot>("helmet");
  const piece = state[slot],
    cost = duplicationCost(state);
  function update(next: ArmorSet) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${serializeArmorState(next)}`,
    );
  }
  function edit(key: keyof ArmorPiece, value: string) {
    update({ ...state, [slot]: { ...piece, [key]: value } });
  }
  function applyAll() {
    update(
      Object.fromEntries(
        SLOTS.map((s) => [
          s,
          {
            ...piece,
            base:
              piece.base === "turtle" && s !== "helmet"
                ? "netherite"
                : piece.base,
          },
        ]),
      ) as ArmorSet,
    );
  }
  return (
    <div className="tool-grid">
      <section className="card armor-preview">
        <p className="eyebrow">YOUR NEXT SIGNATURE SET</p>
        <ArmorPreview state={state} />
        <p className="muted">
          Schematic preview · colors and motifs
          <br />
          Vanilla texture-accurate rendering is a future content milestone.
        </p>
        <div className="actions">
          <CopyButton
            value={() => window.location.href}
            label="Copy share link"
          />
        </div>
      </section>
      <section className="card" data-tone="amber">
        <p className="eyebrow">PIECE BY PIECE</p>
        <h2>Make it yours</h2>
        <div className="segmented" aria-label="Armor slot">
          {SLOTS.map((s) => (
            <button
              key={s}
              aria-pressed={s === slot}
              onClick={() => setSlot(s)}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gap: 17 }}>
          <label className="field">
            <span>Armor base</span>
            <select
              value={piece.base}
              onChange={(e) => edit("base", e.target.value)}
            >
              {data.bases
                .filter((b) => b.slots.includes(slot))
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </label>
          <label className="field">
            <span>Smithing template</span>
            <select
              value={piece.pattern}
              onChange={(e) => edit("pattern", e.target.value)}
            >
              {data.templates.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Trim material</span>
            <select
              value={piece.material}
              onChange={(e) => edit("material", e.target.value)}
            >
              {data.materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="actions">
          <button className="button" onClick={applyAll}>
            Apply to full set
          </button>
          <button
            className="button secondary"
            onClick={() => {
              const choose = <T,>(list: T[]) =>
                list[Math.floor(Math.random() * list.length)];
              update(
                Object.fromEntries(
                  SLOTS.map((s) => [
                    s,
                    {
                      base: choose(
                        data.bases.filter((b) => b.slots.includes(s)),
                      ).id,
                      pattern: choose(data.templates).id,
                      material: choose(data.materials).id,
                    },
                  ]),
                ) as ArmorSet,
              );
            }}
          >
            <Shuffle size={14} /> Randomize
          </button>
        </div>
        <div className="result">
          <span>Current material</span>
          <span>
            <i
              className="swatch"
              style={{
                background: data.materials.find((m) => m.id === piece.material)!
                  .color,
              }}
            />
            {piece.material}
          </span>
        </div>
        <div className="result">
          <span>Template copies needed</span>
          <strong className="number">{cost.copies}</strong>
        </div>
        <div className="result">
          <span>Diamonds for duplication</span>
          <strong className="number">{cost.diamonds}</strong>
        </div>
        <p className="muted" style={{ marginTop: 14 }}>
          Assumes you already own one of each of the {cost.sourceTemplates}{" "}
          selected template type(s). Each copy needs 7 diamonds and 1 base item.
          Applying each trim consumes a template and one trim material.
        </p>
      </section>
      <section className="card wide">
        <h2>Selected set</h2>
        {SLOTS.map((s) => (
          <div key={s} className="result">
            <span>{s}</span>
            <code>
              {state[s].base} : {state[s].pattern} : {state[s].material}
            </code>
          </div>
        ))}
      </section>
    </div>
  );
}
