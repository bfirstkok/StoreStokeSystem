"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  description?: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, description }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 ${
        isActive
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-gray-800"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[15px] font-semibold">{label}</span>
        {description && (
          <span className="block truncate text-xs text-gray-400 group-hover:text-gray-500">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
};

export default NavItem;
