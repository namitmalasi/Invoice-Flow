import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import useClientStore from "../../store/clientStore";
import useProjectStore from "../../store/projectStore";
import useInvoiceStore from "../../store/invoiceStore";

const createItem = () => ({
  description: "",
  quantity: 1,
  rate: "",
});

const InvoiceForm = ({ onSuccess, onCancel }) => {
  const { clients, fetchClients } = useClientStore();
  const { projects, fetchProjects } = useProjectStore();
  const { createInvoice } = useInvoiceStore();

  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    taxRate: 18,
    notes: "",
  });

  const [items, setItems] = useState([createItem()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, [fetchClients, fetchProjects]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, createItem()]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return total + quantity * rate;
    }, 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    const rate = Number(formData.taxRate) || 0;

    return subtotal * (rate / 100);
  }, [subtotal, formData.taxRate]);

  const total = subtotal + taxAmount;

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.clientId) {
      setError("Please select a client.");
      return;
    }

    if (!formData.dueDate) {
      setError("Please select a due date.");
      return;
    }

    const invalidItem = items.some(
      (item) =>
        !item.description.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.rate) < 0,
    );

    if (invalidItem) {
      setError("Please complete all invoice items correctly.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createInvoice({
        ...formData,
        taxRate: Number(formData.taxRate) || 0,
        items: items.map((item) => ({
          description: item.description.trim(),
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        })),
      });

      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Invoice information */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Invoice Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Client *
            </label>

            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-slate-400"
            >
              <option value="">Select client</option>

              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                  {client.company ? ` — ${client.company}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Project
            </label>

            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-slate-400"
            >
              <option value="">No project</option>

              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Issue Date *
            </label>

            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Due Date *
            </label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Invoice Items
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the services or products you're billing for.
            </p>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => {
            const amount =
              (Number(item.quantity) || 0) * (Number(item.rate) || 0);

            return (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-slate-100 p-4 md:grid-cols-[1fr_100px_140px_140px_auto]"
              >
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Description
                  </label>

                  <input
                    value={item.description}
                    onChange={(event) =>
                      handleItemChange(index, "description", event.target.value)
                    }
                    placeholder="Website Development"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Qty
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      handleItemChange(index, "quantity", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Rate
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(event) =>
                      handleItemChange(index, "rate", event.target.value)
                    }
                    placeholder="25000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Amount
                  </label>

                  <div className="flex h-[42px] items-center rounded-lg bg-slate-50 px-3 text-sm font-medium text-slate-700">
                    {formatCurrency(amount)}
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="rounded-lg p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="ml-auto max-w-sm space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="text-slate-500">Tax (%)</label>

            <input
              type="number"
              min="0"
              value={formData.taxRate}
              onChange={handleChange}
              name="taxRate"
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Tax Amount</span>

            <span className="font-medium text-slate-900">
              {formatCurrency(taxAmount)}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Total</span>

              <span className="text-xl font-bold text-slate-900">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Payment terms or additional information..."
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
