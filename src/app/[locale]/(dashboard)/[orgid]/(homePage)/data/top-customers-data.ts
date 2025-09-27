import prismaDb from "@/lib/prisma";
import { startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";

export type Period = "year" | "month";

export async function getTopCustomers(orgid: string, period: Period) {
  const dateRange =
    period === "year"
      ? { start: startOfYear(new Date()), end: endOfYear(new Date()) }
      : { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };

  // Get all customers with invoices in the specified date range
  const customers = await prismaDb.customer.findMany({
    where: {
      organizationId: orgid,
      invoices: {
        some: {
          amount: { gt: 0 },
          date: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
          organizationId: orgid,
        },
      },
    },
    include: {
      invoices: {
        where: {
          date: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
          organizationId: orgid,
        },
      },
      ReturnedInvoice: {
        where: {
          date: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
          organizationId: orgid,
        },
      },
    },
  });

  return customers
    .map((customer) => {
      // Calculate total sales for the customer
      const totalSales = customer.invoices.reduce((total, invoice) => total + invoice.amount, 0);
      // Calculate total returns for the customer
      const totalReturns = customer.ReturnedInvoice.reduce((total, returnedInvoice) => total + returnedInvoice.amount, 0);
      // Calculate net sales (sales - returns)
      const netSales = totalSales - totalReturns;
      
      return {
        id: customer.id,
        name: customer.name,
        totalAmount: netSales,
        invoiceCount: customer.invoices.length,
        returnCount: customer.ReturnedInvoice.length,
      };
    })
    .filter((customer) => customer.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);
}
