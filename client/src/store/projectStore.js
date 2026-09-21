import { create } from "zustand";
import api from "../services/api";

const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get("/projects");

      set({
        projects: response.data.projects,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to fetch projects",
      });
    }
  },

  createProject: async (projectData) => {
    try {
      const response = await api.post("/projects", projectData);

      set((state) => ({
        projects: [response.data.project, ...state.projects],
      }));

      return response.data.project;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create project",
      );
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);

      set((state) => ({
        projects: state.projects.map((project) =>
          project._id === id ? response.data.project : project,
        ),
      }));

      return response.data.project;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);

      set((state) => ({
        projects: state.projects.filter((project) => project._id !== id),
      }));
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete project",
      );
    }
  },
}));

export default useProjectStore;
