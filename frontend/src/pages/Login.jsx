import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (currentUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await login(form);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      const targetPath =
        result.user?.role === "admin"
          ? "/admin"
          : typeof location.state?.from === "string"
          ? location.state.from
          : location.state?.from?.pathname || "/profile";

      navigate(targetPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[78vh] bg-[#0d0902] px-4 py-16 text-white">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-[#d4af37]/25 bg-white/[0.06] shadow-2xl backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[linear-gradient(145deg,rgba(212,175,55,.28),rgba(0,0,0,.2)),url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center lg:block" />
        <form onSubmit={submit} className="grid gap-5 p-7 md:p-10">
          <div>
            <p className="eyebrow">Welcome Back</p>
            <h1 className="font-display mt-2 text-5xl font-bold text-[#f8dfa0]">
              Login
            </h1>
            <p className="mt-3 text-[#d9c9a5]">
              Access your Love2Bazzar account or enter the admin credentials for the dashboard.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#f8dfa0]">Email</span>
            <span className="flex items-center gap-3 rounded-lg border border-[#d4af37]/30 bg-black/30 px-4">
              <FaEnvelope className="text-[#d4af37]" />
              <input
                className="min-h-12 flex-1 bg-transparent text-white outline-none placeholder:text-[#a99a76]"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="you@example.com"
                required
              />
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#f8dfa0]">Password</span>
            <span className="flex items-center gap-3 rounded-lg border border-[#d4af37]/30 bg-black/30 px-4">
              <FaLock className="text-[#d4af37]" />
              <input
                className="min-h-12 flex-1 bg-transparent text-white outline-none placeholder:text-[#a99a76]"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter password"
                required
              />
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-[#d9c9a5]">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setForm({ ...form, remember: event.target.checked })}
              />
              Remember me
            </label>
            <Link className="font-semibold text-[#d4af37]" to="/login">
              Forgot Password?
            </Link>
          </div>

          <button className="btn btn-gold w-full" type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
          <Link className="btn btn-light w-full" to="/signup">
            Create Account
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Login;
