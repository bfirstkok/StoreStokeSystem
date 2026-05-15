import Link from "next/link";
import { getStockStatus } from "@/lib/utils/formatters";
import { formatProductCategory } from "@/lib/utils/product-category";
import { Product } from "@/lib/types";
interface ProductRowProps {
  product: Product;
}

export default function ProductRow({ product }: ProductRowProps) {
  const status = getStockStatus(product.amount_stock);

  return (
    <tr className="hover:bg-gray-100">
      <td className="py-2 px-2 md:px-4 hidden md:table-cell">
        {product.supplier?.supplier_name}
      </td>
      <td className="py-2 px-2 md:px-4">
        <Link
          href={`/product/${product.id}`}
          className="text-blue-600 hover:underline"
        >
          {product.product_name}
        </Link>
      </td>
      <td className="py-2 px-2 md:px-4 hidden lg:table-cell">
        {formatProductCategory(product.product_category)}
      </td>
      <td className="py-2 px-2 md:px-4">{product.amount_stock}</td>
      <td className={`py-2 px-2 md:px-4 ${status.color}`}>{status.label}</td>
    </tr>
  );
}
