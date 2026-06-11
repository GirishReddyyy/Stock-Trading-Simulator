import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-pb-accent text-pb-bg shadow-[0_4px_14px_rgba(212,163,115,0.25)]"
        : "text-pb-text-muted hover:bg-pb-card-hover hover:text-pb-text"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-pb-surface/90 backdrop-blur-md border-b border-pb-border px-6 py-4 transition-colors shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-pb-text tracking-tight">
            Trade<span className="text-pb-accent">Sim</span>
          </Link>
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-pb-card text-pb-text-sec uppercase tracking-widest border border-pb-border">
            {user?.role}
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navClass}>Dashboard</NavLink>
          <NavLink to="/market" className={navClass}>Market</NavLink>
          <NavLink to="/portfolio" className={navClass}>Portfolio</NavLink>
          <NavLink to="/watchlist" className={navClass}>Watchlist</NavLink>
          <NavLink to="/orders" className={navClass}>Your Orders</NavLink>
          <NavLink to="/transactions" className={navClass}>History</NavLink>
          <NavLink to="/analytics" className={navClass}>Analytics</NavLink>
          <NavLink to="/profile" className={navClass}>Profile</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin/market" className={navClass}>Admin</NavLink>
          )}
        </div>

        {/* USER + LOGOUT */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:block text-right">
            <p className="font-bold text-sm text-pb-text">{user?.name}</p>
            <p className="text-xs text-pb-text-muted uppercase tracking-wider">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-pb-loss hover:bg-pb-loss hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-pb-loss/30"
          >
            Sign Out
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;