import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      await register(formData);
      navigate("/dashboard", { replace: true });
    } catch (registerError) {
      setError(registerError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-[2rem] border border-maroon-100 bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-maroon-500">Create account</p>
        <h1 className="mt-3 font-heading text-4xl text-maroon">Start booking with confidence</h1>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-ink">
            Full Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-maroon-100 bg-ivory px-4 py-3 outline-none focus:border-maroon" required />
          </label>
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
            {busy ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-5 text-sm text-ink/70">
          Already registered? <Link to="/login" className="font-semibold text-maroon">Login instead</Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
