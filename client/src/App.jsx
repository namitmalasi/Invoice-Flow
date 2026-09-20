import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Clients from "./pages/Clients";

import useAuthStore from "./store/authStore";

const App = () => {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/clients" element={<Clients />} />

        <Route
          path="/projects"
          element={
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="mt-2 text-slate-500">
                Project management coming soon.
              </p>
            </div>
          }
        />

        <Route
          path="/invoices"
          element={
            <div>
              <h1 className="text-2xl font-bold">Invoices</h1>
              <p className="mt-2 text-slate-500">
                Invoice management coming soon.
              </p>
            </div>
          }
        />

        <Route
          path="/payments"
          element={
            <div>
              <h1 className="text-2xl font-bold">Payments</h1>
              <p className="mt-2 text-slate-500">
                Payment management coming soon.
              </p>
            </div>
          }
        />

        <Route
          path="/analytics"
          element={
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="mt-2 text-slate-500">Analytics coming soon.</p>
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="mt-2 text-slate-500">Settings coming soon.</p>
            </div>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
