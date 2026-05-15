import Link from "next/link";
import { getStockMovementHistory } from "@/lib/actions/history";
import { formatDate } from "@/lib/utils/formatters";
import { formatProductCategory } from "@/lib/utils/product-category";

export default async function HistoryPage() {
  const movements = await getStockMovementHistory(150);
  const stockInTotal = movements
    .filter((item) => item.type === "in")
    .reduce((total, item) => total + item.quantity, 0);
  const stockOutTotal = movements
    .filter((item) => item.type === "out")
    .reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mx-3 flex flex-col gap-3 md:mx-0 md:mr-3">
      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-blue-700">ระบบคลังวัสดุ</p>
        <h1 className="mt-1 text-xl font-semibold text-gray-950">
          ประวัติของเข้าออก
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          ตรวจสอบรายการรับเข้า เบิกออก ผู้ทำรายการ และหมายเหตุย้อนหลัง
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-slate-50 p-4">
            <p className="text-xs font-medium text-gray-500">รายการทั้งหมด</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">
              {movements.length}
            </p>
          </div>
          <div className="rounded-lg border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-medium text-green-700">รับเข้ารวม</p>
            <p className="mt-2 text-2xl font-semibold text-green-700">
              +{stockInTotal}
            </p>
          </div>
          <div className="rounded-lg border border-red-100 bg-red-50 p-4">
            <p className="text-xs font-medium text-red-700">เอาออกรวม</p>
            <p className="mt-2 text-2xl font-semibold text-red-700">
              -{stockOutTotal}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-950">
            รายการล่าสุด
          </h2>
        </div>

        {movements.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-gray-500">
            ยังไม่มีประวัติรับเข้า/เอาออก หรือยังไม่ได้สร้างตาราง stock_movements
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">วันที่</th>
                  <th className="px-5 py-3">วัสดุ</th>
                  <th className="px-5 py-3">รายการ</th>
                  <th className="px-5 py-3 text-right">จำนวน</th>
                  <th className="px-5 py-3">ผู้ทำรายการ</th>
                  <th className="px-5 py-3">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {formatDate(item.date, true)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/product/${item.product_id}`}
                        className="font-medium text-gray-950 hover:text-blue-700"
                      >
                        {item.product_name}
                      </Link>
                      <div className="mt-1 text-xs text-gray-400">
                        {formatProductCategory(item.product_category)}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          item.type === "out"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.type === "out" ? "ของออก" : "รับเข้า"}
                      </span>
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-semibold ${
                        item.type === "out" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.type === "out" ? "-" : "+"}
                      {item.quantity}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {item.actor_name}
                      </div>
                      {item.actor_email && (
                        <div className="text-xs text-gray-400">
                          {item.actor_email}
                        </div>
                      )}
                    </td>
                    <td className="max-w-[260px] px-5 py-3 text-gray-600">
                      <span className="line-clamp-2">{item.note || "-"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
