import { Suspense } from "react";
import { PageHeading } from "@/components/ui/PageHeading";
import { ArmorTrimStudio } from "@/modules/armor-trims/ArmorTrimStudio";

export const metadata = { title: "Armor Trim Studio" };
export default function Page() {
  return (
    <>
      <PageHeading
        kicker="02 / Customization"
        title="Find your perfect finish."
      >
        Mix all 18 Java 1.21.1 templates and 10 materials across six armor
        bases, plus the turtle helmet. Share your set by URL.
      </PageHeading>
      <Suspense fallback={<p className="muted">Opening the trim studio…</p>}>
        <ArmorTrimStudio />
      </Suspense>
    </>
  );
}
