"use client";

import {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
  type CSSProperties,
} from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import data from "@/data/recipes.json";
import {
  EMPTY_PINS,
  isPinList,
  ITEM_MAP,
  recipesFor,
  searchItems,
  type Recipe,
} from "./model";
import { useLocalStorage } from "@/lib/useLocalStorage";

const STATIONS: Record<string, string> = {
  shaped: "Crafting table · shaped",
  shapeless: "Crafting · shapeless",
  smelting: "Furnace",
  smoking: "Smoker",
  blasting: "Blast furnace",
  smithing: "Smithing table",
  stonecutting: "Stonecutter",
  brewing: "Brewing stand",
  anvil: "Anvil",
};

function ItemSlot({
  id,
  count = 1,
  onInspect,
}: {
  id: string | null;
  count?: number;
  onInspect: (id: string) => void;
}) {
  const item = id ? ITEM_MAP.get(id) : null;
  return (
    <button
      className="item-slot"
      disabled={!item}
      title={item ? `${item.name} · ${item.id}` : "Empty slot"}
      aria-label={item ? `Inspect ${item.name}` : "Empty slot"}
      onClick={() => id && onInspect(id)}
    >
      <span
        className="item-glyph"
        style={{ "--item-color": item?.color } as CSSProperties}
      >
        {item?.symbol}
      </span>
      {count > 1 && <small>{count}</small>}
    </button>
  );
}
function RecipeView({
  recipe,
  onInspect,
}: {
  recipe: Recipe;
  onInspect: (id: string) => void;
}) {
  const crafting =
    recipe.station === "shaped" || recipe.station === "shapeless";
  const ingredients = crafting
    ? Array.from({ length: 9 }, (_, i) => recipe.ingredients[i] ?? null)
    : recipe.ingredients;
  return (
    <div>
      <p className="eyebrow">{STATIONS[recipe.station]}</p>
      <div className="crafting-row">
        <div
          className={crafting ? "crafting-grid" : "actions"}
          style={crafting ? undefined : { marginTop: 0 }}
          aria-label={`${STATIONS[recipe.station]} ingredients`}
        >
          {ingredients.map((id, i) => (
            <ItemSlot key={i} id={id} onInspect={onInspect} />
          ))}
        </div>
        <ArrowRight size={19} />
        <ItemSlot
          id={recipe.result.item}
          count={recipe.result.count}
          onInspect={onInspect}
        />
      </div>
      <p className="muted">
        {"durationSeconds" in recipe
          ? `${recipe.durationSeconds} seconds · `
          : ""}
        {"experience" in recipe ? `${recipe.experience} furnace XP · ` : ""}
        {recipe.station === "brewing"
          ? "Requires blaze powder fuel. Potion bottle + reagent shown."
          : recipe.station === "shapeless"
            ? "Ingredients can go in any crafting slot."
            : recipe.station === "smithing"
              ? "Template + base item + upgrade material."
              : "Select an ingredient to inspect it."}
      </p>
    </div>
  );
}
export function RecipeBrowser() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);
  const [source, setSource] = useState("vanilla");
  const [selected, setSelected] = useState("minecraft:diamond_pickaxe");
  const [active, setActive] = useState(selected);
  const [mode, setMode] = useState<"recipe" | "uses">("recipe");
  const [page, setPage] = useState(0),
    [recipePage, setRecipePage] = useState(0);
  const [pins, setPins, error] = useLocalStorage(
    "recipe-pins",
    EMPTY_PINS,
    isPinList,
  );
  const matches =
    source === "vanilla" ? searchItems(data.items, deferredQuery) : [];
  const totalPages = Math.max(1, Math.ceil(matches.length / 24));
  const currentPage = Math.min(page, totalPages - 1);
  const recipes = recipesFor(selected, mode);
  const currentRecipe = Math.min(recipePage, Math.max(0, recipes.length - 1));
  const item = ITEM_MAP.get(selected)!;
  function inspect(id: string, nextMode: "recipe" | "uses" = "recipe") {
    setSelected(id);
    setMode(nextMode);
    setRecipePage(0);
  }
  function togglePin(id: string) {
    setPins((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  const keyHandler = useEffectEvent((event: KeyboardEvent) => {
    if (
      (event.target as HTMLElement)?.closest(
        "input,select,textarea,[contenteditable=true]",
      ) ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      document.querySelector("dialog[open]")
    )
      return;
    const key = event.key.toLowerCase();
    if (key === "r" || key === "u") {
      event.preventDefault();
      inspect(active, key === "r" ? "recipe" : "uses");
    }
    if (key === "a") {
      event.preventDefault();
      togglePin(active);
    }
  });
  useEffect(() => {
    const handle = (e: KeyboardEvent) => keyHandler(e);
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  return (
    <>
      <div className="recipe-toolbar">
        <input
          aria-label="Search items"
          value={query}
          placeholder="Search items by name or ID…"
          onChange={(e) => {
            const next = new URLSearchParams(params);
            if (e.target.value) next.set("q", e.target.value);
            else next.delete("q");
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}?${next}`,
            );
            setPage(0);
          }}
        />
        <select
          aria-label="Item source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(0);
          }}
        >
          <option value="vanilla">Vanilla starter catalog</option>
          {data.customSources.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} · awaiting data
            </option>
          ))}
        </select>
      </div>
      <div className="recipe-layout">
        <section className="card recipe-detail" data-tone="emerald">
          <p className="eyebrow">RECIPE INSPECTOR</p>
          <h2>{item.name}</h2>
          <code>{item.id}</code>
          <div className="segmented" style={{ marginTop: 20 }}>
            <button
              aria-pressed={mode === "recipe"}
              onClick={() => inspect(selected, "recipe")}
            >
              Recipes (R)
            </button>
            <button
              aria-pressed={mode === "uses"}
              onClick={() => inspect(selected, "uses")}
            >
              Uses (U)
            </button>
            <button
              aria-pressed={pins.includes(selected)}
              onClick={() => togglePin(selected)}
            >
              <Bookmark size={12} style={{ display: "inline" }} />{" "}
              {pins.includes(selected) ? "Unpin" : "Pin"} (A)
            </button>
          </div>
          {recipes.length ? (
            <>
              <RecipeView recipe={recipes[currentRecipe]} onInspect={inspect} />
              <div className="recipe-foot">
                <button
                  className="icon-button"
                  aria-label="Previous recipe"
                  disabled={currentRecipe === 0}
                  onClick={() => setRecipePage(currentRecipe - 1)}
                >
                  <ChevronLeft size={17} />
                </button>
                <span>
                  Recipe {currentRecipe + 1} of {recipes.length}
                </span>
                <button
                  className="icon-button"
                  aria-label="Next recipe"
                  disabled={currentRecipe + 1 >= recipes.length}
                  onClick={() => setRecipePage(currentRecipe + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </>
          ) : (
            <p className="empty-state">
              No {mode === "recipe" ? "recipe" : "uses"} in this starter
              catalog. This does not mean the item is unobtainable.
            </p>
          )}
          <div
            style={{
              marginTop: 22,
              paddingTop: 15,
              borderTop: "1px solid var(--line)",
            }}
          >
            <h3>Pinned items</h3>
            <div className="pins">
              {pins.map((id) => (
                <button
                  className="button secondary"
                  key={id}
                  onClick={() => inspect(id)}
                >
                  {ITEM_MAP.get(id)?.name}
                </button>
              ))}
            </div>
            {!pins.length && (
              <p className="muted">
                Hover or focus an item and press A to pin it.
              </p>
            )}
            {error && (
              <p role="status" className="notice">
                {error}
              </p>
            )}
          </div>
        </section>
        <section className="card">
          <p className="eyebrow">ITEM INDEX · {matches.length} RESULTS</p>
          <p className="muted" style={{ marginBottom: 17 }}>
            {source === "vanilla"
              ? "R recipes · U uses · A pin. Glyphs are schematic placeholders."
              : `${source} definitions are awaiting a verified server export. No custom recipes are assumed.`}
          </p>
          <div className="item-index">
            {matches
              .slice(currentPage * 24, (currentPage + 1) * 24)
              .map((entry) => (
                <button
                  key={entry.id}
                  title={`${entry.name} · ${entry.id}`}
                  className="item-button"
                  aria-label={entry.name}
                  aria-pressed={selected === entry.id}
                  onMouseEnter={() => setActive(entry.id)}
                  onFocus={() => setActive(entry.id)}
                  onClick={() => {
                    setActive(entry.id);
                    inspect(entry.id);
                  }}
                >
                  <span
                    className="item-glyph"
                    style={{ "--item-color": entry.color } as CSSProperties}
                  >
                    {entry.symbol}
                  </span>
                  <small>{entry.name}</small>
                  {pins.includes(entry.id) && (
                    <span className="pin-dot" aria-label="Pinned">
                      ★
                    </span>
                  )}
                </button>
              ))}
          </div>
          {!matches.length && (
            <p className="empty-state">
              {source === "vanilla"
                ? "No matching items. Try a shorter search."
                : "Custom data has not been imported yet."}
            </p>
          )}
          <div className="recipe-foot">
            <button
              className="button secondary"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              className="button secondary"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
