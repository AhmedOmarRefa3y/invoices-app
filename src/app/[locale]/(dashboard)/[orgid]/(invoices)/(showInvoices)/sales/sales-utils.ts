import prismaDb from "@/lib/prisma";
import { invoiceTableT } from "./columns";
import { endOfYear, lastDayOfMonth, startOfMonth, startOfYear } from "date-fns";

export async function GetSalesInvoices(ORG_ID: string) {
  const invoices = await prismaDb.invoice.findMany({
    where: {
      organizationId: ORG_ID,
    },
    include: {
      customer: {
        include: {
          Payment: true,
        },
      },
      orders: {
        include: {
          Product: true,
        },
      },
      payment: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // current Month Sales
  const start = startOfMonth(new Date());
  const lastDay = lastDayOfMonth(new Date());

  const currentMonthSales = invoices
    .filter((item) => item.date >= start && item.date <= lastDay)
    .reduce((a, b) => a + b.amount, 0);
  const currentYearSales = invoices
    .filter((item) => item.date >= startOfYear(new Date()) && item.date <= endOfYear(new Date()))
    .reduce((a, b) => a + b.amount, 0);

  // console.log(currentYearSales);

  async function getCustomerSales() {
    const customers = await prismaDb.customer.findMany({
      where: {
        organizationId: ORG_ID,
      },
      select: {
        invoices: {
          where: {
            date: {
              gte: startOfYear(new Date()),
              lte: endOfYear(new Date()),
            },
            organizationId: ORG_ID,
          },
          select: {
            amount: true,
          },
        },
        name: true,
        id: true,
      },
    });

    const customerSales = customers
      .map((customer) => {
        const totalInvoiceAmount = customer.invoices.reduce(
          (total, invoice) => total + invoice.amount,
          0
        );

        const totalSales = totalInvoiceAmount;

        return {
          customerId: customer.id,
          customerName: customer.name,
          totalSales,
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales);

    return customerSales;
  }

  const customersSales = await getCustomerSales();

  const FormatedInvoices: invoiceTableT[] = invoices.map((item) => {
    return {
      id: item.id,
      number: item.number,
      customerName: item.customer.name,
      date: item.date,
      PaidAmount: item.payment?.amount || 0,
      CreatedAt: item.createdAt,
      amount: item.amount,
      orgid: item.organizationId,
      // customer: item.customer,
    };
  });

  const result = {
    FormatedInvoices,
    currentMonthSales,
    currentYearSales,
    customersSales,
  };

  const jsonString = JSON.stringify(result);
  const sizeInBytes = Buffer.byteLength(jsonString, "utf8");
  const sizeInKB = sizeInBytes / 1024;

  const sizeInMB = sizeInKB / 1024;
  console.log(`invoices Data size: ${sizeInMB.toFixed(2)} MB`);
  return {
    FormatedInvoices,
    currentMonthSales,
    currentYearSales,
    customersSales,
  };
}
