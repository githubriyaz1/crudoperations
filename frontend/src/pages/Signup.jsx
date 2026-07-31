import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await signup(form);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate("/profile", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell bg-[#0d0902] text-white">
      <form
        onSubmit={submit}
        className="mx-auto grid max-w-2xl gap-5 rounded-lg border border-[#d4af37]/25 bg-white/[0.06] p-7 shadow-2xl backdrop-blur md:p-10"
      >
        <div className="text-center">
          <p className="eyebrow">Join Love2Bazzar</p>
          <h1 className="font-display mt-2 text-5xl font-bold text-[#f8dfa0]">
            Create Account
          </h1>
        </div>
        {error && (
          <p className="rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100">
            {error}
          </p>
        )}
        <input className="input" required placeholder="Full Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="input" required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="input" required type="tel" placeholder="Phone Number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" required type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <input className="input" required type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
        </div>
        <button className="btn btn-gold w-full" type="submit" disabled={submitting}>
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
        <p className="text-center text-[#d9c9a5]">
          Already have account?{" "}
          <Link className="font-semibold text-[#d4af37]" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Signup;
