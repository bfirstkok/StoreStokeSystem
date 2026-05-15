import DashboardStat from "@/components/ui/DashboardStat";
import { PurchaseStats } from "@/lib/types";

export default function PurchaseOverview({ data }: { data: PurchaseStats }) {
  return (
    <div className="h-full w-full rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-950">ภาพรวมคลังวัสดุ</h2>

      <div className="mt-5 grid grid-cols-2 gap-y-5 divide-gray-100 md:grid-cols-4 md:divide-x">
        <DashboardStat
          title="จำนวนคงเหลือ"
          value={data.shipped}
          icon="/quantity.svg"
          color="text-blue-600"
        />
        <DashboardStat
          title="รายการวัสดุ"
          value={data.purchase}
          icon="/purchase.svg"
          color="text-blue-500"
        />
        <DashboardStat
          title="มีสต็อก"
          value={data.cost}
          icon="/quantity.svg"
          color="text-emerald-600"
        />
        <DashboardStat
          title="ใกล้หมด"
          value={data.pending}
          icon="/clock.svg"
          color="text-yellow-600"
        />
      </div>
    </div>
  );
}
