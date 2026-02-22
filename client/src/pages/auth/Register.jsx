import { useState } from "react";
import { FaArrowRight, FaBolt, FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const PERKS = [
  "Layered backend architecture",
  "JWT authentication and role support",
  "MySQL business data model",
  "Multi-business workspace support",
];

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "OWNER",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1fr_1fr]">

      {/* ── Left branding panel ── */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center gap-14 p-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 25% 25%, rgba(124,58,237,0.3) 0%, transparent 70%)," +
              "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(99,102,241,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Main content */}
        <div className="relative">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600">
              <FaBolt className="text-sm text-white" />
            </div>
            <span className="text-base font-black tracking-wide text-white">BUZ</span>
          </div>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-blue-400">
            Business OS
          </p>
          <h1 className="mt-4 max-w-md text-[2.5rem] font-black leading-[1.2] tracking-tight text-white">
            Create your<br />owner account.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-400">
            Start with secure login, then connect businesses, teams, income,
            expenses, bills, and reminders.
          </p>

          <ul className="mt-8 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30 text-blue-400">
                  <FaCheck className="text-[9px]" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-slate-600">
          © 2026 BUZ · All rights reserved
        </p>
      </section>

      {/* ── Right register form ── */}
      <section className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-12">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600">
              <FaBolt className="text-xs text-white" />
            </div>
            <span className="text-sm font-black text-slate-900">BUZ</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
              Start workspace
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Takes less than a minute to get started.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <span className="mt-0.5 text-xs">⚠️</span>
                <p className="text-xs font-semibold text-rose-700">{error}</p>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <input
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  name="name"
                  onChange={handleChange}
                  placeholder="John Doe"
                  value={formData.name}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Email</label>
                <input
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  name="email"
                  onChange={handleChange}
                  placeholder="owner@buz.com"
                  type="email"
                  value={formData.email}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <input
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  name="password"
                  onChange={handleChange}
                  placeholder="Use a strong password"
                  type="password"
                  value={formData.password}
                />
              </div>

              <button
                disabled={loading}
                className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                type="submit"
              >
                {loading ? (
                  <span className="animate-pulse">Creating account…</span>
                ) : (
                  <>Create account <FaArrowRight className="text-xs" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link className="font-bold text-blue-600 hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            By registering you agree to BUZ's Terms & Privacy Policy
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;