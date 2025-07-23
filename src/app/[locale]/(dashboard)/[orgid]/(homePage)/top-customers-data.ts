import prismaDb from "@/lib/prisma";
import { startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";

export type Period = "year" | "month";

export async function getTopCustomers(orgid: string, period: Period) {
  const dateRange =
    period === "year"
      ? { start: startOfYear(new Date()), end: endOfYear(new Date()) }
      : { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };

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
    },
  });

  return customers
    .map((customer) => ({
      id: customer.id,
      name: customer.name,
      totalAmount: customer.invoices.reduce((total, invoice) => total + invoice.amount, 0),
      invoiceCount: customer.invoices.length,
    }))
    .filter((customer) => customer.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount);
}
