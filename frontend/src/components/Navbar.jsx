import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

const Navbar = () => {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login"
    );
  };

  const navClass =
    ({ isActive }) =>
      `
      px-3
      py-2
      rounded-lg
      transition
      ${
        isActive
          ? "bg-green-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-green-400"
      }
    `;

  return (

    <nav
      className="
        bg-slate-900
        text-white
        px-6
        py-4
        shadow-md
      "
    >

      <div
        className="
          flex
          justify-between
          items-center
        "
      >

        {/* LOGO */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <Link
            to="/"
            className="
              text-2xl
              font-bold
              text-green-400
            "
          >
            TradeSim
          </Link>

          <span
            className="
              text-sm
              text-slate-400
              capitalize
            "
          >
            {user?.role}
          </span>

        </div>

        {/* NAV LINKS */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <NavLink
            to="/"
            className={navClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/portfolio"
            className={navClass}
          >
            Portfolio
          </NavLink>

          <NavLink
            to="/transactions"
            className={navClass}
          >
            History
          </NavLink>

          <NavLink
            to="/analytics"
            className={navClass}
          >
            Analytics
          </NavLink>

          <NavLink
            to="/profile"
            className={navClass}
          >
            Profile
          </NavLink>

          {user?.role ===
            "admin" && (

            <NavLink
              to="/admin/market"
              className={navClass}
            >
              Admin
            </NavLink>
          )}

        </div>

        {/* USER + LOGOUT */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

          <div
            className="
              text-right
            "
          >

            <p
              className="
                font-semibold
              "
            >
              {user?.name}
            </p>

            <p
              className="
                text-xs
                text-slate-400
                capitalize
              "
            >
              {user?.role}
            </p>

          </div>

          <button
            onClick={logout}
            className="
              bg-red-500
              hover:bg-red-600
              px-4
              py-2
              rounded-lg
            "
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;