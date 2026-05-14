"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LowStockProduct } from "@/lib/types";

export default function LowStockList({
  products,
}: {
  products: LowStockProduct[];
}) {
  const [showModal, setShowModal] = useState(false);
  const widgetProducts = products.slice(0, 5);

  return (
    <>
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-row items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">วัสดุใกล้หมด</h1>
            <p className="text-xs text-gray-500">รายการที่ควรเติมสต็อก</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
          >
            ดูทั้งหมด
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {widgetProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group flex flex-row items-center justify-between rounded-lg p-2 transition hover:bg-gray-50"
            >
              <div className="flex min-w-0 flex-row items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {product.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    คงเหลือ: <span className="font-medium text-gray-800">{product.remainingStock}</span>
                  </p>
                </div>
              </div>
              {product.remainingStock === 0 ? (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                  หมด
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                  ใกล้หมด
                </span>
              )}
            </Link>
          ))}

          {widgetProducts.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              สต็อกยังอยู่ในระดับปกติ
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="วัสดุใกล้หมด"
        footer={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            ปิด
          </Button>
        }
      >
        <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="group flex flex-row items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
            >
              <div className="flex min-w-0 flex-row items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                  <Image
                    src={product.image || "/product.svg"}
                    fill
                    className="object-cover"
                    alt={product.name}
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    สต็อก: <span className="font-bold text-red-600">{product.remainingStock}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                {product.remainingStock === 0 ? (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                    หมดสต็อก
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">
                    ใกล้หมด
                  </span>
                )}
              </div>
            </Link>
          ))}

          {products.length === 0 && (
            <p className="py-8 text-center text-gray-500">
              ไม่มีวัสดุที่ใกล้หมดในตอนนี้
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
