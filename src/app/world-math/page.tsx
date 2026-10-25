import { PageHeading } from "@/components/ui/PageHeading";
import { WorldMath } from "@/modules/world-math/WorldMath";

export const metadata = { title: "Chunk & Stack Math" };
export default function Page() {
  return (
    <>
      <PageHeading
        kicker="05 / World & storage"
        title="A little math. A better build."
      >
        Find chunks and region files, plan inventory space, and estimate a
        hopper clock cycle.
      </PageHeading>
      <WorldMath />
    </>
  );
}
