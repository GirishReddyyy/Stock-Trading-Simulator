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
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-primary/30"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary"
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b px-6 py-4 transition-colors">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
            TradeSim
          </Link>
          <span className="px-2 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 capitalize border border-slate-200 dark:border-slate-700">
            {user?.role}
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navClass}>Dashboard</NavLink>
          <NavLink to="/market" className={navClass}>Market</NavLink>
          <NavLink to="/portfolio" className={navClass}>Portfolio</NavLink>
          <NavLink to="/transactions" className={navClass}>History</NavLink>
          <NavLink to="/analytics" className={navClass}>Analytics</NavLink>
          <NavLink to="/profile" className={navClass}>Profile</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin/market" className={navClass}>Admin</NavLink>
          )}
        </div>

        {/* USER + LOGOUT */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-red-500/20"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;