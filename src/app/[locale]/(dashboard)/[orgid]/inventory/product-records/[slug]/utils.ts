import prismaDb from "@/lib/prisma";
import { startOfYear } from "date-fns";

interface Record {
  date: Date | undefined;
  type: "out" | "in";
  recordName: string;
  quantity: number;
  link?: string;
  translationKey?: string; // Key used by client component
  translationValues?: { [key: string]: any }; // Values passed to translation
}

export const getInventoryRecords = async (id: string, orgid: string) => {
  const product = await prismaDb.product.findFirst({
    where: { id, organizationId: orgid },
  });

  const allRecords: Record[] = [];

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

  allRecords.push({
    date: startOfYear(new Date()),
    quantity: product?.initialquantity || 0,
    type: "in",
    recordName: `openingBalance`,
    translationKey: "openingBalance",
  });
  LineItems.map((item) => {
    if (item.invoice) {
      allRecords.push({
        date: item.invoice?.date,
        quantity: item.quantity,
        type: "out",
        recordName: `invoiceForCustomer`,
        link: `/${orgid}/sales/showInvoice/${item.invoice.number}`,
        translationKey: "invoiceForCustomer",
        translationValues: {
          number: item.invoice.number,
          name: item.invoice.customer.name,
        },
      });
    }

    if (item.ReturnedInvoice) {
      allRecords.push({
        date: item.ReturnedInvoice.date,
        quantity: item.quantity,
        type: "in",
        recordName: `returnInvoiceForCustomer`,
        link: `/${orgid}/returnedInvoices/showREtInvoice?num=${item.ReturnedInvoice.number}`,
        translationKey: "returnInvoiceForCustomer",
        translationValues: {
          number: item.ReturnedInvoice.number,
          name: item.ReturnedInvoice.customer.name,
        },
      });
    }

    if (item.ProductionEvent) {
      if (item.isProduction) {
        allRecords.push({
          date: item.ProductionEvent.producedAt,
          quantity: item.quantity,
          type: "in",
          recordName: `receivedFromProductionOrder`,
          link: `/${orgid}/production-orders/${item.ProductionEvent.id}`,
          translationKey: "receivedFromProductionOrder",
          translationValues: {
            number: item.ProductionEvent.number,
          },
        });
      }
      if (item.isReduction) {
        allRecords.push({
          date: item.ProductionEvent.producedAt,
          quantity: item.quantity,
          type: "out",
          recordName: `issuedToProductionOrder`,
          link: `/${orgid}/production-orders/${item.ProductionEvent.id}`,
          translationKey: "issuedToProductionOrder",
          translationValues: {
            number: item.ProductionEvent.number,
          },
        });
      }
    }

    if (item.PurchaseInvoice) {
      allRecords.push({
        date: item.PurchaseInvoice.date,
        quantity: item.quantity,
        type: "in",
        recordName: `purchaseInvoiceForSupplier`,
        link: `/${orgid}/purchases_invocies/showInvoice?num=${item.PurchaseInvoice.number}`,
        translationKey: "purchaseInvoiceForSupplier",
        translationValues: {
          number: item.PurchaseInvoice.number,
          name: item.PurchaseInvoice.Supplier.name,
        },
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
