import { useEffect, useState } from "react";
import { X } from "lucide-react";

import useProjectStore from "../../store/projectStore";
import useClientStore from "../../store/clientStore";

const initialForm = {
  clientId: "",
  name: "",
  description: "",
  status: "active",
  startDate: "",
  dueDate: "",
  budget: "",
};

const ProjectModal = ({ project, onClose }) => {
  const { createProject, updateProject } = useProjectStore();
  const { clients, fetchClients } = useClientStore();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(project);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (project) {
      setFormData({
        clientId: project.clientId?._id || "",
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
        startDate: project.startDate ? project.startDate.split("T")[0] : "",
        dueDate: project.dueDate ? project.dueDate.split("T")[0] : "",
        budget: project.budget || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [project]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.clientId || !formData.name) {
      setError("Client and project name are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = {
        ...formData,
        budget: Number(formData.budget) || 0,
      };

      if (isEditing) {
        await updateProject(project._id, data);
      } else {
        await createProject(data);
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? "Edit Project" : "Add Project"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update project information"
                : "Create a new project for a client"}
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

          <div className="space-y-4">
            {/* Client */}
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
                <option value="">Select a client</option>

                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                    {client.company ? ` — ${client.company}` : ""}
                  </option>
                ))}
              </select>

              {clients.length === 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  Add a client before creating a project.
                </p>
              )}
            </div>

            {/* Project name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Project Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E-commerce Website"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Briefly describe the project..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-slate-400"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Budget
                </label>

                <input
                  type="number"
                  min="0"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
                />
              </div>

              {/* Start date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-slate-400"
                />
              </div>

              {/* Due date */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Due Date
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
              disabled={loading || clients.length === 0}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
