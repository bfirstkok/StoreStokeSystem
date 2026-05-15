"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adjustProductStock } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { FormState, ProductOption } from "@/lib/types";
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
  const [state, formAction, isPending] = useActionState(
    adjustProductStock,
    initialState
  );

  const selectedProduct = useMemo(
    () => products.find((product) => String(product.id) === selectedProductId),
    [products, selectedProductId]
  );

  const isStockIn = movementType === "in";
  const title = isStockIn ? "ขอเข้าคลัง" : "ของออกคลัง";
  const description = isStockIn
    ? "เพิ่มจำนวนวัสดุเข้าคลังจากรายการที่ได้รับ"
    : "ตัดจำนวนวัสดุออกจากคลังสำหรับการเบิกใช้งาน";

  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;

      if (state.success) {
        formRef.current?.reset();
        setSelectedProductId("");
        router.refresh();
      }
    }
  }, [router, state]);

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
              <option value="">เลือกวัสดุ</option>
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
