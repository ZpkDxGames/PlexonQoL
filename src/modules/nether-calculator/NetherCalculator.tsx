"use client";

import { useState } from "react";
import { BookmarkPlus, Trash2 } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { NumberField } from "@/components/ui/NumberField";
import { useLocalStorage } from "@/lib/useLocalStorage";
import {
  clamp,
  convertCoordinates,
  coordinateText,
  distance3D,
  EMPTY_PORTALS,
  isPortalList,
  normalizeCoordinates,
  obsidianCount,
  teleportCommand,
  type Coordinates,
  type Dimension,
} from "./model";

export function NetherCalculator() {
  const [source, setSource] = useState<Dimension>("overworld");
  const [position, setPosition] = useState<Coordinates>({
    x: 1024,
    y: 64,
    z: -512,
  });
  const [comparison, setComparison] = useState<Coordinates>({
    x: 128,
    y: 64,
    z: -64,
  });
  const [name, setName] = useState("");
  const [width, setWidth] = useState(2),
    [height, setHeight] = useState(3),
    [corners, setCorners] = useState(false);
  const [portals, setPortals, error] = useLocalStorage(
    "portals",
    EMPTY_PORTALS,
    isPortalList,
  );
  const destination = source === "overworld" ? "nether" : "overworld";
  const converted = convertCoordinates(position, source);
  const overworld = source === "overworld" ? position : converted;
  const nether = source === "nether" ? position : converted;
  const radius = destination === "nether" ? 16 : 128;
  const distance = distance3D(converted, comparison);
  const horizontalDistance = Math.hypot(
    converted.x - comparison.x,
    converted.z - comparison.z,
  );
  function edit(dimension: Dimension, axis: keyof Coordinates, value: number) {
    const previous = dimension === source ? position : converted;
    setSource(dimension);
    setPosition(
      normalizeCoordinates({ ...previous, [axis]: value }, dimension),
    );
  }
  return (
    <div className="tool-grid">
      {(["overworld", "nether"] as const).map((dimension) => {
        const p = dimension === "overworld" ? overworld : nether;
        return (
          <section
            className="card"
            data-tone={dimension === "overworld" ? "emerald" : "violet"}
            key={dimension}
          >
            <p className="eyebrow">
              {dimension === source
                ? "EDITING DIMENSION"
                : "CONVERTED COORDINATES"}
            </p>
            <h2>{dimension === "overworld" ? "Overworld" : "The Nether"}</h2>
            <div className="fields">
              {(["x", "y", "z"] as const).map((axis) => (
                <NumberField
                  key={axis}
                  label={`${dimension} ${axis.toUpperCase()}`}
                  value={p[axis]}
                  onChange={(value) => edit(dimension, axis, value)}
                />
              ))}
            </div>
            <p className="muted">
              X and Z scale {dimension === "nether" ? "÷ 8" : "× 8"}. Y stays
              independent and within build limits.
            </p>
            <div className="actions">
              <CopyButton value={coordinateText(p)} label="Copy coordinates" />
              <CopyButton
                value={teleportCommand(p, dimension)}
                label="Copy /tp"
              />
            </div>
            {dimension === "nether" && p.y >= 120 && (
              <p className="notice">
                Near the Nether roof. Pick a safe position below bedrock.
              </p>
            )}
          </section>
        );
      })}
      {position.y !== converted.y && (
        <p className="notice wide">
          Y was clamped for the destination. Valid build blocks: Overworld
          −64…319; Nether 0…127.
        </p>
      )}
      <section className="card" data-tone="violet">
        <p className="eyebrow">DESTINATION CHECK</p>
        <h2>Compare a nearby portal</h2>
        <p className="muted">
          Candidate coordinates in the {destination}. This is a planning aid;
          actual selection also depends on portal blocks and terrain.
        </p>
        <div className="fields">
          {(["x", "y", "z"] as const).map((axis) => (
            <NumberField
              key={axis}
              label={`Candidate ${axis.toUpperCase()}`}
              value={comparison[axis]}
              onChange={(n) => setComparison((p) => ({ ...p, [axis]: n }))}
            />
          ))}
        </div>
        <div className="result">
          <span>3D distance from target</span>
          <strong className="number">{distance.toFixed(2)} blocks</strong>
        </div>
        <p
          className={`notice ${horizontalDistance <= radius ? "danger" : "success"}`}
        >
          {horizontalDistance <= radius
            ? "Nearby candidate: inspect for competing portal links."
            : "Outside this planning radius."}{" "}
          Destination radius: {radius} blocks horizontally.
        </p>
        <svg
          className="portal-map"
          viewBox="0 0 360 190"
          role="img"
          aria-label={`Top-down planning radius of ${radius} blocks; candidate ${horizontalDistance.toFixed(1)} blocks away`}
        >
          <path d="M0 95H360M180 0V190" stroke="#ffffff13" />
          <circle
            cx="180"
            cy="95"
            r="66"
            fill="#a78bfa0b"
            stroke="#a78bfa55"
            strokeDasharray="4 4"
          />
          <circle cx="180" cy="95" r="5" fill="#b9a0ef" />
          <circle
            cx={
              180 +
              clamp(((comparison.x - converted.x) / radius) * 66, -160, 160)
            }
            cy={
              95 + clamp(((comparison.z - converted.z) / radius) * 66, -75, 75)
            }
            r="5"
            fill="#e6c386"
          />
          <text x="10" y="22">
            X → / Z ↓
          </text>
          <text x="10" y="178">
            purple: target · amber: candidate (edge-clamped)
          </text>
        </svg>
      </section>
      <section className="card">
        <p className="eyebrow">WAYPOINTS</p>
        <h2>Keep a way home</h2>
        <label className="field">
          <span>Portal name</span>
          <input
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Main base ↔ Nether hub"
          />
        </label>
        <div className="actions">
          <button
            className="button"
            disabled={portals.length >= 100}
            onClick={() => {
              setPortals((p) => [
                ...p,
                {
                  id: crypto.randomUUID(),
                  name: name.trim() || `Portal ${p.length + 1}`,
                  overworld,
                  nether,
                },
              ]);
              setName("");
            }}
          >
            <BookmarkPlus size={15} /> Save portal pair
          </button>
        </div>
        {error && (
          <p className="notice" role="status">
            {error}
          </p>
        )}
        <ul className="waypoint-list">
          {portals.map((portal) => (
            <li key={portal.id}>
              <span>
                <strong>{portal.name}</strong>
                <code>
                  OW {coordinateText(portal.overworld)}
                  <br />N {coordinateText(portal.nether)}
                </code>
              </span>
              <button
                className="icon-button"
                aria-label={`Remove ${portal.name}`}
                onClick={() =>
                  setPortals((p) => p.filter((x) => x.id !== portal.id))
                }
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
        {!portals.length && (
          <p className="empty-state">Saved pairs will appear here.</p>
        )}
      </section>
      <section className="card wide">
        <h2>Obsidian frame planner</h2>
        <div className="fields">
          <NumberField
            label="Interior width"
            min={2}
            max={21}
            value={width}
            onChange={(n) => setWidth(clamp(n, 2, 21))}
          />
          <NumberField
            label="Interior height"
            min={3}
            max={21}
            value={height}
            onChange={(n) => setHeight(clamp(n, 3, 21))}
          />
          <div className="field">
            <span>Frame corners</span>
            <label>
              <input
                type="checkbox"
                checked={corners}
                onChange={(e) => setCorners(e.target.checked)}
              />{" "}
              Include all four
            </label>
          </div>
        </div>
        <div className="result">
          <span>Obsidian required</span>
          <strong className="number">
            {obsidianCount(width, height, corners)} blocks
          </strong>
        </div>
      </section>
    </div>
  );
}
