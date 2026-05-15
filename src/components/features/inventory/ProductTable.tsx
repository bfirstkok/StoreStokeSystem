"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPaginatedProductsByUser } from "@/lib/actions/products";
import Pagination, { PAGE_SIZE } from "@/components/ui/Pagination";
import { usePagination } from "@/lib/hooks/use-pagination";
import ProductRow from "@/components/features/inventory/ProductRow";
import { Product } from "@/lib/types";

interface ProductTableProps {
  selectedFilter: string | null;
  refreshKey: number;
}

function ProductTableContent({
  selectedFilter,
  refreshKey,
}: ProductTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { currentPage, handlePageChange } = usePagination();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getPaginatedProductsByUser(
          currentPage,
          PAGE_SIZE,
          selectedFilter,
          searchQuery
        );
        if (!isMounted) return;
        setProducts(res.data);
        setTotalPages(Math.max(1, Math.ceil(res.total / PAGE_SIZE)));
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedFilter, refreshKey, searchQuery]);

  return (
    <div className="pt-2 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left">
          <thead className="text-sm sm:text-base">
            <tr>
              <th className="py-2 px-2 md:px-4 hidden md:table-cell">ผู้จำหน่าย</th>
              <th className="py-2 px-2 md:px-4">วัสดุ/อุปกรณ์</th>
              <th className="py-2 px-2 md:px-4 hidden lg:table-cell">หมวดหมู่</th>
              <th className="py-2 px-2 md:px-4">จำนวน</th>
              <th className="py-2 px-2 md:px-4">สถานะ</th>
            </tr>
          </thead>
          <tbody className="text-sm sm:text-base border-t border-gray-300">
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  <td className="hidden py-3 px-2 md:table-cell md:px-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <div className="h-4 w-44 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="hidden py-3 px-2 lg:table-cell md:px-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-100" />
                  </td>
                  <td className="py-3 px-2 md:px-4">
                    <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))}

            {!isLoading && products.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}

            {!isLoading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                  ไม่พบรายการวัสดุ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default function ProductTable(props: ProductTableProps) {
  return (
    <Suspense fallback={null}>
      <ProductTableContent {...props} />
    </Suspense>
  );
}
