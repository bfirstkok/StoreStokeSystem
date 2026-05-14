"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@/lib/actions/auth";
import NavItem from "@/components/ui/NavItem";
import { CloseIcon, LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[19rem] max-w-[86vw] bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <Image
                src="/logo-BM.svg"
                width={116}
                height={40}
                alt="BM Inventory"
                priority
              />
              <p className="mt-2 text-xs font-medium text-gray-400">
                ระบบจัดการคลังสินค้า
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="ปิดเมนู"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-1.5" aria-label="เมนูหลัก">
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
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-red-600">
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
    </>
  );
}
