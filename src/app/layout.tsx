import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: {
    default: "PlexonQoL · Minecraft Workspace",
    template: "%s · PlexonQoL",
  },
  description:
    "A browser-based Minecraft workbench for portal coordinates, armor trims, recipes, enchantments, and world math.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
