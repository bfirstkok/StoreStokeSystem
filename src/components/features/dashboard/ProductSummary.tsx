import DashboardStat from "@/components/ui/DashboardStat";
import { ProductStats } from "@/lib/types";

export default function ProductSummary({ data }: { data: ProductStats }) {
  return (
    <div className="bg-white shadow-md p-6 rounded-xl w-full md:w-1/3">
      <h1 className="text-lg pb-4">สรุปสินค้า</h1>
      <div className="flex flex-row justify-around items-center divide-x divide-gray-100">
        <DashboardStat title="ซัพพลายเออร์" value={data.suppliers} icon="/suppliers.svg" />
        <DashboardStat title="หมวดหมู่" value={data.categories} icon="/categories.svg" />
      </div>
    </div>
  );
}