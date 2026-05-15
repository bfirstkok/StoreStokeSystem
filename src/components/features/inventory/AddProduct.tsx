"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { insertProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import LabeledInput from "@/components/ui/LabeledInput";
import LabeledSelect from "@/components/ui/LabeledSelect";
import ImageDropzone from "@/components/ui/ImageDropzone";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { formatDisplayPhoneNumber } from "@/lib/utils/formatters";
import { FormState, SupplierOption } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

const initialState: FormState = {
  success: false,
  message: "",
};

interface AddProductProps {
  suppliers: SupplierOption[];
  onOrderChange: () => void;
}

export default function AddProduct({
  suppliers,
  onOrderChange,
}: AddProductProps) {
  const [showForm, setShowForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(insertProduct, initialState);
  const [selectedSupplierID, setSelectedSupplierId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const processedStateRef = useRef(initialState);

  const supplierOptions = suppliers.map((supplier) => ({
    id: supplier.id,
    main_text: supplier.supplier_name,
    secondary_text: String(formatDisplayPhoneNumber(supplier.contact_number)),
  }));

  const handleDiscard = useCallback(() => {
    formRef.current?.reset();
    setPreviewUrl(null);
    setSelectedSupplierId(null);
    setShowForm(false);
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

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

  return (
    <>
      <Button onClick={() => setShowForm(true)} className="flex items-center text-xs sm:text-base">
        เพิ่มวัสดุ
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleDiscard}
        title="เพิ่มวัสดุใหม่"
        footer={
          <>
            <Button type="button" variant="secondary" onClick={handleDiscard} className="text-xs sm:text-base">
              ยกเลิก
            </Button>
            <Button type="submit" form="product-form" disabled={isPending} className="text-xs sm:text-base">
              {isPending ? "กำลังเพิ่ม..." : "เพิ่มวัสดุ"}
            </Button>
          </>
        }
      >
        <form id="product-form" ref={formRef} action={formAction} className="flex flex-col gap-5">
          <ImageDropzone name="image_file" previewUrl={previewUrl} onChange={handleFileChange} />
          <SearchableSelect
            label="ผู้จำหน่าย"
            name="supplier_id"
            options={supplierOptions}
            onSelect={setSelectedSupplierId}
            value={selectedSupplierID}
            placeholder={
              supplierOptions.length > 0
                ? "เลือกผู้จำหน่าย ถ้ามี..."
                : "ยังไม่มีผู้จำหน่าย"
            }
          />
          <LabeledInput
            label="ชื่อวัสดุ/อุปกรณ์"
            id="name"
            name="product_name"
            type="text"
            placeholder="เช่น ปูนซีเมนต์, สว่านไฟฟ้า"
            required
          />
          <LabeledSelect label="หมวดหมู่" id="category" name="product_category" defaultValue="" required>
            <option value="" disabled>
              เลือกหมวดหมู่
            </option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </LabeledSelect>
          <LabeledInput label="จำนวน" id="amountStock" name="amount_stock" type="number" placeholder="เช่น 50" min={0} required />
        </form>
      </Modal>
    </>
  );
}
