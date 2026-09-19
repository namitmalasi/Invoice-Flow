import {
  BarChart3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Clients",
    path: "/clients",
    icon: Users,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Invoices",
    path: "/invoices",
    icon: FileText,
  },
  {
    name: "Payments",
    path: "/payments",
    icon: WalletCards,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            I
          </div>

          <span className="text-lg font-bold text-slate-900">InvoiceFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
