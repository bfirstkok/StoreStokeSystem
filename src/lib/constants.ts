import {
  DashboardIcon,
  InventoryIcon,
  SuppliersIcon,
  OrdersIcon,
  SettingsIcon,
} from "@/components/icons";
import React from "react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const LOW_STOCK_THRESHOLD = 10;

export interface NavLink {
  href: string;
  label: string;
  description: string;
  icon: IconComponent;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard",
    label: "แดชบอร์ด",
    description: "ภาพรวมสต็อกและรับเข้า",
    icon: DashboardIcon,
  },
  {
    href: "/inventory",
    label: "คลังวัสดุ",
    description: "อุปกรณ์และวัสดุก่อสร้าง",
    icon: InventoryIcon,
  },
  {
    href: "/orders",
    label: "รับเข้า/จัดซื้อ",
    description: "ใบสั่งซื้อและของเข้า",
    icon: OrdersIcon,
  },
  {
    href: "/suppliers",
    label: "ผู้จำหน่าย",
    description: "ร้านค้าและซัพพลายเออร์",
    icon: SuppliersIcon,
  },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  {
    href: "/settings",
    label: "ตั้งค่า",
    description: "บัญชีและระบบ",
    icon: SettingsIcon,
  },
];

export const PAYMENT_METHODS = [
  { label: "เงินสด", value: "Cash" },
  { label: "โอนเงิน", value: "Transfer" },
  { label: "QRIS", value: "QRIS" },
];

export const PAYMENT_STATUSES = [
  { label: "ชำระแล้ว", value: "Paid" },
  { label: "ค้างชำระ", value: "Debt" },
];

export const ORDER_STATUSES = [
  { label: "รอดำเนินการ", value: "Pending" },
  { label: "รับเข้าแล้ว", value: "Shipped" },
  { label: "เสร็จสมบูรณ์", value: "Completed" },
];

export const PRODUCT_CATEGORIES = [
  { label: "วัสดุก่อสร้าง", value: "construction-materials" },
  { label: "เครื่องมือช่าง", value: "tools" },
  { label: "อุปกรณ์ไฟฟ้า", value: "electrical" },
  { label: "อุปกรณ์ประปา", value: "plumbing" },
  { label: "สีและเคมีภัณฑ์", value: "paint-chemicals" },
  { label: "อุปกรณ์ความปลอดภัย", value: "safety" },
  { label: "วัสดุสิ้นเปลือง", value: "consumables" },
];
