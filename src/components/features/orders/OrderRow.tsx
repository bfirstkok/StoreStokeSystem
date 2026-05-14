"use client";

import { useState, useTransition } from "react";
import { updateOrder, deleteOrder } from "@/lib/actions/orders";
import {
  formatCurrency,
  formatDateForInput,
  getOrderStatus,
} from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { EditIcon, CloseIcon, DeleteIcon, SaveIcon } from "@/components/icons";
import { Order } from "@/lib/types";

interface OrderRowProps {
  order: Order;
  onOrderChange: () => void;
  onViewItems: () => void;
}

const orderStatusLabels: Record<string, string> = {
  Pending: "รอดำเนินการ",
  Shipped: "รับเข้าแล้ว",
  Completed: "เสร็จสมบูรณ์",
};

export default function OrderRow({
  order,
  onOrderChange,
  onViewItems,
}: OrderRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = order.status === "Completed";

  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const [editData, setEditData] = useState({
    status: order.status,
    date: formatDateForInput(order.expected_delivery_date),
  });

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("order_id", String(order.id));
    formData.append("status", editData.status);
    formData.append("expected_delivery_date", editData.date);

    startSaveTransition(async () => {
      const result = await updateOrder(null, formData);
      if (result.success) {
        setIsEditing(false);
        alert("อัปเดตใบสั่งซื้อแล้ว");
        onOrderChange();
      } else {
        alert(result.message);
      }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("ยืนยันลบใบสั่งซื้อนี้หรือไม่? การลบไม่สามารถย้อนกลับได้")) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteOrder(order.id);
      alert(result.message);
      if (result.success) onOrderChange();
    });
  };

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-2 md:px-4 hidden md:table-cell font-medium">
        {order.po_code}
      </td>
      <td className="py-2 px-2 md:px-4">
        {order.supplier?.supplier_name ?? "ไม่มีข้อมูล"}
      </td>
      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {formatCurrency(order.total_cost)}
      </td>
      <td className="py-2 px-2 md:px-4">
        <button
          onClick={onViewItems}
          className="text-xs sm:text-base text-blue-600 hover:underline cursor-pointer"
        >
          {order.items.length} รายการ
        </button>
      </td>

      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {isEditing ? (
          <input
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            className="border rounded-md p-1 w-fit"
            disabled={isSaving || isDeleting}
          />
        ) : order.expected_delivery_date ? (
          new Date(order.expected_delivery_date).toLocaleDateString("th-TH")
        ) : (
          "ไม่มีข้อมูล"
        )}
      </td>

      <td className="py-2 px-2 md:px-4 font-semibold">
        {isEditing ? (
          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            className="border rounded-md p-1 w-fit"
            disabled={isSaving || isDeleting}
          >
            <option value="Pending">รอดำเนินการ</option>
            <option value="Shipped">รับเข้าแล้ว</option>
            <option value="Completed">เสร็จสมบูรณ์</option>
          </select>
        ) : (
          <span className={getOrderStatus(order.status)}>
            {orderStatusLabels[order.status] || order.status}
          </span>
        )}
      </td>

      <td className="py-2 px-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="text-xs p-1"
              title="บันทึก"
            >
              {isSaving ? "..." : <SaveIcon className="w-4 h-4 text-white" />}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(false)}
              disabled={isSaving || isDeleting}
              className="text-xs p-1"
              title="ยกเลิก"
            >
              <CloseIcon className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-xs"
              disabled={isCompleted}
              title={isCompleted ? "รายการที่เสร็จสมบูรณ์แล้วแก้ไขไม่ได้" : "แก้ไข"}
            >
              <EditIcon className="w-4 h-4 text-gray-900" />
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              className="flex items-center gap-1 text-xs text-red-500"
              disabled={isCompleted || isDeleting}
              title={isCompleted ? "รายการที่เสร็จสมบูรณ์แล้วลบไม่ได้" : "ลบ"}
            >
              {isDeleting ? "..." : <DeleteIcon className="w-4 h-4 text-red-500" />}
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
