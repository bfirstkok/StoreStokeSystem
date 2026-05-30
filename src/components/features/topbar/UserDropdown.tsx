"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileIcon } from "@/components/icons";
import { User } from "@/lib/types";
import { logout } from "@/lib/actions/auth";
import type { AccountUser } from "@/lib/actions/account-users";

export default function UserDropdown({
  user,
  activeAccountUser,
}: {
  user: User;
  activeAccountUser: AccountUser | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = activeAccountUser?.name || user.name;

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
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 transition-all hover:ring-4 hover:ring-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
        aria-label="เมนูบัญชีผู้ใช้"
      >
        {user.profile_picture ? (
          <Image
            src={user.profile_picture}
            alt={displayName}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-bold text-gray-500">
            {displayName?.charAt(0).toUpperCase() || <ProfileIcon />}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-72 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b border-gray-100 bg-gray-50/80 p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl font-bold text-gray-500">
                    {displayName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-900">
                  {displayName}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {activeAccountUser?.role || "ผู้ใช้งาน"}
                </p>
                <p className="truncate text-xs text-gray-400" title={user.email}>
                  บัญชีหลัก: {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-2">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              ตั้งค่าบัญชี
            </Link>
            <Link
              href="/select-user"
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              สลับผู้ใช้
            </Link>
            <button
              onClick={() => logout()}
              className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
