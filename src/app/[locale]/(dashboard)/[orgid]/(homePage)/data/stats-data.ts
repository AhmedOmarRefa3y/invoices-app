"use server";
import prismaDb from "@/lib/prisma";
import { endOfMonth, subMonths } from "date-fns";

export const GetCustomerBalancesComparison = async ({ orgid }: { orgid: string }) => {
  const now = new Date();
  const endOfPreviousMonth = endOfMonth(subMonths(now, 1));
  const endOfToday = now;

  const organization = await prismaDb.organization.findUnique({
    where: { id: orgid },
    select: {
      Customer: {
        include: {
          invoices: true,
          Payment: true,
          ReturnedInvoice: true,
          PurchaseInvoice: true,
        },
      },
    },
  });

  const calcTotalBalanceUpTo = (cutoffDate: Date) => {
    let totalInvoices = 0;
    let totalPayments = 0;
    let totalReturned = 0;
    let totalPurchases = 0;
    let totalCredits = 0;

    organization?.Customer.forEach((customer) => {
      totalCredits += customer.CustomerCredit;

      customer.invoices.forEach((inv) => {
        if (inv.date <= cutoffDate) totalInvoices += inv.amount;
      });

      customer.Payment.forEach((pay) => {
        if (pay.date <= cutoffDate) totalPayments += pay.amount;
      });

      customer.ReturnedInvoice.forEach((ret) => {
        if (ret.date <= cutoffDate) totalReturned += ret.amount;
      });

      customer.PurchaseInvoice.forEach((pur) => {
        if (pur.date <= cutoffDate) totalPurchases += pur.amount;
      });
    });

    const balance = totalInvoices - (totalPayments + totalReturned + totalPurchases) + totalCredits;

    return {
      totalInvoices,
      totalPayments,
      totalReturned,
      totalPurchases,
      totalCredits,
      balance,
    };
  };

  const previousMonth = calcTotalBalanceUpTo(endOfPreviousMonth);
  const currentDay = calcTotalBalanceUpTo(endOfToday);

  return {
    previousMonth,
    currentDay,
    difference: currentDay.balance - previousMonth.balance,
  };
};
