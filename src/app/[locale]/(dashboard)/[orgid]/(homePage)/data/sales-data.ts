import prismaDb from "@/lib/prisma";

export async function getMonthlySales(orgid: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  // Get all invoices for the year
  const invoices = await prismaDb.invoice.findMany({
    where: {
      organizationId: orgid,
      date: { gte: startOfYear },
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Get all returned invoices for the year
  const returnedInvoices = await prismaDb.returnedInvoice.findMany({
    where: {
      organizationId: orgid,
      date: { gte: startOfYear },
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Process invoices into monthly totals
  const monthlySales = invoices.reduce((acc, invoice) => {
    const month = invoice.date.toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + invoice.amount;
    return acc;
  }, {} as Record<string, number>);

  // Process returned invoices into monthly totals
  const monthlyReturns = returnedInvoices.reduce((acc, returnedInvoice) => {
    const month = returnedInvoice.date.toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + returnedInvoice.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate net sales by subtracting returns from sales for each month
  const allMonths = new Set([...Object.keys(monthlySales), ...Object.keys(monthlyReturns)]);

  const monthlyNetSales = Array.from(allMonths).map((month) => {
    const sales = monthlySales[month] || 0;
    const returns = monthlyReturns[month] || 0;
    const netTotal = sales - returns;

    return {
      month,
      total: netTotal,
      sales,
      returns,
    };
  });

  // Return sorted by month (Jan, Feb, Mar, etc.)
  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthlyNetSales.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
}
