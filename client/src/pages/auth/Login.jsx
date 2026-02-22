import { useState } from "react";
import { FaArrowRight, FaChartLine, FaBolt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const FEATURES = [
  { icon: "🔐", label: "JWT Secure",  desc: "Token-based auth" },
  { icon: "🗄️", label: "MySQL Ready", desc: "Relational DB" },
  { icon: "👑", label: "Owner First",  desc: "Role-based access" },
];

const Login = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      login(res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[1.15fr_0.85fr]">

      {/* ── Left branding panel ── */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center gap-14 p-14">
        {/* subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(124,58,237,0.35) 0%, transparent 70%)," +
              "radial-gradient(ellipse 40% 40% at 75% 70%, rgba(20,184,166,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Main content */}
        <div className="relative">
          {/* Logo */}
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
            <FaChartLine className="text-blue-400" />
            <span className="text-sm font-black tracking-wide text-white">BUZ</span>
          </div>

          <h1 className="mt-12 max-w-md text-[2.75rem] font-black leading-[1.15] tracking-tight text-white">
            Run your business<br />
            <span className="text-blue-400">from one dashboard.</span>
          </h1>

          <p className="mt-5 max-w-sm text-[15px] leading-7 text-slate-400">
            Authentication, business records, money tracking, billing, reminders,
            and operations — all in one SaaS platform.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative grid grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm"
            >
              <span className="text-2xl">{f.icon}</span>
              <p className="mt-3 text-sm font-bold text-white">{f.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Right login form ── */}
      <section className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-6 py-12">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600">
              <FaBolt className="text-xs text-white" />
            </div>
            <span className="text-sm font-black text-slate-900">BUZ</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Sign in to BUZ
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Continue to your business command center.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <span className="mt-0.5 text-xs">⚠️</span>
                <p className="text-xs font-semibold text-rose-700">{error}</p>
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <span className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                    Forgot password?
                  </span>
                </div>
                <input
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  name="password"
                  onChange={handleChange}
                  placeholder="Your password"
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
                  <span className="animate-pulse">Signing in…</span>
                ) : (
                  <>Sign in <FaArrowRight className="text-xs" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              New to BUZ?{" "}
              <Link className="font-bold text-blue-600 hover:underline" to="/register">
                Create account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Protected by JWT · Data stays yours
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;