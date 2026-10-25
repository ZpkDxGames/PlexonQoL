import { PageHeading } from "@/components/ui/PageHeading";
import { EnchantmentOptimizer } from "@/modules/enchantment-optimizer/EnchantmentOptimizer";

export const metadata = { title: "Anvil & XP Optimizer" };
export default function Page() {
  return (
    <>
      <PageHeading kicker="04 / Enchantments" title="Make every level count.">
        Find the lowest total level cost for a compatible set of fresh enchanted
        books, including prior-work penalties.
      </PageHeading>
      <EnchantmentOptimizer />
    </>
  );
}
