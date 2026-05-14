"use client";
import CustomerTable from "@/components/features/customers/CustomerTable";
import AddCustomer from "@/components/features/customers/AddCustomer";
import { useState } from "react";

export default function CustomersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-row justify-between items-center gap-3">
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">ลูกค้า</h1>
          <div className="flex flex-row gap-4 tracking-wide">
            <AddCustomer onOrderChange={triggerRefresh} />
          </div>
        </div>
        <div className="pt-2">
          <CustomerTable
            refreshKey={refreshKey}
            onOrderChange={triggerRefresh}
          />
        </div>
      </div>
    </div>
  );
}
