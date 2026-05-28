import {
  DashboardIcon,
  InventoryIcon,
  OrdersIcon,
  ReportsIcon,
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
    description: "ภาพรวมคลังวัสดุ",
    icon: DashboardIcon,
  },
  {
    href: "/inventory",
    label: "คลังวัสดุ",
    description: "รายการวัสดุและสต็อกคงเหลือ",
    icon: InventoryIcon,
  },
  {
    href: "/stock-out",
    label: "ของออกคลัง",
    description: "ตัดจำนวนวัสดุออกจากคลัง",
    icon: OrdersIcon,
  },
  {
    href: "/history",
    label: "ประวัติ",
    description: "รายการรับเข้าและเอาออก",
    icon: ReportsIcon,
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
  { label: "ไม่ระบุ", value: "None" },
  { label: "เงินสด", value: "Cash" },
  { label: "โอนเงิน", value: "Transfer" },
];

export const PAYMENT_STATUSES = [
  { label: "บันทึกแล้ว", value: "Paid" },
  { label: "รอดำเนินการ", value: "Debt" },
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
  { label: "สุขาภิบาล", value: "sanitary" },
  { label: "สีและเคมีภัณฑ์", value: "paint-chemicals" },
  { label: "ปรับอากาศ", value: "air-conditioning" },
  { label: "อุปกรณ์ความปลอดภัย", value: "safety" },
  { label: "อุปกรณ์ทำความสะอาด", value: "cleaning-supplies" },
  { label: "อุปกรณ์ยกของ/ขนย้าย", value: "lifting-moving" },
  { label: "วัสดุสิ้นเปลือง", value: "consumables" },
];
