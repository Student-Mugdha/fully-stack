import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const renderNavItems = () => {
    return (
      <>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/about-us">About</Link>
        </li>
        <li>
          <Link to="/vendors/details">Vendors</Link>
        </li>
      </>
    );
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {renderNavItems()}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          FruitBox
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{renderNavItems()}</ul>
      </div>
      <div className="navbar-end">
        <div className="flex items-center gap-4">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login/user")}
            >
              User Login
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/login/vendor")}
            >
              Vendor Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
