import { Bell, Menu } from "lucide-react";
import useAuthStore from "../../store/authStore";

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      {/* Mobile menu */}
      <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
        <Menu size={20} />
      </button>

      <div className="ml-auto flex items-center gap-4">
        {/* Notification */}
        <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>

            <p className="text-xs text-slate-500">Freelancer</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
