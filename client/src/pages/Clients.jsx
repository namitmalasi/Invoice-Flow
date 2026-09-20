import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";

import useClientStore from "../store/clientStore";
import ClientModal from "../components/clients/ClientModal";

const Clients = () => {
  const { clients, loading, error, fetchClients, deleteClient } =
    useClientStore();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleDeleteClient = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (!confirmed) return;

    try {
      await deleteClient(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredClients = clients.filter((client) => {
    const searchTerm = search.toLowerCase();

    return (
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.company?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your clients and their information.
          </p>
        </div>

        <button
          onClick={handleAddClient}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading clients...
        </div>
      ) : filteredClients.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Users size={22} className="text-slate-500" />
          </div>

          <h3 className="font-semibold text-slate-900">
            {search ? "No clients found" : "No clients yet"}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Add your first client to start creating invoices."}
          </p>

          {!search && (
            <button
              onClick={handleAddClient}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Add Your First Client
            </button>
          )}
        </div>
      ) : (
        /* Client table */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {client.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {client.name}
                          </p>

                          <p className="text-sm text-slate-500">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {client.company || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {client.phone || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit client"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteClient(client._id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete client"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ClientModal
          client={selectedClient}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;
