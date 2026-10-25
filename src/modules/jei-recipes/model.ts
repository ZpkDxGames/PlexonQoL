import data from "@/data/recipes.json";

export type RecipeItem = (typeof data.items)[number];
export type Recipe = (typeof data.recipes)[number];
export const ITEM_MAP = new Map(data.items.map((item) => [item.id, item]));
export const EMPTY_PINS: string[] = [];
export function isPinList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= 500 &&
    value.every((id) => typeof id === "string" && ITEM_MAP.has(id))
  );
}

function fuzzyScore(text: string, query: string) {
  const value = text.toLowerCase(),
    needle = query.toLowerCase().trim();
  if (!needle) return 1;
  if (value.includes(needle)) return 100 - value.indexOf(needle) / 100;
  let at = 0;
  for (const char of value) {
    if (char === needle[at]) at++;
    if (at === needle.length) return 1;
  }
  return 0;
}
export function searchItems(items: RecipeItem[], query: string) {
  return items
    .map((item) => ({
      item,
      score: fuzzyScore(`${item.name} ${item.id}`, query),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
export function recipesFor(id: string, mode: "recipe" | "uses") {
  return data.recipes.filter((recipe) =>
    mode === "recipe"
      ? recipe.result.item === id
      : recipe.ingredients.includes(id),
  );
}
