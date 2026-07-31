import { useMemo, useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaSave, FaTrash, FaUpload } from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useProducts } from "../context/ProductContext";
import { ProductService } from "../services/product.service";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  discount: "",
  category: "rings",
  stock: "",
  featured: false,
  images: [],
};

async function compressImage(file) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return await new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(900 / image.width, 900 / image.height, 1);
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.src = dataUrl;
  });
}

function ProductsAdmin() {
  const { products, categories, addProduct, updateProduct, deleteProduct, toggleProductVisibility } =
    useProducts();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [dragging, setDragging] = useState(false);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingId),
    [editingId, products]
  );

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      images: product.images?.length ? product.images : [product.image],
    });
  };

  const reset = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };

  const uploadFiles = async (files) => {
    const validFiles = [...files].filter((file) => file.type.startsWith("image/"));
    const uploadedUrls = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const res = await ProductService.uploadImage(file);
          return res.url;
        } catch {
          return await compressImage(file);
        }
      })
    );
    setForm((current) => ({ ...current, images: [...current.images, ...uploadedUrls] }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct.id || editingProduct._id || editingProduct.slug, form);
    } else {
      await addProduct(form);
    }
    reset();
  };

  return (
    <div>
      <AdminHeader
        title="Products"
        subtitle="Add, edit, hide, show, delete, and upload multiple product images."
        action={
          <button className="btn btn-gold" type="button" onClick={reset}>
            <FaPlus /> New Product
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="admin-card grid h-max gap-4">
          <h2 className="admin-title">{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <input className="input" required placeholder="Product Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <textarea className="input min-h-28 py-3" required placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="input" required type="number" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            <input className="input" type="number" placeholder="Old Price" value={form.oldPrice} onChange={(event) => setForm({ ...form, oldPrice: event.target.value })} />
            <input className="input" type="number" placeholder="Discount %" value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} />
            <input className="input" required type="number" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
          </div>
          <select className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-3 text-[#f8dfa0]">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
            Featured product
          </label>
          <label
            className={`grid min-h-36 cursor-pointer place-items-center rounded-lg border border-dashed p-4 text-center transition ${
              dragging ? "border-[#d4af37] bg-[#d4af37]/10" : "border-[#d4af37]/35 bg-black/20"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              uploadFiles(event.dataTransfer.files);
            }}
          >
            <input className="hidden" type="file" accept="image/*" multiple onChange={(event) => uploadFiles(event.target.files)} />
            <span className="grid gap-2 justify-items-center text-[#cfc1a5]">
              <FaUpload className="text-2xl text-[#d4af37]" />
              Drag & drop images or click to upload
            </span>
          </label>
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {form.images.map((image, index) => (
                <div key={image.slice(0, 40) + index} className="relative overflow-hidden rounded-lg">
                  <img src={image} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/75 text-white"
                    onClick={() => setForm({ ...form, images: form.images.filter((_, itemIndex) => itemIndex !== index) })}
                    aria-label="Delete image"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-gold" type="submit">
            <FaSave /> Save Product
          </button>
        </form>

        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                        <span className="font-bold">{product.name}</span>
                      </div>
                    </td>
                    <td className="capitalize">{product.category}</td>
                    <td>Rs. {product.price.toLocaleString("en-IN")}</td>
                    <td>{product.stock}</td>
                    <td>{product.hidden ? "Hidden" : "Visible"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-light min-h-9 px-3" type="button" onClick={() => startEdit(product)} aria-label="Edit product">
                          <FaEdit />
                        </button>
                        <button className="btn btn-light min-h-9 px-3" type="button" onClick={() => toggleProductVisibility(product.id)} aria-label="Hide or show product">
                          {product.hidden ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <button className="btn min-h-9 bg-red-700 px-3 text-white" type="button" onClick={() => deleteProduct(product.id)} aria-label="Delete product">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductsAdmin;
