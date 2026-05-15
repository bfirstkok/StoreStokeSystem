const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  "construction-materials": "วัสดุก่อสร้าง",
  tools: "เครื่องมือช่าง",
  electrical: "อุปกรณ์ไฟฟ้า",
  plumbing: "อุปกรณ์ประปา",
  "paint-chemicals": "สีและเคมีภัณฑ์",
  safety: "อุปกรณ์ความปลอดภัย",
  consumables: "วัสดุสิ้นเปลือง",
};

export function formatProductCategory(category?: string | null) {
  if (!category) return "-";
  return PRODUCT_CATEGORY_LABELS[category] ?? category;
}
