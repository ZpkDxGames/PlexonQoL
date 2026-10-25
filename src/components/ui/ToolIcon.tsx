import {
  Compass,
  Grid2X2,
  Hammer,
  LayoutDashboard,
  Shield,
  Waypoints,
} from "lucide-react";

const icons = {
  overview: LayoutDashboard,
  portal: Waypoints,
  armor: Shield,
  recipes: Grid2X2,
  anvil: Hammer,
  world: Compass,
};

export function ToolIcon({
  name,
  size = 20,
}: {
  name: keyof typeof icons;
  size?: number;
}) {
  const Icon = icons[name];
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
