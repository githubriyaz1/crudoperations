import { useState } from "react";
import { FaEdit, FaImage, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useProducts } from "../context/ProductContext";

function CategoriesAdmin() {
  const { categories, addCategory, updateCategory, deleteCategory } = useProducts();
  const [form, setForm] = useState({ label: "", icon: "", image: "" });
  const [editingValue, setEditingValue] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (editingValue) {
      updateCategory(editingValue, form);
    } else {
      addCategory(form);
    }
    setForm({ label: "", icon: "", image: "" });
    setEditingValue("");
  };

  return (
    <div>
      <AdminHeader title="Categories" subtitle="Rename, add, delete, and attach category icons or image URLs." />
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="admin-card grid h-max gap-4">
          <h2 className="admin-title">{editingValue ? "Edit Category" : "Add Category"}</h2>
          <input className="input" required placeholder="Category name" value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
          <input className="input" placeholder="Category icon" value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} />
          <input className="input" placeholder="Category image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
          <button className="btn btn-gold" type="submit">
            {editingValue ? <FaSave /> : <FaPlus />} Save Category
          </button>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.value} className="admin-card">
              <div className="grid aspect-video place-items-center overflow-hidden rounded-lg bg-black/25">
                {category.image ? (
                  <img src={category.image} alt={category.label} className="h-full w-full object-cover" />
                ) : (
                  <FaImage className="text-4xl text-[#d4af37]" />
                )}
              </div>
              <h2 className="font-display mt-4 text-3xl font-bold text-[#f8dfa0]">
                {category.label}
              </h2>
              <p className="mt-1 text-sm text-[#cfc1a5]">Icon: {category.icon}</p>
              <div className="mt-4 flex gap-2">
                <button
                  className="btn btn-light min-h-9 px-3"
                  type="button"
                  onClick={() => {
                    setEditingValue(category.value);
                    setForm({
                      label: category.label,
                      icon: category.icon,
                      image: category.image,
                    });
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn min-h-9 bg-red-700 px-3 text-white"
                  type="button"
                  onClick={() => deleteCategory(category.value)}
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CategoriesAdmin;
