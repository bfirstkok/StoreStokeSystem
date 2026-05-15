"use client";

import { Product } from "@/lib/types";
import ProductOverviewTab from "@/components/features/product/ProductOverviewTab";
import ProductHistoryTab from "@/components/features/product/ProductHistoryTab";
import { StockStats } from "@/lib/types";

interface TabsProps {
  product: Product;
  stockStats: StockStats | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({
  product,
  stockStats,
  activeTab,
  onTabChange,
}: TabsProps) {
  return (
    <div>
      <div className="flex flex-row items-center justify-between sm:justify-start gap-8 mt-3 border-b border-gray-300">
        {["overview", "history"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`cursor-pointer pb-2 text-sm sm:text-lg tracking-wide capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "overview" && (
          <ProductOverviewTab product={product} stockStats={stockStats} />
        )}
        {activeTab === "history" && <ProductHistoryTab product={product} />}
      </div>
    </div>
  );
}
