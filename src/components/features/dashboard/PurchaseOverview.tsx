import DashboardStat from "@/components/ui/DashboardStat";
import { formatCurrency } from "@/lib/utils/formatters";
import { PurchaseStats } from "@/lib/types";

export default function PurchaseOverview({
  data,
}: {
  data: PurchaseStats;
}) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-2/3">
      <h1 className="text-lg pb-4">ภาพรวมจัดซื้อ</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-200">
        <DashboardStat
          title="ต้นทุน"
          value={formatCurrency(data.cost)}
          icon="/cost.svg"
          color="text-red-600"
        />
        <DashboardStat
          title="ทั้งหมด"
          value={data.purchase}
          icon="/purchase.svg"
          color="text-blue-500"
        />
        <DashboardStat
          title="จัดส่งแล้ว"
          value={data.shipped}
          icon="/truck.svg"
          color="text-blue-600"
        />
        <DashboardStat
          title="รอดำเนินการ"
          value={data.pending}
          icon="/clock.svg"
          color="text-yellow-600"
        />
      </div>
    </div>
  );
}
