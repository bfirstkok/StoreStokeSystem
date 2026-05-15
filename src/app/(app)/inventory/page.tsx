import {
  getInventoryOverviewStats,
} from "@/lib/actions/products";
import { getAllSuppliers } from "@/lib/actions/suppliers";
import InventoryClientWrapper from "@/components/features/inventory/InventoryClientWrapper";
import OverallInventory from "@/components/features/inventory/OverallInventory";

export default async function InventoryPage() {
  const [stats, suppliers] = await Promise.all([
    getInventoryOverviewStats(),
    getAllSuppliers(),
  ]);

  if (!stats) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <p className="text-sm font-semibold">ยังไม่ได้ตั้งค่าฐานข้อมูล</p>
        <h1 className="mt-1 text-lg font-semibold">
          ไม่พบตาราง public.products ใน Supabase project นี้
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-800">
          เปิด Supabase Dashboard ไปที่ SQL Editor แล้วรันไฟล์ schema.sql
          จากโปรเจกต์นี้ จากนั้นสร้าง public storage bucket ชื่อ images
          แล้ว refresh หน้านี้อีกครั้ง
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <OverallInventory
        totalCategories={stats.totalCategories}
        totalProducts={stats.totalProducts}
        totalQuantity={stats.totalQuantity}
        lowStockCount={stats.lowStockCount}
        noStockCount={stats.noStockCount}
      />
      <InventoryClientWrapper suppliers={suppliers}/>
    </div>
  );
}
