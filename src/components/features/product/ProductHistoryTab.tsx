"use client";

import { useEffect, useState } from "react";
import { getProductHistory } from "@/lib/actions/history";
import { formatDate } from "@/lib/utils/formatters";
import { Product, HistoryItem } from "@/lib/types";

export default function ProductHistoryTab({ product }: { product: Product }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProductHistory(product.id);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [product.id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse bg-gray-50 rounded-lg">
        กำลังโหลดประวัติ...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
        ยังไม่มีประวัติรับเข้า/เอาออกสำหรับวัสดุนี้
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-lg font-bold text-gray-900">ประวัติสต็อก</h2>
        <p className="text-sm text-gray-500 mt-1">
          ดูว่าใครรับเข้า เอาออก และบันทึกหมายเหตุของ{" "}
          <span className="font-semibold text-gray-900">
            {product.product_name}
          </span>
        </p>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3 font-semibold">วันที่</th>
                <th className="px-6 py-3 font-semibold">รายการ</th>
                <th className="px-6 py-3 font-semibold">ผู้ทำรายการ</th>
                <th className="px-6 py-3 font-semibold">หมายเหตุ</th>
                <th className="px-6 py-3 font-semibold text-right">จำนวน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(item.date, true)}
                  </td>

                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        item.type === "out"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type === "out" ? "ของออก" : "รับเข้า"}
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {item.id}
                    </div>
                  </td>

                  <td className="px-6 py-3 font-medium text-gray-800">
                    {item.actor_name}
                    {item.actor_email && (
                      <div className="text-xs font-normal text-gray-400">
                        {item.actor_email}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-3 text-gray-600">
                    {item.note || "-"}
                  </td>

                  <td
                    className={`px-6 py-3 text-right font-medium ${
                      item.type === "out" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {item.type === "out" ? "-" : "+"}
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
