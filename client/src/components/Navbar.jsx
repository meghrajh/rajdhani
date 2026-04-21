import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield, FaUser } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Rooms", to: "/rooms" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-maroon-100/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-lg font-bold text-white shadow-card">
            RP
          </div>
          <div>
            <p className="font-heading text-xl font-semibold text-maroon sm:text-2xl">Hotel Rajdhani Palace</p>
            <p className="text-xs uppercase tracking-[0.35em] text-maroon-700/70">Stay with royal comfort</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "text-sm font-semibold uppercase tracking-[0.18em] transition",
                  isActive ? "text-maroon" : "text-ink/75 hover:text-maroon",
                ].join(" ")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-maroon px-4 py-2 text-sm font-semibold text-maroon transition hover:bg-maroon hover:text-white"
              >
                {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink hover:text-maroon">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white transition hover:bg-maroon-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-maroon-200 text-maroon md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-maroon-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  [
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-maroon text-white" : "bg-ivory text-ink",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-maroon px-4 py-3 text-sm font-semibold text-maroon"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="rounded-2xl bg-ink px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-maroon-200 px-4 py-3 text-sm font-semibold text-ink">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-2xl bg-maroon px-4 py-3 text-sm font-semibold text-white">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
