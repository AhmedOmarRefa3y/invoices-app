import prismaDb from "@/lib/prisma";

export async function getMonthlySales(orgid: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const invoices = await prismaDb.invoice.findMany({
    where: {
      organizationId: orgid,
      date: { gte: sixMonthsAgo },
    },
    select: {
      date: true,
      amount: true,
    },
  });

  // Process data into monthly totals
  const monthlySales = invoices.reduce((acc, invoice) => {
    const month = invoice.date.toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + invoice.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(monthlySales).map(([month, total]) => ({
    month,
    total,
  }));
}
