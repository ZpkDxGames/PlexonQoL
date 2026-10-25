import data from "@/data/enchantments.json";

export type EnchantmentChoice = { id: string; level: number };
export type MergeStep = {
  left: string;
  right: string;
  result: string;
  levels: number;
  priorWork: number;
};
type Plan = { label: string; uses: number; total: number; steps: MergeStep[] };
export const ENCHANTMENTS = new Map(data.enchantments.map((e) => [e.id, e]));
export const priorWorkPenalty = (uses: number) => 2 ** uses - 1;

export function validateChoices(
  target: string,
  choices: EnchantmentChoice[],
): string | null {
  if (!data.targets.includes(target)) return "Choose a supported item.";
  if (choices.length > 8) return "Select at most 8 books for the exact solver.";
  if (new Set(choices.map((c) => c.id)).size !== choices.length)
    return "Use one book per enchantment; duplicate-book upgrades are not modeled.";
  for (const choice of choices) {
    const entry = ENCHANTMENTS.get(choice.id);
    if (!entry || !entry.appliesTo.includes(target))
      return "An enchantment is incompatible with this item.";
    if (
      !Number.isInteger(choice.level) ||
      choice.level < 1 ||
      choice.level > entry.maxLevel
    )
      return "Enchantment level is outside its vanilla range.";
    if (
      choices.some(
        (other) => other.id !== choice.id && entry.excludes.includes(other.id),
      )
    )
      return `${entry.name} conflicts with another selected enchantment.`;
  }
  return null;
}

// Dynamic programming over every directed subset partition. Preserve the best plan
// for EACH resulting prior-work count; collapsing these states can lose the optimum.
// Bit 0 represents the gear and is only allowed in the left anvil slot.
export function optimizeEnchantments(
  target: string,
  choices: EnchantmentChoice[],
  gearUses = 0,
) {
  const error = validateChoices(target, choices);
  if (error) return { error, plan: null };
  if (!Number.isInteger(gearUses) || gearUses < 0 || gearUses > 5)
    return { error: "Prior anvil uses must be between 0 and 5.", plan: null };
  const count = choices.length + 1,
    size = 1 << count;
  const dp: Map<number, Plan>[] = Array.from({ length: size }, () => new Map());
  const weights = new Array<number>(size).fill(0);
  dp[1].set(gearUses, {
    label: target.replaceAll("_", " "),
    uses: gearUses,
    total: 0,
    steps: [],
  });
  choices.forEach((choice, i) => {
    const enchantment = ENCHANTMENTS.get(choice.id)!;
    dp[1 << (i + 1)].set(0, {
      label: `${enchantment.name} ${choice.level}`,
      uses: 0,
      total: 0,
      steps: [],
    });
  });
  for (let mask = 1; mask < size; mask++) {
    for (let i = 0; i < choices.length; i++)
      if (mask & (1 << (i + 1)))
        weights[mask] +=
          ENCHANTMENTS.get(choices[i].id)!.bookMultiplier * choices[i].level;
    if ((mask & (mask - 1)) === 0) continue;
    for (let left = (mask - 1) & mask; left; left = (left - 1) & mask) {
      const right = mask ^ left;
      if (!right || right & 1) continue;
      for (const a of dp[left].values())
        for (const b of dp[right].values()) {
          const penalty = priorWorkPenalty(a.uses) + priorWorkPenalty(b.uses);
          const levels = penalty + weights[right];
          if (levels >= 40) continue;
          const uses = Math.max(a.uses, b.uses) + 1,
            total = a.total + b.total + levels;
          if (total >= (dp[mask].get(uses)?.total ?? Infinity)) continue;
          const label = `(${a.label} + ${b.label})`;
          dp[mask].set(uses, {
            label,
            uses,
            total,
            steps: [
              ...a.steps,
              ...b.steps,
              {
                left: a.label,
                right: b.label,
                result: label,
                levels,
                priorWork: penalty,
              },
            ],
          });
        }
    }
  }
  const best = [...dp[size - 1].values()].sort(
    (a, b) => a.total - b.total || a.uses - b.uses,
  )[0];
  return best
    ? { error: null, plan: best }
    : {
        error:
          "No valid order keeps every operation below 40 levels with these prior-work penalties.",
        plan: null,
      };
}
