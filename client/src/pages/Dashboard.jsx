import useAuthStore from "../store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2 text-slate-500">
        Your InvoiceFlow dashboard will appear here.
      </p>
    </div>
  );
};

export default Dashboard;
