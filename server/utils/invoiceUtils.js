export const generateInvoiceNumber = async (Invoice) => {
  const year = new Date().getFullYear();

  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^INV-${year}-`),
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastInvoice) {
    const lastNumber = Number(lastInvoice.invoiceNumber.split("-")[2]);

    nextNumber = lastNumber + 1;
  }

  return `INV-${year}-${String(nextNumber).padStart(4, "0")}`;
};
