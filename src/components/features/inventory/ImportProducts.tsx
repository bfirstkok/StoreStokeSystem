"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { importProductsFromExcel } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { FormState, SupplierOption } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type ImportRow = {
  rowNumber: number;
  product_name: string;
  product_category: string;
  category_label: string;
  amount_stock: number;
  buy_price: number;
  sell_price: number;
  supplier_id: number | null;
  supplier_name: string;
  errors: string[];
};

const initialState: FormState = {
  success: false,
  message: "",
};

const headerAliases: Record<string, string[]> = {
  product_name: ["product_name", "name", "ชื่อวัสดุ", "ชื่อสินค้า", "วัสดุ"],
  product_category: ["product_category", "category", "หมวดหมู่"],
  amount_stock: ["amount_stock", "stock", "quantity", "จำนวน", "คงเหลือ"],
  buy_price: ["buy_price", "cost", "ราคาซื้อ", "ต้นทุน"],
  sell_price: ["sell_price", "price", "ราคาขาย"],
  supplier_id: ["supplier_id", "รหัสผู้จำหน่าย"],
  supplier_name: ["supplier_name", "supplier", "ผู้จำหน่าย"],
};

interface ImportProductsProps {
  suppliers: SupplierOption[];
  onImportComplete: () => void;
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeKey(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function readField(row: Record<string, unknown>, field: keyof typeof headerAliases) {
  const aliases = headerAliases[field].map((alias) => alias.toLowerCase());
  const matchedKey = Object.keys(row).find((key) =>
    aliases.includes(key.trim().toLowerCase())
  );

  return matchedKey ? row[matchedKey] : "";
}

function parseNonNegativeInteger(value: unknown) {
  const text = normalizeText(value);
  if (!text) return null;

  const number = Number(text);
  if (!Number.isInteger(number) || number < 0) return null;

  return number;
}

function parseNonNegativeNumber(value: unknown) {
  const text = normalizeText(value);
  if (!text) return 0;

  const number = Number(text);
  if (Number.isNaN(number) || number < 0) return null;

  return number;
}

export default function ImportProducts({
  suppliers,
  onImportComplete,
}: ImportProductsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [state, formAction, isPending] = useActionState(
    importProductsFromExcel,
    initialState
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const processedStateRef = useRef(initialState);

  const categoryByName = useMemo(() => {
    const map = new Map<string, { label: string; value: string }>();

    PRODUCT_CATEGORIES.forEach((category) => {
      map.set(normalizeKey(category.value), category);
      map.set(normalizeKey(category.label), category);
    });

    map.set("air", { label: "ปรับอากาศ", value: "air-conditioning" });
    map.set("ac", { label: "ปรับอากาศ", value: "air-conditioning" });
    map.set("แอร์", { label: "ปรับอากาศ", value: "air-conditioning" });

    return map;
  }, []);

  const supplierByName = useMemo(() => {
    const map = new Map<string, SupplierOption>();

    suppliers.forEach((supplier) => {
      map.set(String(supplier.id), supplier);
      map.set(normalizeKey(supplier.supplier_name), supplier);
    });

    return map;
  }, [suppliers]);

  const validRows = rows.filter((row) => row.errors.length === 0);
  const errorCount = rows.reduce((sum, row) => sum + row.errors.length, 0);
  const productsJson = JSON.stringify(
    validRows.map((row) => ({
      product_name: row.product_name,
      product_category: row.product_category,
      amount_stock: row.amount_stock,
      buy_price: row.buy_price,
      sell_price: row.sell_price,
      supplier_id: row.supplier_id,
    }))
  );

  const reset = () => {
    setRows([]);
    setFileName("");
    setFileError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const closeModal = () => {
    reset();
    setIsOpen(false);
  };

  const handleFileChange = async (file: File | null) => {
    reset();
    if (!file) return;

    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        setFileError("ไม่พบ sheet ในไฟล์นี้");
        return;
      }

      const worksheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        { defval: "" }
      );

      if (rawRows.length === 0) {
        setFileError("ไม่พบข้อมูลในไฟล์");
        return;
      }

      const parsedRows = rawRows.map((rawRow, index): ImportRow => {
        const errors: string[] = [];
        const productName = normalizeText(readField(rawRow, "product_name"));
        const rawCategory = normalizeText(readField(rawRow, "product_category"));
        const category = categoryByName.get(normalizeKey(rawCategory));
        const amountStock = parseNonNegativeInteger(
          readField(rawRow, "amount_stock")
        );
        const buyPrice = parseNonNegativeNumber(readField(rawRow, "buy_price"));
        const sellPrice = parseNonNegativeNumber(readField(rawRow, "sell_price"));
        const rawSupplierId = normalizeText(readField(rawRow, "supplier_id"));
        const rawSupplierName = normalizeText(readField(rawRow, "supplier_name"));
        const supplier = rawSupplierId
          ? supplierByName.get(rawSupplierId)
          : supplierByName.get(normalizeKey(rawSupplierName));

        if (!productName) errors.push("ไม่มีชื่อวัสดุ");
        if (!category) errors.push("หมวดหมู่ไม่ถูกต้อง");
        if (amountStock === null) errors.push("จำนวนต้องเป็นเลขจำนวนเต็ม 0 ขึ้นไป");
        if (buyPrice === null) errors.push("ราคาซื้อต้องเป็นตัวเลข 0 ขึ้นไป");
        if (sellPrice === null) errors.push("ราคาขายต้องเป็นตัวเลข 0 ขึ้นไป");
        if ((rawSupplierId || rawSupplierName) && !supplier) {
          errors.push("ไม่พบผู้จำหน่ายในระบบ");
        }

        return {
          rowNumber: index + 2,
          product_name: productName,
          product_category: category?.value ?? rawCategory,
          category_label: category?.label ?? rawCategory,
          amount_stock: amountStock ?? 0,
          buy_price: buyPrice ?? 0,
          sell_price: sellPrice ?? 0,
          supplier_id: supplier ? Number(supplier.id) : null,
          supplier_name: supplier?.supplier_name ?? rawSupplierName,
          errors,
        };
      });

      setRows(parsedRows);
    } catch (error) {
      console.error("Failed to read import file:", error);
      setFileError("อ่านไฟล์ไม่สำเร็จ กรุณาตรวจสอบว่าเป็นไฟล์ .xlsx, .xls หรือ .csv");
    }
  };

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        "ชื่อวัสดุ": "ท่อทองแดงแอร์ 1/4 นิ้ว",
        "หมวดหมู่": "ปรับอากาศ",
        "จำนวน": 10,
        "ราคาซื้อ": 0,
        "ราคาขาย": 0,
        "ผู้จำหน่าย": suppliers[0]?.supplier_name ?? "",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "วัสดุ");
    XLSX.writeFile(workbook, "product-import-template.xlsx");
  };

  useEffect(() => {
    if (state !== processedStateRef.current && state.message) {
      alert(state.message);
      processedStateRef.current = state;

      if (state.success) {
        closeModal();
        onImportComplete();
      }
    }
  }, [state, onImportComplete]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(true)}
        className="flex items-center text-xs sm:text-base"
      >
        นำเข้า Excel
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="นำเข้าวัสดุจาก Excel"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
              className="text-xs sm:text-base"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              form="import-products-form"
              disabled={isPending || validRows.length === 0 || errorCount > 0}
              className="text-xs sm:text-base"
            >
              {isPending ? "กำลังนำเข้า..." : `นำเข้า ${validRows.length} รายการ`}
            </Button>
          </>
        }
      >
        <form id="import-products-form" action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="products_json" value={productsJson} />
          <div className="flex flex-col gap-3 rounded-md border border-dashed border-gray-300 p-4">
            <input
              ref={inputRef}
              id="product-import-file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                className="text-xs sm:text-sm"
              >
                เลือกไฟล์
              </Button>
              <span className="text-xs text-gray-500">
                {fileName || "ยังไม่ได้เลือกไฟล์"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={downloadTemplate}
                className="text-xs sm:text-sm"
              >
                ดาวน์โหลด Template
              </Button>
            </div>
          </div>

          {fileError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {fileError}
            </p>
          ) : null}

          {rows.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  พร้อมนำเข้า {validRows.length} รายการ
                </span>
                {errorCount > 0 ? (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">
                    ต้องแก้ไข {errorCount} จุด
                  </span>
                ) : null}
              </div>
              <div className="max-h-80 overflow-auto rounded-md border border-gray-200">
                <table className="min-w-full text-left text-xs">
                  <thead className="sticky top-0 bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-3 py-2">แถว</th>
                      <th className="px-3 py-2">ชื่อวัสดุ</th>
                      <th className="px-3 py-2">หมวดหมู่</th>
                      <th className="px-3 py-2">จำนวน</th>
                      <th className="px-3 py-2">ผู้จำหน่าย</th>
                      <th className="px-3 py-2">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.rowNumber} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-gray-500">{row.rowNumber}</td>
                        <td className="px-3 py-2">{row.product_name || "-"}</td>
                        <td className="px-3 py-2">{row.category_label || "-"}</td>
                        <td className="px-3 py-2">{row.amount_stock}</td>
                        <td className="px-3 py-2">{row.supplier_name || "-"}</td>
                        <td className="px-3 py-2">
                          {row.errors.length === 0 ? (
                            <span className="text-emerald-700">พร้อม</span>
                          ) : (
                            <span className="text-red-700">
                              {row.errors.join(", ")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
