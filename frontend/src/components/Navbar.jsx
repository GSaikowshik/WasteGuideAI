import { Link, useLocation } from "react-router-dom";
import { FaRecycle, FaChartBar, FaMapMarkedAlt, FaSearch } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "AI Scanner", icon: <FaSearch className="text-lg" /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaChartBar className="text-lg" /> },
    { path: "/map", label: "Interactive Map", icon: <FaMapMarkedAlt className="text-lg" /> }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-zinc-950/80 border-b border-zinc-800/60 shadow-lg px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
            <FaRecycle className="text-emerald-400 text-2xl animate-spin-slow" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-300">
              WasteGuide <span className="text-emerald-400">AI</span>
            </span>
            <span className="hidden sm:block text-[10px] text-zinc-500 font-medium">Smart Waste Management</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 font-bold scale-100"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
