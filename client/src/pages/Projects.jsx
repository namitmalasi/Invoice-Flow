import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, FolderKanban } from "lucide-react";

import useProjectStore from "../store/projectStore";
import ProjectModal from "../components/projects/ProjectModal";

const Projects = () => {
  const { projects, loading, error, fetchProjects, deleteProject } =
    useProjectStore();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(id);
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const searchTerm = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(searchTerm) ||
      project.clientId?.name?.toLowerCase().includes(searchTerm) ||
      project.clientId?.company?.toLowerCase().includes(searchTerm)
    );
  });

  const getStatusClasses = (status) => {
    const classes = {
      active: "bg-green-50 text-green-700",
      completed: "bg-blue-50 text-blue-700",
      "on-hold": "bg-yellow-50 text-yellow-700",
    };

    return classes[status] || "bg-slate-100 text-slate-600";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>

          <p className="mt-1 text-sm text-slate-500">
            Track your client projects and budgets.
          </p>
        </div>

        <button
          onClick={handleAddProject}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Project
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
            placeholder="Search projects..."
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
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FolderKanban size={22} className="text-slate-500" />
          </div>

          <h3 className="font-semibold text-slate-900">
            {search ? "No projects found" : "No projects yet"}
          </h3>

          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create a project and connect it to one of your clients."}
          </p>

          {!search && (
            <button
              onClick={handleAddProject}
              className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
            >
              Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Project
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Due Date
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Budget
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {project.name}
                        </p>

                        {project.description && (
                          <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {project.clientId?.name || "-"}
                      </p>

                      {project.clientId?.company && (
                        <p className="text-xs text-slate-500">
                          {project.clientId.company}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                          project.status,
                        )}`}
                      >
                        {project.status.replace("-", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {project.dueDate
                        ? new Date(project.dueDate).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td className="px-5 py-4 text-right text-sm font-medium text-slate-700">
                      ₹{Number(project.budget || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit project"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete project"
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
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            setShowModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export default Projects;
