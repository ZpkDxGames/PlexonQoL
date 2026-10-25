export const PANEL_URL = "https://plexon-panel-dashboard.vercel.app/";

export const TOOLS = [
  {
    href: "/",
    label: "Overview",
    short: "Your workspace",
    icon: "overview",
    tone: "cyan",
    description: "All your Minecraft essentials, in one place.",
  },
  {
    href: "/nether-calculator/",
    label: "Nether Portal Calc",
    short: "Travel smarter",
    icon: "portal",
    tone: "violet",
    description: "Link dimensions. Map coordinates. Save the way home.",
  },
  {
    href: "/armor-trims/",
    label: "Armor Trim Studio",
    short: "Make it yours",
    icon: "armor",
    tone: "amber",
    description: "Explore materials and patterns, piece by piece.",
  },
  {
    href: "/jei-recipes/",
    label: "JEI Recipe Browser",
    short: "Find your next craft",
    icon: "recipes",
    tone: "emerald",
    description: "Search items, follow ingredients, and pin essentials.",
  },
  {
    href: "/enchantment-optimizer/",
    label: "Anvil & XP Optimizer",
    short: "Every level counts",
    icon: "anvil",
    tone: "sky",
    description: "Plan a lower-cost combination order for your gear.",
  },
  {
    href: "/world-math/",
    label: "Chunk & Stack Math",
    short: "Build with precision",
    icon: "world",
    tone: "rose",
    description: "Blocks to chunks, items to stacks, and everything between.",
  },
] as const;

export function routeFor(path: string) {
  const normalized = path === "/" ? path : `${path.replace(/\/$/, "")}/`;
  return TOOLS.find((tool) => tool.href === normalized) ?? TOOLS[0];
}
