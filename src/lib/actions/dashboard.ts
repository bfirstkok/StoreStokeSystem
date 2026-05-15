"use server";

import { createClientServer } from "@/lib/supabase/server";
import { ChartData } from "@/lib/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

type OrderRow = {
  id: number;
  total_cost: number | null;
  status: string | null;
  created_at: string | null;
};

function getChartBuckets(period: string) {
  const now = new Date();

  if (period === "weekly") {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      date.setDate(now.getDate() - (6 - index));

      return {
        key: date.toISOString().slice(0, 10),
        name: date.toLocaleDateString("en-US", { weekday: "short" }),
        sales: 0,
        purchase: 0,
        ordered: 0,
        delivered: 0,
      };
    });
  }

  if (period === "yearly") {
    const year = now.getFullYear();

    return Array.from({ length: 12 }, (_, month) => {
      const date = new Date(year, month, 1);

      return {
        key: `${year}-${String(month + 1).padStart(2, "0")}`,
        name: date.toLocaleDateString("en-US", { month: "short" }),
        sales: 0,
        purchase: 0,
        ordered: 0,
        delivered: 0,
      };
    });
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;

    return {
      key: `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,
      name: String(day),
      sales: 0,
      purchase: 0,
      ordered: 0,
      delivered: 0,
    };
  });
}

function getBucketKey(dateValue: string | null, period: string) {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  if (period === "yearly") {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  return date.toISOString().slice(0, 10);
}

function buildChartData(
  period: string,
  orders: OrderRow[]
): ChartData[] {
  const buckets = getChartBuckets(period);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  orders.forEach((order) => {
    const key = getBucketKey(order.created_at, period);
    const bucket = key ? bucketMap.get(key) : null;
    if (!bucket) return;

    bucket.purchase += Number(order.total_cost || 0);
    bucket.ordered += 1;
    if (order.status === "Completed") {
      bucket.delivered += 1;
    }
  });

  return buckets.map(({ key: _key, ...bucket }) => bucket);
}

export async function getDashboardStats(period: string = "monthly") {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: productsData } = await supabase
    .from("products")
    .select(
      "id, product_name, amount_stock, product_category, product_image"
    )
    .eq("user_id", user.id);

  const quantityInHand =
    productsData?.reduce((sum, p) => sum + p.amount_stock, 0) || 0;
  const uniqueCategories = new Set(productsData?.map((p) => p.product_category))
    .size;
  const productCount = productsData?.length || 0;
  const inStockProductCount =
    productsData?.filter((product) => Number(product.amount_stock || 0) > 0)
      .length || 0;

  const lowStock =
    productsData
      ?.filter((p) => p.amount_stock < LOW_STOCK_THRESHOLD)
      .sort((a, b) => a.amount_stock - b.amount_stock)
      .map((p) => ({
        id: String(p.id),
        name: p.product_name,
        remainingStock: p.amount_stock,
        image: p.product_image,
      })) || [];

  const chartData = buildChartData(period, []);

  return {
    sales: {
      revenue: 0,
      profit: 0,
      cost: 0,
      quantitySold: 0,
    },
    inventory: {
      quantityInHand: quantityInHand,
      toBeReceived: 0,
    },
    purchase: {
      cost: inStockProductCount,
      purchase: productCount,
      shipped: quantityInHand,
      pending: lowStock.length,
    },
    products: {
      suppliers: productCount,
      categories: uniqueCategories,
    },
    bestSelling: [],
    lowStock,
    charts: chartData,
  };
}
