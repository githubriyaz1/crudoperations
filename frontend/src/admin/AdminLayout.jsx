import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaChartLine,
  FaCog,
  FaExternalLinkAlt,
  FaHome,
  FaList,
  FaSignOutAlt,
  FaStar,
  FaTags,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

const links = [
  { to: "/admin", label: "Dashboard", icon: FaHome, end: true },
  { to: "/admin/products", label: "Products", icon: FaBoxOpen },
  { to: "/admin/categories", label: "Categories", icon: FaList },
  { to: "/admin/orders", label: "Orders", icon: FaTags },
  { to: "/admin/customers", label: "Customers", icon: FaUsers },
  { to: "/admin/reviews", label: "Reviews", icon: FaStar },
  { to: "/admin/coupons", label: "Coupons", icon: FaTicketAlt },
  { to: "/admin/analytics", label: "Analytics", icon: FaChartLine },
  { to: "/admin/settings", label: "Settings", icon: FaCog },
];

function AdminLayout() {
  const { logout } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="admin-page">
      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#d4af37]/20 bg-black/35 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-5 rounded-lg border border-[#d4af37]/20 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d4af37]">
              Owner Panel
            </p>
            <h1 className="font-display mt-1 text-3xl font-bold text-[#f8dfa0]">
              {settings.storeName}
            </h1>
            <Link to="/" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:text-[#f8dfa0]">
              View Storefront <FaExternalLinkAlt />
            </Link>
          </div>
          <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border px-4 py-3 font-semibold transition ${
                    isActive
                      ? "border-[#d4af37]/60 bg-[#d4af37] text-black"
                      : "border-[#d4af37]/12 bg-white/[0.03] text-[#f7efd8] hover:border-[#d4af37]/45"
                  }`
                }
              >
                <link.icon />
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-3 rounded-lg border border-[#d4af37]/12 bg-white/[0.03] px-4 py-3 font-semibold text-[#f7efd8] transition hover:border-[#d4af37]/45"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </nav>
        </aside>
        <section className="min-w-0 p-4 md:p-6 lg:p-8">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default AdminLayout;
