"use client";

import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/formatters";
import { formatProductCategory } from "@/lib/utils/product-category";
import { Order } from "@/lib/types";

interface OrderItemsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderItemsModal({ order, onClose }: OrderItemsModalProps) {
  if (!order) return null;

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title={`รายการในใบสั่งซื้อ #${order.id}`}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          ปิด
        </Button>
      }
    >
      <ul className="flex flex-col gap-3 max-h-10/12 overflow-y-auto">
        {order.items.map((item, index) => (
          <li key={index} className="border-b pb-3">
            <div className="flex justify-between font-medium">
              <span>{item.product?.product_name ?? "ไม่พบวัสดุ"}</span>
              <span className="text-gray-600">จำนวน: {item.quantity}</span>
            </div>
            <div className="text-sm text-gray-500">
              {formatProductCategory(item.product?.product_category)}
            </div>
            <div className="text-sm text-gray-500">
              ต้นทุน: {formatCurrency(item.cost_per_item)}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
