import prismaDb from "@/lib/prisma";
import { startOfYear } from "date-fns";

interface record {
  date: Date | undefined;
  type: "out" | "in";
  recordName: string;
  quantity: number;
  link?: string;
}
export const getInventoryRecords = async (id: string, orgid: string) => {
  const product = await prismaDb.product.findFirst({
    where: { id, organizationId: orgid },
  });
  const allRecords: record[] = [];
  const LineItems = await prismaDb.lineItem.findMany({
    include: {
      invoice: {
        include: {
          customer: true,
        },
      },
      ProductionEvent: true,
      ReturnedInvoice: {
        include: {
          customer: true,
        },
      },
      PurchaseInvoice: {
        include: {
          Supplier: true,
        },
      },
    },
    where: {
      productId: id,
    },
  });
  LineItems.map((item) => {
    if (item.invoice) {
      allRecords.push({
        date: item.invoice?.date,
        quantity: item.quantity,
        type: "out",
        recordName: `Invoice number ${item.invoice?.number} for customer ${item.invoice?.customer.name}`,
        link: `/${orgid}/sales/showInvoice/${item.invoice.number}`,
      });
    }
    if (item.ReturnedInvoice) {
      allRecords.push({
        date: item.ReturnedInvoice.date,
        quantity: item.quantity,
        type: "in",
        recordName: `Returns invoice number ${item.ReturnedInvoice.number} for customer ${item.ReturnedInvoice.customer.name}`,
        link: `/${orgid}/returnedInvoices/showREtInvoice?num=${item.ReturnedInvoice.number}`,
      });
    }
    if (item.ProductionEvent) {
      if (item.isProduction) {
        allRecords.push({
          date: item.ProductionEvent.producedAt,
          quantity: item.quantity,
          type: "in",
          recordName: "Received from production order number " + item.ProductionEvent.number,
          link: `/${orgid}/production-orders/${item.ProductionEvent.id}`,
        });
      }
      if (item.isReduction) {
        allRecords.push({
          date: item.ProductionEvent.producedAt,
          quantity: item.quantity,
          type: "out",
          recordName: "Issued to production order number " + item.ProductionEvent.number,
          link: `/${orgid}/production-orders/${item.ProductionEvent.id}`,
        });
      }
    }
    if (item.initialquantitiesId) {
      allRecords.push({
        date: startOfYear(new Date()),
        quantity: item.quantity,
        type: "in",
        recordName: `Opening Balance`,
        link: `/${orgid}/inventory/initial-quantities/2024`,
      });
    }

    if (item.PurchaseInvoice) {
      allRecords.push({
        date: item.PurchaseInvoice.date,
        quantity: item.quantity,
        type: "in",
        recordName: `Purchase invoice number ${item.PurchaseInvoice.number} for supplier ${item.PurchaseInvoice.Supplier.name}`,
        link: `/${orgid}/purchases_invocies/showInvoice?num=${item.PurchaseInvoice.number}`,
      });
    }
  });

  allRecords.sort((a, b) => {
    const dateA = a.date?.getTime() || 0;
    const dateB = b.date?.getTime() || 0;

    return dateA - dateB;
  });
  return { allRecords, product };
};
