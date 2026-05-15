"use server";

import { createClientServer } from "@/lib/supabase/server";
import {
  formatCurrency,
  formatDisplayPhoneNumber,
} from "@/lib/utils/formatters";
import { formatProductCategory } from "@/lib/utils/product-category";

export type SearchResult = {
  id: string | number;
  title: string;
  subtitle: string;
  type: "product" | "supplier" | "order";
  url: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const supabase = await createClientServer();
  const limitPerCategory = 4;
  const results: SearchResult[] = [];

  const productsPromise = supabase
    .from("products")
    .select("id, product_name, product_category, product_type")
    .ilike("product_name", `%${query}%`)
    .limit(limitPerCategory);

  const suppliersPromise = supabase
    .from("suppliers")
    .select("id, supplier_name, contact_number")
    .ilike("supplier_name", `%${query}%`)
    .limit(limitPerCategory);

  const ordersPromise = supabase
    .from("orders")
    .select("id, po_code, status, total_cost")
    .ilike("po_code", `%${query}%`)
    .limit(limitPerCategory);

  const [products, suppliers, orders] = await Promise.all([
    productsPromise,
    suppliersPromise,
    ordersPromise,
  ]);

  products.data?.forEach((p) => {
    results.push({
      id: p.id,
      title: p.product_name,
      subtitle: formatProductCategory(p.product_category),
      type: "product",
      url: `/product/${p.id}`,
    });
  });

  suppliers.data?.forEach((s) => {
    results.push({
      id: s.id,
      title: s.supplier_name,
      subtitle: `${formatDisplayPhoneNumber(s.contact_number)}`,
      type: "supplier",
      url: `/suppliers?search=${s.supplier_name}`,
    });
  });

  orders.data?.forEach((o) => {
    results.push({
      id: o.id,
      title: o.po_code,
      subtitle: `${o.status} • มูลค่า: ${formatCurrency(o.total_cost)}`,
      type: "order",
      url: `/orders?search=${o.po_code}`,
    });
  });

  return results;
}
