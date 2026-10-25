export function worldPosition(x: number, z: number) {
  const bx = Math.floor(x),
    bz = Math.floor(z);
  const chunkX = Math.floor(bx / 16),
    chunkZ = Math.floor(bz / 16);
  const regionX = Math.floor(chunkX / 32),
    regionZ = Math.floor(chunkZ / 32);
  return {
    chunkX,
    chunkZ,
    regionX,
    regionZ,
    localX: ((bx % 16) + 16) % 16,
    localZ: ((bz % 16) + 16) % 16,
    regionFile: `r.${regionX}.${regionZ}.mca`,
    minX: chunkX * 16,
    maxX: chunkX * 16 + 15,
    minZ: chunkZ * 16,
    maxZ: chunkZ * 16 + 15,
  };
}
export function storageMath(items: number, stackSize: 16 | 64) {
  const count = Math.max(0, Math.floor(items));
  return {
    stacks: Math.floor(count / stackSize),
    remainder: count % stackSize,
    shulkers: Math.ceil(count / (stackSize * 27)),
    doubleChests: Math.ceil(count / (stackSize * 54)),
  };
}
export const hopperClockSeconds = (items: number) =>
  Math.max(1, Math.min(320, Math.floor(items))) * 0.8;
