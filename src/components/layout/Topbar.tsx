"use client";

import { useEffect, useState } from "react";
import { HamburgerIcon } from "@/components/icons";
import GlobalSearch from "@/components/ui/GlobalSearch";
import UserDropdown from "@/components/features/topbar/UserDropdown";
import NotificationDropdown from "@/components/features/topbar/NotificationDropdown";
import { User } from "@/lib/types";
import { getProfile } from "@/lib/actions/profile";
import { getLowStockNotifications } from "@/lib/actions/notifications";
import { StockAlert } from "@/lib/types";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, notificationData] = await Promise.all([
          getProfile(),
          getLowStockNotifications(),
        ]);

        setUser(userData);
        setAlerts(notificationData);
      } catch (error) {
        console.error("Failed to fetch topbar data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-5 lg:px-6">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-950 md:hidden"
          aria-label="เปิดเมนู"
        >
          <HamburgerIcon className="h-6 w-6" />
        </button>

        <div className="hidden min-w-[180px] md:block">
          <p className="text-xs font-medium text-gray-400">ยินดีต้อนรับ</p>
          <p className="truncate text-sm font-semibold text-gray-800">
            {loading ? "กำลังโหลดข้อมูล..." : user?.name || "ผู้ใช้งาน"}
          </p>
        </div>

        <div className="min-w-0 flex-1">
          <GlobalSearch />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <NotificationDropdown alerts={alerts} />
          )}

          {loading ? (
            <div className="h-10 w-10 rounded-full border border-gray-300 bg-gray-200 animate-pulse" />
          ) : user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          )}
        </div>
      </div>
    </header>
  );
}
