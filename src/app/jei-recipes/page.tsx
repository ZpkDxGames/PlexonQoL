import { Suspense } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { RecipeBrowser } from "@/modules/jei-recipes/RecipeBrowser";

export const metadata = { title: "JEI Recipe Browser" };
export default function Page() {
  return (
    <>
      <PageHeading
        kicker="03 / Crafting & discovery"
        title="Your next craft, one click away."
      >
        A searchable Java 1.21.1 starter catalog. Explore crafting, smelting,
        smithing, stonecutting, and brewing. Custom plugin data can be added
        independently.
      </PageHeading>
      <Suspense fallback={<p className="muted">Opening the item index…</p>}>
        <RecipeBrowser />
      </Suspense>
    </>
  );
}
