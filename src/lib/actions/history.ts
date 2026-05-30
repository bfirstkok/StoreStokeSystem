"use server";

import { createClientServer } from "@/lib/supabase/server";
import { HistoryItem, StockMovementHistoryItem } from "@/lib/types";
import { isMissingSchemaTableError } from "@/lib/utils/supabase-errors";

type StockMovementRow = {
  id: number;
  product_id?: number;
  movement_type: "in" | "out";
  quantity: number;
  note: string | null;
  created_at: string;
  actor: {
    name: string | null;
    email: string | null;
  } | null;
  account_user: {
    name: string | null;
    role: string | null;
  } | null;
  product?: {
    id: number;
    product_name: string | null;
    product_category: string | null;
  } | null;
};

function mapStockMovement(item: StockMovementRow): HistoryItem {
  const actorName =
    item.account_user?.name ||
    item.actor?.name ||
    item.actor?.email ||
    "ไม่ทราบผู้ทำรายการ";

  return {
    id: `STK-${item.id}`,
    date: item.created_at,
    type: item.movement_type,
    quantity: item.quantity,
    note: item.note,
    actor_name: actorName,
    actor_email: item.account_user?.name ? null : item.actor?.email ?? null,
  };
}

export async function getProductHistory(
  productId: number
): Promise<HistoryItem[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("stock_movements")
    .select(
      `
      id,
      movement_type,
      quantity,
      note,
      created_at,
      account_user:account_users ( name, role ),
      actor:users ( name, email )
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSchemaTableError(error)) return [];
    console.error("Error fetching stock movement history:", error.message);
    return [];
  }

  return ((data as unknown as StockMovementRow[]) || []).map(mapStockMovement);
}

export async function getStockMovementHistory(
  limit = 100
): Promise<StockMovementHistoryItem[]> {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("stock_movements")
    .select(
      `
      id,
      product_id,
      movement_type,
      quantity,
      note,
      created_at,
      account_user:account_users ( name, role ),
      actor:users ( name, email ),
      product:products ( id, product_name, product_category )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (isMissingSchemaTableError(error)) return [];
    console.error("Error fetching stock movement history:", error.message);
    return [];
  }

  return ((data as unknown as StockMovementRow[]) || []).map((item) => {
    const movement = mapStockMovement(item);

    return {
      ...movement,
      product_id: item.product?.id ?? item.product_id ?? 0,
      product_name: item.product?.product_name || "ไม่ทราบวัสดุ",
      product_category: item.product?.product_category ?? null,
    };
  });
}
