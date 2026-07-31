import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";

function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const { orders } = useOrders();
  const userOrders = orders.filter((order) => order.email === currentUser?.email);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    address: currentUser?.addresses?.[0] || "",
  });

  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const save = async (event) => {
    event.preventDefault();
    setNotice("");
    setSaving(true);
    try {
      const addressItem = typeof form.address === "string" ? { address: form.address } : form.address;
      const res = await updateProfile({
        name: form.name,
        phone: form.phone,
        addresses: form.address ? [addressItem] : [],
      });
      if (res.ok) {
        setNotice("Profile updated successfully!");
      } else {
        setNotice(res.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="soft-card h-max p-6">
          <p className="eyebrow">Account</p>
          <h1 className="font-display mt-2 text-4xl font-bold">{currentUser?.name}</h1>
          <p className="mt-2 text-[#746c60]">{currentUser?.email}</p>
          <button className="btn btn-dark mt-6 w-full" type="button" onClick={logout}>
            Logout
          </button>
        </section>

        <section className="grid gap-6">
          <form onSubmit={save} className="soft-card grid gap-4 p-6">
            <h2 className="font-display text-3xl font-bold">Manage Profile</h2>
            {notice && (
              <p className="rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 p-3 text-sm text-[#d4af37]">
                {notice}
              </p>
            )}
            <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />
            <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone number" />
            <textarea className="input min-h-28 py-3" value={typeof form.address === "object" ? form.address.address || "" : form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Saved address" />
            <button className="btn btn-gold w-max" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <div className="soft-card p-6">
            <h2 className="font-display text-3xl font-bold">Order History</h2>
            {userOrders.length ? (
              <div className="mt-4 grid gap-3">
                {userOrders.map((order) => (
                  <Link key={order.id} to="/orders" className="rounded-lg border border-[#eadfbe] p-4">
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-[#746c60]">{order.status} - Rs. {order.total.toLocaleString("en-IN")}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[#746c60]">No orders yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
