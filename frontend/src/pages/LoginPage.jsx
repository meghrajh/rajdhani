import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || location.state?.redirectTo || "/dashboard";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await login(formData);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(
        loginError.response?.data?.message
          || (loginError.request ? "Unable to reach the server. Please try again in a moment." : "")
          || "Login failed. Please check your details.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-maroon-100 bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-maroon-500">Welcome back</p>
        <h1 className="mt-3 font-heading text-4xl text-maroon">Login to your account</h1>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-ink">
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" minLength="6" required />
          </label>
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
          <button type="submit" disabled={busy} className="w-full rounded-full bg-maroon px-5 py-3 font-semibold text-white transition hover:bg-maroon-800 disabled:cursor-not-allowed disabled:bg-maroon-300">
            {busy ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 text-sm text-ink/70">
          New here? <Link to="/signup" className="font-semibold text-maroon">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
