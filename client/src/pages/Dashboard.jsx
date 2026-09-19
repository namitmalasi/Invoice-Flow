import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  IndianRupee,
  Users,
  WalletCards,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const stats = [
  {
    title: "Total Revenue",
    value: "₹1,24,500",
    change: "+12.5%",
    positive: true,
    icon: IndianRupee,
  },
  {
    title: "Pending",
    value: "₹32,000",
    change: "+8.2%",
    positive: false,
    icon: WalletCards,
  },
  {
    title: "Invoices",
    value: "24",
    change: "+4 this month",
    positive: true,
    icon: FileText,
  },
  {
    title: "Clients",
    value: "12",
    change: "+2 this month",
    positive: true,
    icon: Users,
  },
];

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your business.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>

                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 p-2.5">
                  <Icon size={20} className="text-slate-700" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs">
                {stat.positive ? (
                  <ArrowUpRight size={14} className="text-green-600" />
                ) : (
                  <ArrowDownRight size={14} className="text-orange-600" />
                )}

                <span
                  className={
                    stat.positive ? "text-green-600" : "text-orange-600"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom sections */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Revenue chart placeholder */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Revenue Overview</h2>

              <p className="mt-1 text-sm text-slate-500">
                Your revenue over the last 6 months.
              </p>
            </div>
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-400">
            Revenue chart will appear here
          </div>
        </div>

        {/* Recent invoices */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Invoices</h2>

            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
              View all
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {[
              {
                id: "INV-1024",
                client: "ABC Technologies",
                amount: "₹25,000",
                status: "Paid",
              },
              {
                id: "INV-1023",
                client: "XYZ Studio",
                amount: "₹15,000",
                status: "Pending",
              },
              {
                id: "INV-1022",
                client: "Rahul Sharma",
                amount: "₹8,500",
                status: "Overdue",
              },
            ].map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {invoice.id}
                  </p>

                  <p className="text-xs text-slate-500">{invoice.client}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">
                    {invoice.amount}
                  </p>

                  <p
                    className={`text-xs ${
                      invoice.status === "Paid"
                        ? "text-green-600"
                        : invoice.status === "Overdue"
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {invoice.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
