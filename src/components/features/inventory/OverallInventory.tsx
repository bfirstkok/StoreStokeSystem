import StatCard from "@/components/ui/StatCard";
import StatCardDouble from "@/components/ui/StatCardDouble";
import { formatCurrencyShort } from "@/lib/utils/formatters";

interface OverallInventoryProps {
  totalCategories: number;
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  noStockCount: number;
}

export default function OverallInventory({
  totalCategories,
  totalProducts,
  totalInventoryValue,
  lowStockCount,
  noStockCount,
}: OverallInventoryProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h1 className="pb-2 text-lg font-semibold tracking-wide text-gray-900">ภาพรวมคลังสินค้า</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="หมวดหมู่"
          titleColor="text-blue-600"
          value={totalCategories}
          description="หมวดหมู่ทั้งหมด"
        />
        <StatCardDouble
          title="สินค้า"
          titleColor="text-yellow-700"
          valueA={totalProducts}
          descriptionA="สินค้าทั้งหมด"
          valueB={formatCurrencyShort(totalInventoryValue)}
          descriptionB="มูลค่าสต็อก"
        />
        <StatCardDouble
          title="แจ้งเตือนสต็อก"
          titleColor="text-red-500"
          valueA={lowStockCount}
          descriptionA="ใกล้หมด"
          valueB={noStockCount}
          descriptionB="หมดสต็อก"
        />
      </div>
    </div>
  );
}
