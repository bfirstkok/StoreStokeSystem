"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NotificationIcon } from "@/components/icons";
import { StockAlert } from "@/lib/types";

export default function NotificationDropdown({
  alerts,
}: {
  alerts: StockAlert[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifCount = alerts.length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-4 focus:ring-blue-50"
        aria-label="แจ้งเตือนสินค้าใกล้หมด"
      >
        <NotificationIcon />
        {notifCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-semibold text-white">
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-1.5rem)] origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/80 p-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">แจ้งเตือน</h3>
              <p className="mt-0.5 text-xs text-gray-500">รายการที่ควรตรวจสอบ</p>
            </div>
            {notifCount > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                ใกล้หมด {notifCount}
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                ยังไม่มีแจ้งเตือน
                <br />
                สต็อกโดยรวมยังอยู่ในระดับปกติ
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {alerts.map((item) => (
                  <li key={item.id} className="transition-colors hover:bg-blue-50">
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-3 p-3"
                    >
                      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {item.product_name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-red-500">
                          เหลือในสต็อก {item.amount_stock} ชิ้น
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifCount > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/80 p-2">
              <Link
                href="/inventory"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg py-2 text-center text-xs font-semibold text-blue-600 hover:bg-white"
              >
                ไปที่คลังสินค้า
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
