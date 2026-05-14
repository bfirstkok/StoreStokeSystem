"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-700">ระบบคลังบริษัท</p>
        <h1 className="mt-1 text-xl font-semibold text-gray-950">
          จัดการอุปกรณ์และวัสดุก่อสร้าง
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          ติดตามของคงเหลือ รายการรับเข้า และวัสดุที่ใกล้หมดสำหรับงานก่อสร้าง
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 lg:grid-cols-2">
            <InventorySummary data={data.inventory} />
            <ProductSummary data={data.products} />
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <PurchaseOverview data={data.purchase} />
            <OrderSummaryChart data={data.charts} />
          </div>
        </div>
        <LowStockList products={data.lowStock} />
      </div>
    </div>
  );
}
