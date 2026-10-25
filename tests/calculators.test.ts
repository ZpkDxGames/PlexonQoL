import assert from "node:assert/strict";
import test from "node:test";
import {
  convertCoordinates,
  distance3D,
  obsidianCount,
  isPortalList,
  teleportCommand,
} from "../src/modules/nether-calculator/model";
import {
  worldPosition,
  storageMath,
  hopperClockSeconds,
} from "../src/modules/world-math/model";
import {
  duplicationCost,
  parseArmorState,
  serializeArmorState,
} from "../src/modules/armor-trims/model";
import {
  optimizeEnchantments,
  priorWorkPenalty,
  validateChoices,
} from "../src/modules/enchantment-optimizer/model";
import { recipesFor, searchItems } from "../src/modules/jei-recipes/model";
import armor from "../src/data/armor-trims.json";
import recipeData from "../src/data/recipes.json";
import enchantmentData from "../src/data/enchantments.json";

test("portal conversion floors negative blocks and clamps destination height without scaling Y", () => {
  assert.deepEqual(convertCoordinates({ x: -1, y: 64, z: -9 }, "overworld"), {
    x: -1,
    y: 64,
    z: -2,
  });
  assert.deepEqual(convertCoordinates({ x: 128, y: 64, z: -64 }, "nether"), {
    x: 1024,
    y: 64,
    z: -512,
  });
  assert.equal(convertCoordinates({ x: 0, y: -64, z: 0 }, "overworld").y, 0);
  assert.equal(convertCoordinates({ x: 0, y: 319, z: 0 }, "overworld").y, 127);
  assert.equal(distance3D({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 12 }), 13);
  assert.match(
    teleportCommand({ x: 1, y: 64, z: 2 }, "nether"),
    /minecraft:the_nether run tp @s 1 64 2/,
  );
});

test("portal frame limits and corrupt storage are handled", () => {
  assert.equal(obsidianCount(2, 3), 10);
  assert.equal(obsidianCount(2, 3, true), 14);
  assert.equal(obsidianCount(100, 100), 84);
  assert.equal(
    isPortalList([
      { id: "1", name: "bad", overworld: { x: NaN, y: 0, z: 0 }, nether: {} },
    ]),
    false,
  );
  assert.equal(isPortalList({}), false);
});

test("negative block/chunk/region boundaries use floor division", () => {
  const negative = worldPosition(-1, -513);
  assert.equal(negative.chunkX, -1);
  assert.equal(negative.chunkZ, -33);
  assert.equal(negative.localX, 15);
  assert.equal(negative.localZ, 15);
  assert.equal(negative.regionFile, "r.-1.-2.mca");
  const zero = worldPosition(0, 511);
  assert.equal(zero.regionFile, "r.0.0.mca");
  assert.equal(zero.maxZ, 511);
  assert.equal(worldPosition(512, 0).regionFile, "r.1.0.mca");
});

test("storage sizes respect 16-item stacks and container rounding", () => {
  assert.deepEqual(storageMath(1728, 64), {
    stacks: 27,
    remainder: 0,
    shulkers: 1,
    doubleChests: 1,
  });
  assert.deepEqual(storageMath(1729, 64), {
    stacks: 27,
    remainder: 1,
    shulkers: 2,
    doubleChests: 1,
  });
  assert.equal(storageMath(433, 16).shulkers, 2);
  assert.equal(storageMath(0, 64).doubleChests, 0);
  assert.equal(hopperClockSeconds(64), 51.2);
});

test("armor links round-trip per-slot state and reject forged combinations", () => {
  const original = parseArmorState(
    "h=turtle:flow:quartz&c=iron:bolt:copper&l=golden:eye:iron&b=diamond:ward:gold",
  );
  assert.deepEqual(parseArmorState(serializeArmorState(original)), original);
  assert.equal(
    parseArmorState("c=turtle:flow:quartz").chestplate.base,
    "netherite",
  );
  assert.equal(parseArmorState("h=evil:fake:red").helmet.pattern, "silence");
  assert.deepEqual(duplicationCost(parseArmorState("")), {
    sourceTemplates: 1,
    copies: 3,
    diamonds: 21,
  });
  assert.equal(duplicationCost(original).diamonds, 0);
});

test("anvil solver accounts for left/right transfer cost, prior work, and level-40 ceiling", () => {
  const single = optimizeEnchantments("sword", [{ id: "sharpness", level: 5 }]);
  assert.equal(single.plan?.total, 5);
  const combined = optimizeEnchantments("sword", [
    { id: "sharpness", level: 5 },
    { id: "unbreaking", level: 3 },
    { id: "mending", level: 1 },
  ]);
  // Gear + Sharpness costs 5; Unbreaking + Mending costs 2;
  // the final merge costs 5 in transfers + 1 + 1 prior work = 7.
  assert.equal(combined.plan?.total, 14);
  assert.equal(combined.plan?.steps.length, 3);
  assert.equal(
    combined.plan?.steps.every((step) => step.levels < 40),
    true,
  );
  assert.equal(priorWorkPenalty(5), 31);
  assert.equal(
    optimizeEnchantments("sword", [{ id: "sharpness", level: 5 }], 5).plan
      ?.total,
    36,
  );
  assert.equal(
    optimizeEnchantments("boots", [{ id: "soul_speed", level: 3 }], 5).plan,
    null,
  );
  assert.ok(
    validateChoices("bow", [
      { id: "infinity", level: 1 },
      { id: "mending", level: 1 },
    ]),
  );
  assert.ok(validateChoices("sword", [{ id: "sharpness", level: 6 }]));
  assert.ok(validateChoices("sword", [{ id: "efficiency", level: 5 }]));
});

test("starter data is internally consistent and custom recipes are never invented", () => {
  assert.equal(armor.templates.length, 18);
  assert.equal(armor.materials.length, 10);
  assert.equal(armor.bases.filter((b) => b.slots.length === 4).length, 6);
  assert.equal(enchantmentData.enchantments.length, 42);
  const ids = new Set(recipeData.items.map((i) => i.id));
  assert.equal(ids.size, recipeData.items.length);
  const recipeIds = new Set(recipeData.recipes.map((r) => r.id));
  assert.equal(recipeIds.size, recipeData.recipes.length);
  for (const recipe of recipeData.recipes) {
    assert.ok(ids.has(recipe.result.item));
    for (const input of recipe.ingredients)
      if (input) assert.ok(ids.has(input));
    if (recipe.station === "shaped") assert.equal(recipe.ingredients.length, 9);
  }
  assert.equal(
    recipeData.customSources.every(
      (s) => s.recipes.length === 0 && s.items.length === 0,
    ),
    true,
  );
  assert.ok(recipesFor("minecraft:diamond", "uses").length >= 2);
  assert.equal(
    searchItems(recipeData.items, "dmndpkx")[0].id,
    "minecraft:diamond_pickaxe",
  );
});
