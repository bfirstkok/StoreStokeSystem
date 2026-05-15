import DashboardStat from "@/components/ui/DashboardStat";
import { ProductStats } from "@/lib/types";

export default function ProductSummary({ data }: { data: ProductStats }) {
  return (
    <div className="h-full w-full rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-950">สรุปวัสดุ</h2>
      <div className="mt-5 grid grid-cols-2 divide-x divide-gray-100">
        <DashboardStat
          title="รายการวัสดุ"
          value={data.suppliers}
          icon="/suppliers.svg"
        />
        <DashboardStat
          title="หมวดหมู่"
          value={data.categories}
          icon="/categories.svg"
        />
      </div>
    </div>
  );
}
