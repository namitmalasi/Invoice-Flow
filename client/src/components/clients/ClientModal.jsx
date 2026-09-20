import { useEffect, useState } from "react";
import { X } from "lucide-react";
import useClientStore from "../../store/clientStore";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  gstNumber: "",
  notes: "",
};

const ClientModal = ({ client, onClose }) => {
  const { createClient, updateClient } = useClientStore();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(client);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        company: client.company || "",
        address: client.address || "",
        gstNumber: client.gstNumber || "",
        notes: client.notes || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [client]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditing) {
        await updateClient(client._id, formData);
      } else {
        await createClient(formData);
      }

      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? "Edit Client" : "Add Client"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your client's information"
                : "Add a new client to InvoiceFlow"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email *
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Company
              </label>

              <input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Rahul Designs"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Address
              </label>

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Delhi, India"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                GST Number
              </label>

              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Notes
              </label>

              <input
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Client"
                  : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
