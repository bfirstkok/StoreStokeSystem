"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { insertOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import LabeledInput from "@/components/ui/LabeledInput";
import LabeledSelect from "@/components/ui/LabeledSelect";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { formatDisplayPhoneNumber } from "@/lib/utils/formatters";
import {
  FormState,
  SupplierOption,
  ProductOption,
  OrderItem,
  OrderItemState,
} from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatProductCategory } from "@/lib/utils/product-category";

const initialState: FormState = { success: false, message: "" };
const initialItemState: OrderItemState = {
  product_id: "",
  product_name: "",
  product_type: "",
  quantity: "1",
  cost_per_item: "0",
};

interface AddOrderProps {
  products: ProductOption[];
  suppliers: SupplierOption[];
  onOrderChange: () => void;
}

export default function AddOrder({ products, suppliers, onOrderChange }: AddOrderProps) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(insertOrder, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState<OrderItemState>(initialItemState);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const processedStateRef = useRef(initialState);
  const [itemFormKey, setItemFormKey] = useState(0);

  const supplierOptions = suppliers.map((s) => ({
    id: s.id,
    main_text: s.supplier_name,
    secondary_text: String(formatDisplayPhoneNumber(s.contact_number)),
  }));

  const productOptions = useMemo(() => {
    if (!selectedSupplierId) return [];
    return products
      .filter((p) => String(p.supplier_id) === String(selectedSupplierId))
      .map((p) => ({
        id: p.id,
        main_text: p.product_name,
        secondary_text: formatProductCategory(p.product_category),
      }));
  }, [products, selectedSupplierId]);

  const isHeaderLocked = items.length > 0;
  const isItemFormDisabled = !selectedSupplierId || !expectedDeliveryDate || !orderStatus;

  const handleDiscard = useCallback(() => {
    formRef.current?.reset();
    setItems([]);
    setCurrentItem(initialItemState);
    setSelectedSupplierId(null);
    setExpectedDeliveryDate("");
    setOrderStatus("");
    setShowForm(false);
    setItemFormKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;
      if (state.success) {
        handleDiscard();
        onOrderChange();
      }
    }
  }, [state, onOrderChange, handleDiscard]);

  const handleProductSelect = (productId: string | null) => {
    if (!productId) return;
    const product = products.find((p) => p.id === productId);

    if (product) {
      setCurrentItem({
        product_id: product.id,
        product_name: product.product_name,
        product_type: product.product_category,
        quantity: "1",
        cost_per_item: String(product.buy_price || 0),
      });
    }
  };

  const handleAddItem = () => {
    const quantityNum = parseInt(currentItem.quantity, 10);
    const costNum = parseFloat(currentItem.cost_per_item);

    if (!currentItem.product_id || isNaN(quantityNum) || quantityNum <= 0) {
      alert("กรุณาเลือกวัสดุและกรอกจำนวนให้ถูกต้อง");
      return;
    }
    if (isNaN(costNum) || costNum < 0) {
      alert("กรุณากรอกต้นทุนต่อหน่วยให้ถูกต้อง");
      return;
    }

    setItems([
      ...items,
      {
        product_id: currentItem.product_id,
        product_name: currentItem.product_name,
        quantity: quantityNum,
        cost_per_item: costNum,
      },
    ]);
    setCurrentItem(initialItemState);
    setItemFormKey((prevKey) => prevKey + 1);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <>
      <Button onClick={() => setShowForm(true)} className="flex items-center text-xs sm:text-base">
        เพิ่มรายการรับเข้า
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="เพิ่มใบสั่งซื้อ/รับเข้า"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={handleDiscard}>
              ยกเลิก
            </Button>
            <Button type="submit" form="order-form" disabled={isPending || items.length === 0}>
              {isPending ? "กำลังบันทึก..." : items.length === 0 ? "เพิ่มรายการก่อนบันทึก" : "บันทึกใบสั่งซื้อ"}
            </Button>
          </>
        }
      >
        <form id="order-form" ref={formRef} action={formAction} className="flex flex-col gap-5">
          <input type="hidden" name="items" value={JSON.stringify(items)} />
          <SearchableSelect
            label="ผู้จำหน่าย"
            name="supplier_id"
            options={supplierOptions}
            onSelect={setSelectedSupplierId}
            value={selectedSupplierId}
            disabled={isHeaderLocked}
            placeholder="ค้นหาผู้จำหน่าย..."
            required
          />
          <LabeledInput
            label="วันที่คาดว่าจะรับเข้า"
            id="expected_delivery_date"
            name="expected_delivery_date"
            type="date"
            value={expectedDeliveryDate}
            readOnly={isHeaderLocked}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            className={isHeaderLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
            required
          />
          <LabeledSelect
            label="สถานะรายการ"
            id="status"
            name="status"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className={isHeaderLocked ? "bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none" : ""}
            required
          >
            <option value="" disabled>เลือกสถานะ</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </LabeledSelect>
          {isHeaderLocked && (
            <p className="text-xs text-center text-gray-500 -mt-2">
              ลบรายการทั้งหมดก่อนเปลี่ยนผู้จำหน่ายหรือสถานะ
            </p>
          )}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-2">รายการวัสดุ</h3>
            <div className={`flex flex-col gap-2 p-2 border rounded-md bg-gray-50 ${isItemFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
              <SearchableSelect
                label="วัสดุ/อุปกรณ์"
                name="product_id"
                options={productOptions}
                onSelect={handleProductSelect}
                disabled={isItemFormDisabled}
                placeholder={!selectedSupplierId ? "เลือกผู้จำหน่ายก่อน..." : "ค้นหาวัสดุ..."}
                required
                key={itemFormKey}
              />
              <LabeledInput
                label="จำนวน"
                id="temp_qty"
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                disabled={isItemFormDisabled}
              />
              <LabeledInput
                label="ต้นทุนต่อหน่วย"
                id="temp_cost"
                type="number"
                value={currentItem.cost_per_item}
                onChange={(e) => setCurrentItem({ ...currentItem, cost_per_item: e.target.value })}
                disabled={isItemFormDisabled}
              />
              <Button type="button" variant="secondary" onClick={handleAddItem} disabled={isItemFormDisabled}>
                เพิ่มวัสดุในใบสั่งซื้อ
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center p-2 border rounded-md">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} หน่วย @ {item.cost_per_item}</p>
                  </div>
                  <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                    ลบ
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </Modal>
    </>
  );
}
