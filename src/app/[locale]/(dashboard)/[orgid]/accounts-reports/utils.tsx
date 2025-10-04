import prismaDb from "@/lib/prisma";

export const GetCustomersBalances = async ({ orgid }: { orgid: string }) => {
  const organization = await prismaDb.organization.findUnique({
    where: {
      id: orgid,
    },
    select: {
      Customer: {
        include: {
          invoices: {
            include: {
              lineItems: true,
            },
          },
          Payment: true,
          ReturnedInvoice: {
            include: {
              lineItems: true,
            },
          },
          PurchaseInvoice: {
            include: {
              lineItems: true,
            },
          },
          PaymentToSupplier: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  const CustomersBalance = organization?.Customer.map((customer) => {
    let TotalInvoicesAmount = 0;
    let TotalPurchaseInvoicesAmount = 0;
    let TotalRetInvoicesAmount = 0;
    let Totalpayments = 0;
    let TotalPaymentsToSupplier = 0;

    // Use forEach instead of map for side effects
    customer.invoices.forEach((invoice) => {
      TotalInvoicesAmount += invoice.amount;
    });

    // Use forEach instead of map for side effects
    customer.Payment.forEach((payment) => {
      Totalpayments += payment.amount;
    });

    // Use forEach instead of map for side effects
    customer.ReturnedInvoice.forEach((RetInvoice) => {
      TotalRetInvoicesAmount += RetInvoice.amount;
    });

    // Use forEach instead of map for side effects
    customer.PurchaseInvoice.forEach((PurchaseInvoice) => {
      TotalPurchaseInvoicesAmount += PurchaseInvoice.amount;
    });

    let itemsNumber = 0;
    customer.invoices.forEach((item) => {
      item.lineItems.forEach(() => {
        itemsNumber += 1;
      });
    });
    customer.PaymentToSupplier.forEach((payment) => {
      TotalPaymentsToSupplier += payment.amount;
    });

    return {
      id: customer.id,
      name: customer.name,
      CustomerCredit: customer.CustomerCredit,
      customerRecordsNumber:
        customer.Payment.length + customer.ReturnedInvoice.length + customer.invoices.length,
      customerRecordsNumberWithitems:
        customer.Payment.length + customer.ReturnedInvoice.length + itemsNumber,
      CustomerTotalDebit: TotalInvoicesAmount,
      CustomerTotalCredit: Totalpayments + TotalRetInvoicesAmount,
      TotalInvoicesAmount,
      Totalpayments,
      TotalRetInvoicesAmount,
      TotalPurchaseInvoicesAmount,
      TotalPaymentsToSupplier,
      IsASupplier: customer.IsASupplier,
      currntBalance:
        TotalInvoicesAmount +
        TotalPaymentsToSupplier -
        (Totalpayments + TotalRetInvoicesAmount + TotalPurchaseInvoicesAmount) +
        customer.CustomerCredit,
    };
  });
  const jsonString = JSON.stringify(CustomersBalance);
  const sizeInBytes = Buffer.byteLength(jsonString, "utf8");
  const sizeInKB = sizeInBytes / 1024;

  const sizeInMB = sizeInKB / 1024;
  console.log(`Data size: ${sizeInMB.toFixed(2)} MB`);
  return CustomersBalance;
};
