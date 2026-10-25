# Static data contracts

All catalogs carry `schemaVersion`, `targetVersion`, and `coverage`. The baseline is Java 1.21.1. A future data update must state its edition and version rather than silently mixing game rules. JSON is imported at build time; no tool fetches external data at runtime.

## Armor

`templates[]` contains a unique ID, display name, namespaced template item, and duplication inputs. Each extra template consumes seven diamonds, one source template, and the named base item. A trim application consumes one template and one trim material. A full set using one pattern needs three duplicate crafts when one source template is already owned.

`materials[]` contains a namespaced ingredient and approximate palette color. Same-material trim contrast, leather dyes, and vanilla UV texture fidelity are not reproduced by this scaffold.

`bases[]` declares permitted slots. Turtle shell is permitted only in the helmet slot. Invalid URL IDs and forged slot/base combinations fall back to a known default.

## Recipes

`items[]` is an index of `{ id, name, symbol, color, source }`. IDs must be namespaced and unique. Symbols are temporary schematic UI assets, not extracted game textures.

`recipes[]` contains `{ id, station, ingredients, result }` with optional `durationSeconds` and `experience`. `result` contains `item` and `count`. All ingredient/output IDs must exist in `items[]`.

| Station                           | Ingredient semantics                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `shaped`                          | Nine slots in row-major 3×3 order; `null` means empty. The starter viewer displays one arrangement.     |
| `shapeless`                       | Unordered ingredient list, displayed in a 3×3 grid.                                                     |
| `smelting`, `smoking`, `blasting` | First ingredient is the input; fuel is not encoded as a consumable recipe ingredient.                   |
| `smithing`                        | Template, base item, addition in that order.                                                            |
| `stonecutting`                    | One input item.                                                                                         |
| `brewing`                         | Potion bottle then reagent. Blaze powder fuel is noted separately.                                      |
| `anvil`                           | Reserved station for explicit verified recipes; the optimizer computes book combinations independently. |

`customSources[]` reserves boundaries for PlexonTools, PlexonShops, PlexonQuests, PlexonSpawners, PlexonCrates, and PlexonKeys. Empty lists are intentional. Before populating a source, obtain authoritative plugin configuration/export and record the repository commit or server export version. Do not infer custom item IDs, ingredients, rewards, or costs from plugin names. Extend the browser's typed source adapter and integrity tests when importing these lists.

## Enchantments and solver

Each record declares `maxLevel`, `appliesTo`, explicit pairwise `excludes`, and `itemMultiplier`/`bookMultiplier`. Curses are represented as selectable data, not recommended choices.

The solver accepts one distinct, fresh book per enchantment and tracks every possible resulting prior-work count for each subset. The target gear can only be on the left. A merge costs both prior-work penalties plus the right-hand books' transfer costs. A resulting operation at 40 or more levels is rejected. Prior-work penalty is `2^uses - 1`; the new use count is `max(leftUses, rightUses) + 1`.

Limits: up to eight books; target starts with no enchantments, optional previous anvil work count 0–5; no duplicate-level upgrades, repairs, or renaming. Minimum total levels does not imply minimum XP points from an arbitrary starting player level.

## World math and portals

Block, chunk, and region conversions use mathematical floor division. Avoid signed 32-bit bitwise shifts, which wrap large JavaScript numbers. A negative block at −1 is in chunk −1 with local coordinate 15.

Portal conversion scales X/Z only and floors to block coordinates. Build-block limits are Overworld −64…319 and Nether 0…127, correcting the handoff's inclusive upper boundaries 320/128. Overworld/Nether Y values can be edited independently. Near-roof positions receive a visible warning. Portal radius guidance is a heuristic, not a simulation of portal-block POI selection, terrain, or creation rules.

The standard two-hopper estimate uses 8 game ticks per item per direction at 20 TPS; a full cycle is `items × 0.8` seconds. Piston/circuit delays are excluded.
