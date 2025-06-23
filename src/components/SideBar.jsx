import { NavLink } from "react-router-dom";
import Logo from "/public/solialogo.svg"

const navItems = [
  { name: "Dashboard", path: "dashboard" },
  { name: "Users", path: "users" },
  { name: "Mining Settings", path: "mining" },
  { name: "Referrals", path: "referrals" },
  { name: "Airdrops", path: "airdrops" },
];

// border-2 border-red-500 tool
export default function Sidebar() {
  return (
    <aside className="h-screen w-64 bg-[#0d0f10] text-white flex flex-col justify-between py-6">
      <div>
        <div className="flex px-6">
            <img className="h-8 w-auto" src={Logo} alt="logo" />
            <h1 className="text-2xl font-bold text-white mb-8 px-3">Solia</h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block w-full px-6 py-3 rounded-none text-left transition-colors ${
                    isActive
                        ? "bg-[#030712] text-white-400 font-semibold"
                        : "hover:bg-[#1a1f24] hover:text-white-300"
                    }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <NavLink
        to="/signout"
        className="block mt-6 px-4 py-2 text-purple-400 hover:text-red-300 transition"
      >
        Sign Out
      </NavLink>
    </aside>
  );
}

