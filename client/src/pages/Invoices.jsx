import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import InvoiceForm from "../components/invoices/InvoiceForm";

const Invoices = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <div>
        <button
          onClick={() => setShowForm(false)}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Invoices
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create Invoice</h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a professional invoice for your client.
          </p>
        </div>

        <InvoiceForm
          onSuccess={() => {
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage your invoices.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Create Invoice
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h3 className="font-semibold text-slate-900">Invoice management</h3>

        <p className="mt-1 text-sm text-slate-500">
          Your invoices will appear here.
        </p>
      </div>
    </div>
  );
};

export default Invoices;
