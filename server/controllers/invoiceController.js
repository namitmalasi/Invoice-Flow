import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import Project from "../models/Project.js";
import { generateInvoiceNumber } from "../utils/invoiceUtils.js";

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      userId: req.user._id,
    })
      .populate("clientId", "name email company")
      .populate("projectId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("clientId", "name email company phone address gstNumber")
      .populate("projectId", "name description");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const {
      clientId,
      projectId,
      issueDate,
      dueDate,
      items,
      taxRate = 0,
      notes,
    } = req.body;

    if (!clientId || !dueDate || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Client, due date and invoice items are required",
      });
    }

    // Verify client ownership
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

    // Verify project ownership if supplied
    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    // Calculate item amounts on the server
    const calculatedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const rate = Number(item.rate);

      return {
        description: item.description,
        quantity,
        rate,
        amount: quantity * rate,
      };
    });

    const subtotal = calculatedItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const numericTaxRate = Number(taxRate) || 0;
    const taxAmount = subtotal * (numericTaxRate / 100);
    const total = subtotal + taxAmount;

    const invoiceNumber = await generateInvoiceNumber(Invoice);

    const invoice = await Invoice.create({
      userId: req.user._id,
      clientId,
      projectId,
      invoiceNumber,
      issueDate: issueDate || new Date(),
      dueDate,
      items: calculatedItems,
      subtotal,
      taxRate: numericTaxRate,
      taxAmount,
      total,
      notes,
    });

    const populatedInvoice = await invoice.populate([
      {
        path: "clientId",
        select: "name email company phone address gstNumber",
      },
      {
        path: "projectId",
        select: "name description",
      },
    ]);

    res.status(201).json({
      success: true,
      invoice: populatedInvoice,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (["paid", "cancelled"].includes(invoice.status)) {
      return res.status(400).json({
        success: false,
        message: "This invoice cannot be edited",
      });
    }

    const {
      clientId,
      projectId,
      issueDate,
      dueDate,
      items,
      taxRate = 0,
      notes,
      status,
    } = req.body;

    if (!clientId || !dueDate || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Client, due date and invoice items are required",
      });
    }

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

    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id,
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    const calculatedItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const rate = Number(item.rate);

      return {
        description: item.description,
        quantity,
        rate,
        amount: quantity * rate,
      };
    });

    const subtotal = calculatedItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const numericTaxRate = Number(taxRate) || 0;
    const taxAmount = subtotal * (numericTaxRate / 100);
    const total = subtotal + taxAmount;

    invoice.clientId = clientId;
    invoice.projectId = projectId;
    invoice.issueDate = issueDate;
    invoice.dueDate = dueDate;
    invoice.items = calculatedItems;
    invoice.subtotal = subtotal;
    invoice.taxRate = numericTaxRate;
    invoice.taxAmount = taxAmount;
    invoice.total = total;
    invoice.notes = notes;

    if (status) {
      invoice.status = status;
    }

    await invoice.save();

    const populatedInvoice = await invoice.populate([
      {
        path: "clientId",
        select: "name email company phone address gstNumber",
      },
      {
        path: "projectId",
        select: "name description",
      },
    ]);

    res.json({
      success: true,
      invoice: populatedInvoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update invoice",
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Paid invoices cannot be deleted",
      });
    }

    await invoice.deleteOne();

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
    });
  }
};