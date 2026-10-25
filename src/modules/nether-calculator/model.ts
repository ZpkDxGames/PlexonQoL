export type Coordinates = { x: number; y: number; z: number };
export type Dimension = "overworld" | "nether";
export type PortalPair = {
  id: string;
  name: string;
  overworld: Coordinates;
  nether: Coordinates;
};
export const EMPTY_PORTALS: PortalPair[] = [];
export const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export function convertCoordinates(
  position: Coordinates,
  from: Dimension,
): Coordinates {
  const factor = from === "overworld" ? 1 / 8 : 8;
  return normalizeCoordinates(
    {
      x: Math.floor(position.x * factor),
      y: position.y,
      z: Math.floor(position.z * factor),
    },
    from === "overworld" ? "nether" : "overworld",
  );
}
export function normalizeCoordinates(
  position: Coordinates,
  dimension: Dimension,
): Coordinates {
  return {
    x: clamp(Math.floor(position.x), -29999984, 29999984),
    y: clamp(
      Math.floor(position.y),
      dimension === "overworld" ? -64 : 0,
      dimension === "overworld" ? 319 : 127,
    ),
    z: clamp(Math.floor(position.z), -29999984, 29999984),
  };
}
export const distance3D = (a: Coordinates, b: Coordinates) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export const coordinateText = ({ x, y, z }: Coordinates) => `${x} ${y} ${z}`;
export const teleportCommand = (position: Coordinates, dimension: Dimension) =>
  `/execute in minecraft:${dimension === "overworld" ? "overworld" : "the_nether"} run tp @s ${coordinateText(position)}`;

export function obsidianCount(width: number, height: number, corners = false) {
  const w = clamp(Math.floor(width), 2, 21),
    h = clamp(Math.floor(height), 3, 21);
  return 2 * w + 2 * h + (corners ? 4 : 0);
}
export function isPortalList(value: unknown): value is PortalPair[] {
  const isPosition = (p: unknown): p is Coordinates =>
    typeof p === "object" &&
    p !== null &&
    ["x", "y", "z"].every((axis) =>
      Number.isFinite((p as Record<string, unknown>)[axis]),
    );
  return (
    Array.isArray(value) &&
    value.length <= 100 &&
    value.every(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        p.name.length <= 60 &&
        isPosition(p.overworld) &&
        isPosition(p.nether),
    )
  );
}
