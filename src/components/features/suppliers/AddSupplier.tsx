"use client";

import {
  useState,
  useActionState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { insertSupplier } from "@/lib/actions/suppliers";
import { Button } from "@/components/ui/Button";
import LabeledInput from "@/components/ui/LabeledInput";
import Modal from "@/components/ui/Modal";
import { FormState } from "@/lib/types";

const initialState: FormState = {
  success: false,
  message: "",
};

const AddSupplier = ({ onOrderChange }: { onOrderChange: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const processedStateRef = useRef(initialState);

  const [state, formAction, isPending] = useActionState(
    insertSupplier,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  const handleยกเลิก = useCallback(() => {
    formRef.current?.reset();
    setShowForm(false);
  }, []);
  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;
      if (state.success) {
        handleยกเลิก();
        onOrderChange();
      }
    }
  }, [state, onOrderChange, handleยกเลิก]);

  return (
    <div className="">
      <Button
        onClick={() => setShowForm(true)}
        className="text-xs sm:text-base"
      >
        เพิ่มผู้จำหน่าย
      </Button>
      <Modal
        isOpen={showForm}
        onClose={handleยกเลิก}
        title="เพิ่มผู้จำหน่ายใหม่"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleยกเลิก}
              className="text-xs sm:text-base"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              form="supplier-form"
              disabled={isPending}
              className="text-xs sm:text-base"
            >
              {isPending ? "กำลังเพิ่ม..." : "เพิ่มผู้จำหน่าย"}
            </Button>
          </>
        }
      >
        <form
          id="supplier-form"
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-5"
        >
          <LabeledInput
            id="supplier_name"
            name="supplier_name"
            label="ชื่อผู้จำหน่าย"
            type="text"
            placeholder="เช่น ร้านวัสดุก่อสร้าง ABC"
            required
          />

          <LabeledInput
            id="address"
            name="address"
            label="ที่อยู่ผู้จำหน่าย"
            type="text"
            placeholder="เช่น 99/1 ถ.ก่อสร้าง"
            required
          />

          <LabeledInput
            id="contact_number"
            name="contact_number"
            label="เบอร์ติดต่อ"
            type="number"
            placeholder="เช่น 0812345678"
            required
          />

          <LabeledInput
            id="purchase_link"
            name="purchase_link"
            label="ลิงก์สั่งซื้อ"
            type="text"
            placeholder="เช่น https://..."
          />
        </form>
      </Modal>
    </div>
  );
};

export default AddSupplier;
