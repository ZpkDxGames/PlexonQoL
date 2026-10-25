import data from "@/data/armor-trims.json";

export const SLOTS = ["helmet", "chestplate", "leggings", "boots"] as const;
export type ArmorSlot = (typeof SLOTS)[number];
export type ArmorPiece = { base: string; pattern: string; material: string };
export type ArmorSet = Record<ArmorSlot, ArmorPiece>;
const keys = { helmet: "h", chestplate: "c", leggings: "l", boots: "b" };
export const DEFAULT_PIECE: ArmorPiece = {
  base: "netherite",
  pattern: "silence",
  material: "amethyst",
};
export function validPiece(value: ArmorPiece, slot: ArmorSlot) {
  return (
    data.bases.some((b) => b.id === value.base && b.slots.includes(slot)) &&
    data.templates.some((p) => p.id === value.pattern) &&
    data.materials.some((m) => m.id === value.material)
  );
}
export function parseArmorState(query: string): ArmorSet {
  const params = new URLSearchParams(query);
  return Object.fromEntries(
    SLOTS.map((slot) => {
      const [base, pattern, material] = (params.get(keys[slot]) ?? "").split(
        ":",
      );
      const piece = { base, pattern, material };
      return [slot, validPiece(piece, slot) ? piece : { ...DEFAULT_PIECE }];
    }),
  ) as ArmorSet;
}
export function serializeArmorState(state: ArmorSet) {
  return new URLSearchParams(
    SLOTS.map((slot) => [
      keys[slot],
      `${state[slot].base}:${state[slot].pattern}:${state[slot].material}`,
    ]),
  ).toString();
}
export function duplicationCost(state: ArmorSet) {
  // One owned source template for each unique pattern. Craft only the extra copies consumed by this set.
  const counts = new Map<string, number>();
  for (const slot of SLOTS)
    counts.set(state[slot].pattern, (counts.get(state[slot].pattern) ?? 0) + 1);
  return {
    sourceTemplates: counts.size,
    copies: SLOTS.length - counts.size,
    diamonds: (SLOTS.length - counts.size) * 7,
  };
}
