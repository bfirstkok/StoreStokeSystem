"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adjustProductStock } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { FormState, ProductOption } from "@/lib/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { formatProductCategory } from "@/lib/utils/product-category";

const initialState: FormState = { success: false, message: "" };

type StockMovementClientProps = {
  products: ProductOption[];
  movementType: "in" | "out";
};

export default function StockMovementClient({
  products,
  movementType,
}: StockMovementClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const processedStateRef = useRef(initialState);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [stockOutSearchInput, setStockOutSearchInput] = useState("");
  const [stockOutSearchQuery, setStockOutSearchQuery] = useState("");
  const [stockOutCategoryFilter, setStockOutCategoryFilter] = useState("all");
  const [stockOutStockFilter, setStockOutStockFilter] = useState("all");
  const [state, formAction, isPending] = useActionState(
    adjustProductStock,
    initialState
  );

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === selectedProductId),
    [products, selectedProductId]
  );

  const isStockIn = movementType === "in";
  const title = isStockIn ? "เพิ่มเข้าคลัง" : "ของออกคลัง";
  const description = isStockIn
    ? "เพิ่มจำนวนวัสดุเข้าคลังจากรายการที่ได้รับ"
    : "ตัดจำนวนวัสดุออกจากคลังสำหรับการเบิกใช้งาน";

  const stockOutCategoryOptions = useMemo(() => {
    const categories = new Map<string, string>();

    products.forEach((product) => {
      if (!product.product_category) {
        return;
      }

      categories.set(
        product.product_category,
        formatProductCategory(product.product_category)
      );
    });

    return Array.from(categories.entries()).sort(([, labelA], [, labelB]) =>
      labelA.localeCompare(labelB)
    );
  }, [products]);

  const filteredStockOutProducts = useMemo(() => {
    const query = stockOutSearchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const category = formatProductCategory(product.product_category);
      const stock = Number(product.amount_stock || 0);
      const matchesSearch =
        !query ||
        `${product.product_name} ${category}`.toLowerCase().includes(query);
      const matchesCategory =
        stockOutCategoryFilter === "all" ||
        product.product_category === stockOutCategoryFilter;
      const matchesStock =
        stockOutStockFilter === "all" ||
        (stockOutStockFilter === "available" && stock >= LOW_STOCK_THRESHOLD) ||
        (stockOutStockFilter === "low" &&
          stock > 0 &&
          stock < LOW_STOCK_THRESHOLD) ||
        (stockOutStockFilter === "out" && stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [
    products,
    stockOutCategoryFilter,
    stockOutSearchQuery,
    stockOutStockFilter,
  ]);

  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;

      if (state.success) {
        formRef.current?.reset();
        document
          .querySelectorAll<HTMLFormElement>("[data-stock-out-form]")
          .forEach((form) => form.reset());
        setSelectedProductId("");
        router.refresh();
      }
    }
  }, [router, state]);

  if (!isStockIn) {
    return (
      <div className="mx-3 flex flex-col gap-3 md:mx-0 md:mr-3">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-medium text-blue-700">
              ระบบคลังวัสดุ
            </p>
            <h1 className="mt-1 text-xl font-semibold text-gray-950">
              ของออกคลัง
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              เลือกรายการวัสดุแล้วกดออกคลังจากแถวนั้นได้ทันที
            </p>
          </div>

          {products.length === 0 ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
              ยังไม่มีวัสดุให้เบิกออก ให้เพิ่มวัสดุจากหน้าคลังวัสดุก่อน
            </p>
          ) : (
            <>
            <form
              className="mb-4 grid gap-2 lg:grid-cols-[minmax(220px,1fr)_220px_180px_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                setStockOutSearchQuery(stockOutSearchInput);
              }}
            >
              <input
                type="search"
                value={stockOutSearchInput}
                onChange={(event) => {
                  const value = event.target.value;
                  setStockOutSearchInput(value);

                  if (!value.trim()) {
                    setStockOutSearchQuery("");
                  }
                }}
                className="h-10 min-w-0 flex-1 rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="ค้นหาสินค้าออก"
              />
              <select
                value={stockOutCategoryFilter}
                onChange={(event) =>
                  setStockOutCategoryFilter(event.target.value)
                }
                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                aria-label="กรองหมวดหมู่"
              >
                <option value="all">ทุกหมวดหมู่</option>
                {stockOutCategoryOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={stockOutStockFilter}
                onChange={(event) => setStockOutStockFilter(event.target.value)}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                aria-label="กรองสถานะสต็อก"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="available">พร้อมเบิก</option>
                <option value="low">ใกล้หมด</option>
                <option value="out">หมดสต็อก</option>
              </select>
              <button
                type="submit"
                className="h-10 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                ค้นหา
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 font-medium">วัสดุ</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">
                      หมวดหมู่
                    </th>
                    <th className="px-3 py-2 font-medium">คงเหลือ</th>
                    <th className="px-3 py-2 font-medium">จำนวนออก</th>
                    <th className="hidden px-3 py-2 font-medium lg:table-cell">
                      หมายเหตุ
                    </th>
                    <th className="px-3 py-2 text-right font-medium">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockOutProducts.map((product) => {
                    const stock = Number(product.amount_stock || 0);
                    const isOutOfStock = stock <= 0;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-3 py-3">
                          <p className="font-medium text-gray-950">
                            {product.product_name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 md:hidden">
                            {formatProductCategory(product.product_category)}
                          </p>
                        </td>
                        <td className="hidden px-3 py-3 text-gray-700 md:table-cell">
                          {formatProductCategory(product.product_category)}
                        </td>
                        <td className="px-3 py-3 font-semibold text-gray-950">
                          {stock}
                        </td>
                        <td className="px-3 py-3">
                          <form
                            id={`stock-out-form-${product.id}`}
                            data-stock-out-form
                            action={formAction}
                            className="contents"
                          >
                            <input type="hidden" name="movement_type" value="out" />
                            <input
                              type="hidden"
                              name="product_id"
                              value={product.id}
                            />
                            <input
                              name="quantity"
                              type="number"
                              min="1"
                              max={stock}
                              step="1"
                              required
                              disabled={isOutOfStock || isPending}
                              className="h-10 w-24 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                              placeholder="0"
                            />
                          </form>
                        </td>
                        <td className="hidden px-3 py-3 lg:table-cell">
                          <input
                            form={`stock-out-form-${product.id}`}
                            name="note"
                            type="text"
                            disabled={isOutOfStock || isPending}
                            className="h-10 w-full max-w-md rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                            placeholder="เช่น เบิกไปไซต์งาน A"
                          />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="submit"
                            form={`stock-out-form-${product.id}`}
                            disabled={isOutOfStock || isPending}
                            className="h-10 rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                          >
                            {isPending ? "กำลังบันทึก..." : "ออกคลัง"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStockOutProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        ไม่พบรายการวัสดุที่ค้นหา
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="mx-3 flex flex-col gap-3 md:mx-0 md:mr-3">
      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-medium text-blue-700">
            ระบบคลังวัสดุ
          </p>
          <h1 className="mt-1 text-xl font-semibold text-gray-950">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>

        <form ref={formRef} action={formAction} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_minmax(220px,0.8fr)_auto] lg:items-end">
          <input type="hidden" name="movement_type" value={movementType} />

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            วัสดุ
            <select
              name="product_id"
              required
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
              className="h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                {products.length > 0 ? "เลือกวัสดุ" : "ไม่พบวัสดุในคลัง"}
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name} ({formatProductCategory(product.product_category)})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            จำนวน
            <input
              name="quantity"
              type="number"
              min="1"
              step="1"
              required
              className="h-11 rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="0"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-gray-700">
            หมายเหตุ
            <input
              name="note"
              type="text"
              className="h-11 rounded-md border border-gray-300 px-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder={isStockIn ? "เช่น รับจากโกดังใหญ่" : "เช่น เบิกไปไซต์งาน A"}
            />
          </label>

          <Button type="submit" disabled={isPending} className="h-11">
            {isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </form>
        {products.length === 0 ? (
          <p className="mt-3 text-sm text-amber-700">
            ยังไม่มีวัสดุให้เบิกออก ให้เพิ่มวัสดุจากหน้าคลังวัสดุก่อน
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          สต็อกปัจจุบัน
        </h2>
        {selectedProduct ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">วัสดุ</p>
              <p className="mt-1 font-medium text-gray-900">
                {selectedProduct.product_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">หมวดหมู่</p>
              <p className="mt-1 font-medium text-gray-900">
                {formatProductCategory(selectedProduct.product_category)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">คงเหลือ</p>
              <p className="mt-1 text-2xl font-semibold text-gray-950">
                {selectedProduct.amount_stock}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            เลือกวัสดุเพื่อดูจำนวนคงเหลือก่อนทำรายการ
          </p>
        )}
      </section>
    </div>
  );
}
