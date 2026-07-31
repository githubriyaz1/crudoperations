import { useMemo, useState } from "react";
import {
  FaCheck,
  FaCopy,
  FaEdit,
  FaPause,
  FaPlus,
  FaSave,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useCoupons } from "../context/CouponContext";
import { showToast } from "../utils/toast";

const blankCoupon = {
  code: "",
  description: "",
  discountType: "percentage",
  value: "",
  minimumOrder: "",
  maxDiscount: "",
  usageLimit: "",
  startDate: "",
  expiresAt: "",
  active: true,
};

function formatCoupon(coupon) {
  return coupon.discountType === "percentage"
    ? `${coupon.value}% OFF`
    : `Rs. ${Number(coupon.value).toLocaleString("en-IN")} OFF`;
}

function isExpired(coupon) {
  return Boolean(coupon.expiresAt && coupon.expiresAt < new Date().toISOString().slice(0, 10));
}

function CouponsAdmin() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCoupon } = useCoupons();
  const [form, setForm] = useState(blankCoupon);
  const [editingId, setEditingId] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCoupons = useMemo(() => {
    const search = query.trim().toLowerCase();
    return coupons.filter((coupon) => {
      const matchesSearch =
        !search ||
        coupon.code.toLowerCase().includes(search) ||
        coupon.description.toLowerCase().includes(search);
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && coupon.active && !isExpired(coupon)) ||
        (filter === "paused" && !coupon.active) ||
        (filter === "expired" && isExpired(coupon));
      return matchesSearch && matchesFilter;
    });
  }, [coupons, filter, query]);

  const resetForm = () => {
    setForm(blankCoupon);
    setEditingId("");
  };

  const editCoupon = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      value: coupon.value,
      minimumOrder: coupon.minimumOrder,
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      startDate: coupon.startDate || "",
      expiresAt: coupon.expiresAt || "",
      active: coupon.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (event) => {
    event.preventDefault();
    const result = editingId ? updateCoupon(editingId, form) : addCoupon(form);
    if (!result.ok) {
      showToast(result.message);
      return;
    }
    showToast(editingId ? "Coupon updated" : "Coupon created");
    resetForm();
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showToast(`${code} copied`);
    } catch {
      showToast(`Coupon code: ${code}`);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Coupons"
        subtitle="Create offers, set eligibility, and pause or update them anytime. Changes are saved automatically."
        action={
          <button className="btn btn-gold" type="button" onClick={resetForm}>
            <FaPlus /> New Coupon
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <form onSubmit={submit} className="admin-card grid h-max gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="admin-title">{editingId ? "Edit Coupon" : "New Coupon"}</h2>
            {editingId && (
              <button className="text-sm font-bold text-[#d4af37]" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] xl:grid-cols-1">
            <input
              className="input uppercase"
              required
              maxLength="24"
              placeholder="Code (example: FESTIVE20)"
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
            />
            <label className="flex items-center gap-2 rounded-lg border border-[#d4af37]/25 bg-black/20 px-3 py-2 text-sm font-semibold text-[#f8dfa0]">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Active
            </label>
          </div>
          <input
            className="input"
            placeholder="Short description for your team"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <select
              className="input"
              value={form.discountType}
              onChange={(event) => setForm({ ...form, discountType: event.target.value })}
            >
              <option value="percentage">Percentage discount</option>
              <option value="fixed">Fixed amount discount</option>
            </select>
            <input
              className="input"
              type="number"
              required
              min="1"
              max={form.discountType === "percentage" ? "100" : undefined}
              placeholder={form.discountType === "percentage" ? "Discount %" : "Discount amount"}
              value={form.value}
              onChange={(event) => setForm({ ...form, value: event.target.value })}
            />
            <input
              className="input"
              type="number"
              min="0"
              placeholder="Minimum order value (optional)"
              value={form.minimumOrder}
              onChange={(event) => setForm({ ...form, minimumOrder: event.target.value })}
            />
            {form.discountType === "percentage" && (
              <input
                className="input"
                type="number"
                min="0"
                placeholder="Maximum discount cap (optional)"
                value={form.maxDiscount}
                onChange={(event) => setForm({ ...form, maxDiscount: event.target.value })}
              />
            )}
            <input
              className="input"
              type="number"
              min="0"
              placeholder="Usage limit (0 = unlimited)"
              value={form.usageLimit}
              onChange={(event) => setForm({ ...form, usageLimit: event.target.value })}
            />
            <label className="grid gap-1 text-sm text-[#cfc1a5]">
              Starts on (optional)
              <input
                className="input"
                type="date"
                value={form.startDate}
                onChange={(event) => setForm({ ...form, startDate: event.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm text-[#cfc1a5]">
              Ends on (optional)
              <input
                className="input"
                type="date"
                min={form.startDate || undefined}
                value={form.expiresAt}
                onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}
              />
            </label>
          </div>
          <button className="btn btn-gold" type="submit">
            <FaSave /> {editingId ? "Update Coupon" : "Create Coupon"}
          </button>
        </form>

        <div className="admin-card overflow-hidden">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d4af37]" />
              <input
                className="input pl-10"
                placeholder="Search code or note"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <select className="input w-full sm:w-36" value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All offers</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="grid gap-3 md:hidden">
            {filteredCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onCopy={copyCode}
                onEdit={editCoupon}
                onToggle={toggleCoupon}
                onDelete={deleteCoupon}
              />
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="admin-table min-w-[860px]">
              <thead>
                <tr>
                  <th>Offer</th>
                  <th>Discount</th>
                  <th>Conditions</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <button className="flex items-center gap-2 font-bold text-[#f8dfa0]" type="button" onClick={() => copyCode(coupon.code)}>
                        {coupon.code} <FaCopy className="text-xs text-[#d4af37]" />
                      </button>
                      {coupon.description && <p className="mt-1 max-w-48 text-xs text-[#cfc1a5]">{coupon.description}</p>}
                    </td>
                    <td className="font-bold text-[#d4af37]">{formatCoupon(coupon)}</td>
                    <td>
                      <p>Min. Rs. {coupon.minimumOrder.toLocaleString("en-IN")}</p>
                      {coupon.expiresAt && <p className="mt-1 text-xs text-[#cfc1a5]">Ends {coupon.expiresAt}</p>}
                    </td>
                    <td>{coupon.usageLimit ? `${coupon.usageCount} / ${coupon.usageLimit}` : `${coupon.usageCount} used`}</td>
                    <td><StatusBadge coupon={coupon} /></td>
                    <td><CouponActions coupon={coupon} onEdit={editCoupon} onToggle={toggleCoupon} onDelete={deleteCoupon} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCoupons.length === 0 && (
            <div className="grid min-h-48 place-items-center text-center text-[#cfc1a5]">
              <p>No coupons match this view.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ coupon }) {
  const status = isExpired(coupon) ? "Expired" : coupon.active ? "Active" : "Paused";
  const color = status === "Active" ? "bg-emerald-400/15 text-emerald-300" : "bg-[#d4af37]/15 text-[#f8dfa0]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>{status}</span>;
}

function CouponActions({ coupon, onEdit, onToggle, onDelete }) {
  return (
    <div className="flex gap-2">
      <button className="btn btn-light min-h-9 px-3" type="button" onClick={() => onEdit(coupon)} aria-label={`Edit ${coupon.code}`}><FaEdit /></button>
      <button className="btn btn-light min-h-9 px-3" type="button" onClick={() => onToggle(coupon.id)} aria-label={`Toggle ${coupon.code}`}>{coupon.active ? <FaPause /> : <FaCheck />}</button>
      <button className="btn min-h-9 bg-red-700 px-3 text-white" type="button" onClick={() => { if (window.confirm(`Delete ${coupon.code}?`)) onDelete(coupon.id); }} aria-label={`Delete ${coupon.code}`}><FaTrash /></button>
    </div>
  );
}

function CouponCard({ coupon, onCopy, onEdit, onToggle, onDelete }) {
  return (
    <article className="rounded-lg border border-[#d4af37]/15 bg-white/[0.035] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button className="flex items-center gap-2 text-left font-bold text-[#f8dfa0]" type="button" onClick={() => onCopy(coupon.code)}>{coupon.code} <FaCopy className="text-xs text-[#d4af37]" /></button>
          <p className="mt-1 text-sm text-[#d4af37]">{formatCoupon(coupon)}</p>
        </div>
        <StatusBadge coupon={coupon} />
      </div>
      {coupon.description && <p className="mt-3 text-sm text-[#cfc1a5]">{coupon.description}</p>}
      <p className="mt-3 text-sm text-[#cfc1a5]">Minimum order: Rs. {coupon.minimumOrder.toLocaleString("en-IN")} · {coupon.usageLimit ? `${coupon.usageCount}/${coupon.usageLimit} used` : `${coupon.usageCount} used`}</p>
      <div className="mt-4"><CouponActions coupon={coupon} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} /></div>
    </article>
  );
}

export default CouponsAdmin;
