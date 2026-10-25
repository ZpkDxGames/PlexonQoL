"use client";

import { useState } from "react";
import { NumberField } from "@/components/ui/NumberField";
import { CopyButton } from "@/components/ui/CopyButton";
import { hopperClockSeconds, storageMath, worldPosition } from "./model";

export function WorldMath() {
  const [x, setX] = useState(-1),
    [z, setZ] = useState(255);
  const [items, setItems] = useState(1728),
    [stackSize, setStackSize] = useState<16 | 64>(64),
    [clockItems, setClockItems] = useState(64);
  const pos = worldPosition(x, z),
    storage = storageMath(items, stackSize);
  return (
    <div className="tool-grid">
      <section className="card" data-tone="rose">
        <p className="eyebrow">BLOCK → CHUNK → REGION</p>
        <h2>Locate any block</h2>
        <div className="fields two">
          <NumberField label="Block X" value={x} onChange={setX} />
          <NumberField label="Block Z" value={z} onChange={setZ} />
        </div>
        <div className="result">
          <span>Chunk</span>
          <strong className="number">
            {pos.chunkX}, {pos.chunkZ}
          </strong>
        </div>
        <div className="result">
          <span>Local block (0–15)</span>
          <strong className="number">
            {pos.localX}, {pos.localZ}
          </strong>
        </div>
        <div className="result">
          <span>Region file</span>
          <code>{pos.regionFile}</code>
        </div>
        <div className="result">
          <span>Chunk bounds</span>
          <span className="number">
            X {pos.minX}…{pos.maxX}
            <br />Z {pos.minZ}…{pos.maxZ}
          </span>
        </div>
        <div className="actions">
          <CopyButton value={pos.regionFile} label="Copy region filename" />
        </div>
      </section>
      <section className="card" data-tone="emerald">
        <p className="eyebrow">INVENTORY MATH</p>
        <h2>Make room for the build</h2>
        <div className="fields two">
          <NumberField
            label="Total items"
            min={0}
            value={items}
            onChange={(n) => setItems(Math.max(0, Math.floor(n)))}
          />
          <label className="field">
            <span>Items per stack</span>
            <select
              value={stackSize}
              onChange={(e) => setStackSize(Number(e.target.value) as 16 | 64)}
            >
              <option value={64}>64 per stack</option>
              <option value={16}>16 per stack</option>
            </select>
          </label>
        </div>
        <div className="result">
          <span>Full stacks + remainder</span>
          <strong className="number">
            {storage.stacks} + {storage.remainder}
          </strong>
        </div>
        <div className="result">
          <span>Shulker boxes needed</span>
          <strong className="number">{storage.shulkers}</strong>
        </div>
        <div className="result">
          <span>Double chests needed</span>
          <strong className="number">{storage.doubleChests}</strong>
        </div>
        <p className="muted" style={{ marginTop: 16 }}>
          Containers round up. A shulker has 27 slots; a double chest has 54.
        </p>
      </section>
      <section className="card wide">
        <p className="eyebrow">REDSTONE WORKBENCH</p>
        <h2>Two-hopper clock estimate</h2>
        <div className="fields two">
          <NumberField
            label="Items circulating (1–320)"
            min={1}
            max={320}
            value={clockItems}
            onChange={(n) =>
              setClockItems(Math.max(1, Math.min(320, Math.floor(n))))
            }
          />
          <div className="result">
            <span>Full back-and-forth cycle</span>
            <strong className="number">
              {hopperClockSeconds(clockItems).toFixed(1)} s
            </strong>
          </div>
        </div>
        <p className="muted">
          8 game ticks per item, two transfers per cycle. Estimate at 20 TPS;
          piston and circuit delays vary by design.
        </p>
      </section>
    </div>
  );
}
