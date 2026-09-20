import Client from "../models/Client.js";

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
    });
  }
};

export const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch client",
    });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, address, gstNumber, notes } =
      req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const client = await Client.create({
      userId: req.user._id,
      name,
      email,
      phone,
      company,
      address,
      gstNumber,
      notes,
    });

    res.status(201).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create client",
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update client",
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete client",
    });
  }
};