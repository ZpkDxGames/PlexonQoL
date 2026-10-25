"use client";

import { useMemo, useState } from "react";
import data from "@/data/enchantments.json";
import { NumberField } from "@/components/ui/NumberField";
import { optimizeEnchantments, type EnchantmentChoice } from "./model";

const DEFAULT_CHOICES: EnchantmentChoice[] = [
  { id: "sharpness", level: 5 },
  { id: "unbreaking", level: 3 },
  { id: "mending", level: 1 },
];
export function EnchantmentOptimizer() {
  const [target, setTarget] = useState("sword"),
    [uses, setUses] = useState(0);
  const [choices, setChoices] = useState<EnchantmentChoice[]>(DEFAULT_CHOICES);
  const result = useMemo(
    () => optimizeEnchantments(target, choices, uses),
    [target, choices, uses],
  );
  const possible = data.enchantments.filter((e) =>
    e.appliesTo.includes(target),
  );
  return (
    <div className="tool-grid">
      <section className="card" data-tone="sky">
        <p className="eyebrow">PLAN THE PERFECT ITEM</p>
        <h2>Choose your books</h2>
        <div className="fields two">
          <label className="field">
            <span>Target item</span>
            <select
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setChoices([]);
              }}
            >
              {data.targets.map((t) => (
                <option key={t} value={t}>
                  {t.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <NumberField
            label="Previous gear anvil uses"
            min={0}
            max={5}
            value={uses}
            onChange={(n) => setUses(Math.min(5, Math.max(0, Math.floor(n))))}
          />
        </div>
        <p className="muted" style={{ marginBottom: 15 }}>
          Select up to eight distinct, fresh enchanted books. Levels are
          selectable; incompatible combinations are rejected.
        </p>
        <div className="enchantment-list">
          {possible.map((e) => {
            const choice = choices.find((c) => c.id === e.id);
            return (
              <div key={e.id} className="enchantment-row">
                <label>
                  <input
                    type="checkbox"
                    checked={!!choice}
                    disabled={!choice && choices.length >= 8}
                    onChange={(event) =>
                      setChoices((p) =>
                        event.target.checked
                          ? [...p, { id: e.id, level: e.maxLevel }]
                          : p.filter((c) => c.id !== e.id),
                      )
                    }
                  />
                  {e.name}
                </label>
                <select
                  aria-label={`${e.name} level`}
                  disabled={!choice}
                  value={choice?.level ?? e.maxLevel}
                  onChange={(event) =>
                    setChoices((p) =>
                      p.map((c) =>
                        c.id === e.id
                          ? { ...c, level: Number(event.target.value) }
                          : c,
                      ),
                    )
                  }
                >
                  {Array.from({ length: e.maxLevel }, (_, i) => (
                    <option value={i + 1} key={i}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </section>
      <section className="card" data-tone="emerald">
        <p className="eyebrow">LOWEST TOTAL LEVEL COST</p>
        <h2>Your combination order</h2>
        {result.error ? (
          <p className="notice danger" role="status">
            {result.error}
          </p>
        ) : (
          result.plan && (
            <>
              <div className="result">
                <span>Total level costs</span>
                <strong className="number">{result.plan.total} levels</strong>
              </div>
              <div className="result">
                <span>Operations</span>
                <strong className="number">{result.plan.steps.length}</strong>
              </div>
              <ol className="merge-steps">
                {result.plan.steps.map((step, i) => (
                  <li key={i}>
                    <span>Left: {step.left}</span>
                    <br />
                    <span>Right: {step.right}</span>
                    <p>
                      <b>{step.levels} levels</b> · includes {step.priorWork}{" "}
                      prior-work penalty
                    </p>
                  </li>
                ))}
              </ol>
              {!choices.length && (
                <p className="empty-state">
                  Choose at least one book to start planning.
                </p>
              )}
            </>
          )
        )}
        <p className="muted" style={{ marginTop: 22 }}>
          Exact minimum for this fresh-book transfer model. The target item
          always stays on the left. Repairs, renaming, existing enchantments,
          and upgrading duplicate books are outside this solver. Each operation
          must stay below 40 levels. Level costs do not equal XP points, which
          depend on your starting level.
        </p>
      </section>
    </div>
  );
}
