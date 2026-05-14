"use client";

import { useState } from "react";
import AddSale from "./AddSale";
import SaleTable from "./SaleTable";
import FilterDropdown, { DropdownOption } from "@/components/ui/FilterDropdown";
import { FilterIcon } from "@/components/icons";
import { ProductOption, CustomerOption } from "@/lib/types";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "@/lib/constants";

const statusOptions: DropdownOption[] = [
  { label: "ทุกสถานะ", value: null },
  ...PAYMENT_STATUSES,
];

const methodOptions: DropdownOption[] = [
  { label: "ทุกวิธีชำระเงิน", value: null },
  ...PAYMENT_METHODS,
];

export default function SaleClientWrapper({
  products,
  customers,
}: {
  products: ProductOption[];
  customers: CustomerOption[];
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [methodFilter, setMethodFilter] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-lg font-semibold tracking-wide text-gray-900">รายการขาย</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <AddSale
            products={products}
            customers={customers}
            onSaleChange={triggerRefresh}
          />
          <FilterDropdown
            label="สถานะ"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={statusOptions}
            onSelectFilter={setStatusFilter}
          />
          <FilterDropdown
            label="วิธีชำระเงิน"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={methodOptions}
            onSelectFilter={setMethodFilter}
          />
        </div>
      </div>
      <SaleTable
        refreshKey={refreshKey}
        statusFilter={statusFilter}
        methodFilter={methodFilter}
        onOrderChange={triggerRefresh}
      />
    </div>
  );
}
