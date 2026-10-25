import type { ReactNode } from "react";

export function PageHeading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}
