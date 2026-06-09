import { redirect } from "next/navigation";
import Image from "next/image";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export default async function InventoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const products = getAllProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Inventory Management</h1>
      <p className="mt-1 text-sm text-light/50">{products.length} products in catalog</p>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-dark-soft ring-1 ring-light/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-light/10 text-light/50">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Tags</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-light/5">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                      <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    </div>
                    <span className="font-medium text-light">{p.name}</span>
                  </div>
                </td>
                <td className="p-4 capitalize text-light/70">{p.category}</td>
                <td className="p-4 text-gold">{formatPrice(p.price)}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.stock < 5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded bg-gold/10 px-2 py-0.5 text-xs text-gold">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
