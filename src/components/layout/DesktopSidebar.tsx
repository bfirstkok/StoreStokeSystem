"use client";

import Image from "next/image";
import NavItem from "@/components/ui/NavItem";
import { logout } from "@/lib/actions/auth";
import { LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";

export default function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="mb-6 px-2">
          <Image
            src="/logo-BM.svg"
            width={132}
            height={44}
            alt="BM Inventory"
            priority
          />
          <p className="mt-3 text-xs font-medium text-gray-400">
            ระบบจัดการคลังสินค้า
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5" aria-label="เมนูหลัก">
          {MAIN_NAV_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                description={link.description}
                icon={<Icon className="h-5 w-5" />}
              />
            );
          })}
        </nav>

        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex flex-col gap-1.5">
            {FOOTER_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  description={link.description}
                  icon={<Icon className="h-5 w-5" />}
                />
              );
            })}

            <form action={logout}>
              <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-white group-hover:text-red-600">
                  <LogOutIcon className="h-5 w-5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-semibold">ออกจากระบบ</span>
                  <span className="block text-xs text-gray-400 group-hover:text-red-400">
                    จบการใช้งานบัญชีนี้
                  </span>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
