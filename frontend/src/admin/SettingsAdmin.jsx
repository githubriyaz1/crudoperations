import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { AdminHeader } from "./AdminOverview";
import { useStore } from "../context/StoreContext";
import { showToast } from "../utils/toast";

function SettingsAdmin() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);

  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      showToast("Store settings saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Settings" subtitle="Update the details customers see across the storefront. Your preferences are saved automatically." />
      <form onSubmit={submit} className="admin-card grid max-w-3xl gap-4">
        <h2 className="admin-title">Storefront details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Store name<input className="input" required value={form.storeName} onChange={(event) => setForm({ ...form, storeName: event.target.value })} /></label>
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Support email<input className="input" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Support phone<input className="input" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Brand colour<input className="input h-12 p-1" required type="color" value={form.primaryColor} onChange={(event) => setForm({ ...form, primaryColor: event.target.value })} /></label>
        </div>
        <label className="grid gap-1 text-sm text-[#cfc1a5]">Store address<textarea className="input min-h-24 py-3" required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
        <label className="grid gap-1 text-sm text-[#cfc1a5]">Store announcement<input className="input" value={form.announcement} onChange={(event) => setForm({ ...form, announcement: event.target.value })} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Free shipping threshold<input className="input" required min="0" type="number" value={form.shippingThreshold} onChange={(event) => setForm({ ...form, shippingThreshold: event.target.value })} /></label>
          <label className="grid gap-1 text-sm text-[#cfc1a5]">Shipping charge below threshold<input className="input" required min="0" type="number" value={form.shippingCharge} onChange={(event) => setForm({ ...form, shippingCharge: event.target.value })} /></label>
        </div>
        <button className="btn btn-gold w-max" type="submit" disabled={saving}>
          <FaSave /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

export default SettingsAdmin;
