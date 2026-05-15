import StockMovementClient from "@/components/features/stock/StockMovementClient";
import { getAllProductsForSelect } from "@/lib/actions/products";

export default async function StockOutPage() {
  const products = await getAllProductsForSelect();

  return <StockMovementClient products={products} movementType="out" />;
}
