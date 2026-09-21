import Project from "../models/Project.js";
import Client from "../models/Client.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user._id,
    })
      .populate("clientId", "name email company")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("clientId", "name email company");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

export const createProject = async (req, res) => {
  try {
    const { clientId, name, description, status, startDate, dueDate, budget } =
      req.body;

    if (!clientId || !name) {
      return res.status(400).json({
        success: false,
        message: "Client and project name are required",
      });
    }

    // Make sure the client belongs to the logged-in user.
    const client = await Client.findOne({
      _id: clientId,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    const project = await Project.create({
      userId: req.user._id,
      clientId,
      name,
      description,
      status,
      startDate,
      dueDate,
      budget,
    });

    const populatedProject = await project.populate(
      "clientId",
      "name email company",
    );

    res.status(201).json({
      success: true,
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { clientId, name, description, status, startDate, dueDate, budget } =
      req.body;

    if (clientId) {
      const client = await Client.findOne({
        _id: clientId,
        userId: req.user._id,
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Client not found",
        });
      }
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        clientId,
        name,
        description,
        status,
        startDate,
        dueDate,
        budget,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("clientId", "name email company");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
