"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InventorySummary from "@/components/features/dashboard/InventorySummary";
import PurchaseOverview from "@/components/features/dashboard/PurchaseOverview";
import ProductSummary from "@/components/features/dashboard/ProductSummary";
import LowStockList from "@/components/features/dashboard/LowStockList";
import OrderSummaryChart from "@/components/features/dashboard/OrderSummaryChart";
import { DashboardData } from "@/lib/types";

export default function DashboardClientWrapper({
  data,
}: {
  data: DashboardData;
}) {
  const router = useRouter();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    const channel = supabase
      .channel("warehouse-dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-blue-100 bg-blue-50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">ระบบคลังวัสดุ</p>
            <h1 className="mt-1 text-xl font-semibold text-gray-950">
              คลังวัสดุและของออกคลัง
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
              ติดตามจำนวนคงเหลือ รายการวัสดุ และวัสดุที่ใกล้หมด
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsGuideOpen(true)}
            className="w-fit bg-white text-sm"
          >
            วิธีการใช้
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        title="วิธีการใช้ระบบ"
        footer={
          <Button type="button" onClick={() => setIsGuideOpen(false)}>
            เข้าใจแล้ว
          </Button>
        }
      >
        <div className="space-y-5 text-sm leading-6 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-950">1. เพิ่มวัสดุทีละรายการ</h3>
            <p>
              ไปที่หน้าคลังวัสดุ กดเพิ่มวัสดุ ใส่ชื่อวัสดุ หมวดหมู่ และจำนวนตั้งต้น แล้วกดบันทึก ระบบจะเพิ่มจำนวนเข้าคลังให้ทันที
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950">2. นำเข้าวัสดุจาก Excel</h3>
            <ol className="ml-5 list-decimal space-y-1">
              <li>ไปที่หน้าคลังวัสดุ แล้วกดปุ่มนำเข้า Excel</li>
              <li>ถ้ายังไม่มีไฟล์ตัวอย่าง ให้กดดาวน์โหลด Template ก่อน</li>
              <li>
                กรอกข้อมูลในไฟล์ โดยต้องมีชื่อวัสดุ หมวดหมู่ และจำนวน ส่วนราคาซื้อ ราคาขาย และผู้จำหน่ายจะใส่หรือเว้นว่างก็ได้
              </li>
              <li>กลับมาที่หน้าระบบ กดเลือกไฟล์ แล้วเลือกไฟล์ Excel ที่กรอกไว้</li>
              <li>ตรวจรายการตัวอย่าง ถ้ามีแถวแจ้งเตือนให้แก้ในไฟล์ Excel แล้วเลือกไฟล์ใหม่</li>
              <li>เมื่อข้อมูลถูกต้อง กดนำเข้ารายการ ระบบจะบันทึกวัสดุและเพิ่มจำนวนเข้าคลังทันที</li>
            </ol>
            <p className="mt-2 text-gray-600">
              ถ้าชื่อวัสดุซ้ำกันในไฟล์ ระบบจะรวมจำนวนให้ตอนนำเข้า และรองรับการนำเข้าสูงสุด 1,500 รายการต่อครั้ง
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950">3. เบิกวัสดุออก</h3>
            <p>
              ไปที่หน้าของออกคลัง กรอกจำนวนในแถวของวัสดุที่ต้องการ แล้วกดปุ่มออกคลังสีแดง
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950">4. ตรวจสอบย้อนหลัง</h3>
            <p>
              ดูประวัติการเพิ่มและเบิกออกได้ที่หน้าประวัติ หรือดูกราฟความเคลื่อนไหวจากหน้าแดชบอร์ด
            </p>
          </div>
        </div>
      </Modal>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <div className="grid min-w-0 gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <InventorySummary data={data.inventory} />
            <ProductSummary data={data.products} />
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,1fr)]">
            <PurchaseOverview data={data.purchase} />
            <OrderSummaryChart data={data.charts} />
          </div>
        </div>
        <LowStockList products={data.lowStock} />
      </div>
    </div>
  );
}
