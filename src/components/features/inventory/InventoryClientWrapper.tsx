"use client";

import { useState, useRef, useEffect } from "react";
import AddProduct from "@/components/features/inventory/AddProduct";
import ImportProducts from "@/components/features/inventory/ImportProducts";
import ProductTable from "@/components/features/inventory/ProductTable";
import FilterDropdown, { DropdownOption } from "@/components/ui/FilterDropdown";
import { FilterIcon } from "@/components/icons/FilterIcon";

type SupplierOption = {
  id: string;
  supplier_name: string;
  contact_number: number;
};

const filterOptions: DropdownOption[] = [
  { label: "ทั้งหมด", value: null },
  { label: "มีสินค้า", value: "In-Stock" },
  { label: "หมดสต็อก", value: "Out of Stock" },
  { label: "ใกล้หมด", value: "Low Stock" },
];

export default function InventoryClientWrapper({
  suppliers,
}: {
  suppliers: SupplierOption[];
}) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-wide text-gray-900">สินค้า</h1>
        <div className="flex flex-wrap gap-3 tracking-wide">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาในคลังวัสดุ"
            className="h-10 min-w-[220px] rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <AddProduct suppliers={suppliers} onOrderChange={triggerRefresh} />
          <ImportProducts suppliers={suppliers} onImportComplete={triggerRefresh} />
          <FilterDropdown
            label="ตัวกรอง"
            icon={<FilterIcon className="w-4 h-4 text-gray-600" />}
            options={filterOptions}
            onSelectFilter={setSelectedFilter}
          />
        </div>
      </div>
      <ProductTable
        selectedFilter={selectedFilter}
        searchQuery={searchQuery}
        refreshKey={refreshKey}
      />
    </div>
  );
}
