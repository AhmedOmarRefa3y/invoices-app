import { Prisma } from "@prisma/client";

type invoice = Prisma.InvoiceGetPayload<{
  include: {
    customer: true;
    lineItems: {
      include: {
        product: {
          include: {
            Parts: {
              include: {
                product: {
                  include: {
                    unit: true;
                  };
                };
              };
            };
            unit: true;
          };
        };
      };
    };
    payment: true;
  };
}>;

interface MergedItem {
  quantity: number;
  name: string;
  lineItemQuantity: number;
  unit: string | undefined;
}

export function ReleaseOrderData(invoices: invoice[], num: number) {
  let totalAmount = 0;
  const curruntInvoice: invoice | undefined = invoices.find((invoice) => invoice.number === num);

  if (curruntInvoice && curruntInvoice.lineItems) {
    curruntInvoice.lineItems.forEach((item) => {
      totalAmount += item.quantity * item.product.price;
    });
  }

  const items: MergedItem[] | undefined = curruntInvoice?.lineItems.flatMap((item) => {
    return {
      name: item.product.name,
      quantity: item.quantity,
      lineItemQuantity: item.quantity,
      unit: item.product.unit?.name,
    };
  });

  return {
    items,
    curruntInvoice,
  };
}
