import DashboardStat from "@/components/ui/DashboardStat";
import { InventoryStats } from "@/lib/types";

export default function InventorySummary({ data }: { data: InventoryStats }) {
  return (
    <div className="h-full w-full rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-950">สรุปสต็อก</h2>
      <div className="mt-5 grid grid-cols-2 divide-x divide-gray-100">
        <DashboardStat
          title="คงเหลือทั้งหมด"
          value={data.quantityInHand}
          icon="/quantity.svg"
        />
        <DashboardStat
          title="รอรับเข้า"
          value={data.toBeReceived}
          icon="/location.svg"
        />
      </div>
    </div>
  );
}
