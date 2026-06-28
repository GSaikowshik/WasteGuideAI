import { Link, NavLink } from "react-router-dom";
import { FaRecycle } from "react-icons/fa";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-green-300 font-semibold"
      : "hover:text-green-200 transition";

  return (
    <nav className="bg-green-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <FaRecycle />
          WasteGuide AI
        </Link>

        <div className="flex gap-6">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>

          <NavLink to="/map" className={linkClass}>
            Collection Map
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;