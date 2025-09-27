import prismaDb from "@/lib/prisma";

export async function getMonthlySales(orgid: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

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

  // Process data into monthly totals
  const monthlySales = invoices.reduce((acc, invoice) => {
    const month = invoice.date.toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + invoice.amount;
    return acc;
  }, {} as Record<string, number>);

  console.log("monthlySales", monthlySales);

  return Object.entries(monthlySales).map(([month, total]) => ({
    month,
    total,
  }));
}
