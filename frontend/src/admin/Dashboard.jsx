import products from "../data/products";

function Dashboard() {
  const revenue = products.reduce((sum, product) => sum + product.price * 3, 0);
  const stock = products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <main className="admin-page py-14">
      <div className="container">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Owner Panel</p>
            <h1 className="font-display mt-2 text-5xl font-bold text-[#f8dfa0]">
              Admin Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-[#cfc1a5]">
              Frontend admin preview. Product upload, authentication, orders,
              and MongoDB persistence can be connected in the backend phase.
            </p>
          </div>
          <button className="btn btn-gold" type="button">
            Add Product
          </button>
        </div>

        <section className="grid gap-5 md:grid-cols-4">
          <Metric label="Products" value={products.length} />
          <Metric label="Stock Units" value={stock} />
          <Metric label="Sample Orders" value="24" />
          <Metric label="Revenue" value={`Rs. ${revenue.toLocaleString("en-IN")}`} />
        </section>

        <section className="mt-8 overflow-hidden rounded-lg border border-[#d4af37]/20 bg-white/[0.04]">
          <div className="border-b border-[#d4af37]/15 p-5">
            <h2 className="font-display text-3xl font-bold text-[#f8dfa0]">
              Product Inventory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="text-xs uppercase tracking-[0.16em] text-[#d4af37]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Badge</th>
                </tr>
              </thead>
              <tbody className="text-[#e9deca]">
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-[#d4af37]/10">
                    <td className="p-4 font-bold">{product.name}</td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4">Rs. {product.price.toLocaleString("en-IN")}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">{product.badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-[#d4af37]/20 bg-white/[0.04] p-5">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#cfc1a5]">
        {label}
      </p>
      <p className="font-display mt-3 text-4xl font-bold text-[#d4af37]">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
