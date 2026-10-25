import { PageHeading } from "@/components/ui/PageHeading";
import { NetherCalculator } from "@/modules/nether-calculator/NetherCalculator";

export const metadata = { title: "Nether Portal Calculator" };
export default function Page() {
  return (
    <>
      <PageHeading kicker="01 / Exploration" title="The short way home.">
        Convert between dimensions, compare a portal candidate, and save the
        coordinates that matter.
      </PageHeading>
      <NetherCalculator />
    </>
  );
}
