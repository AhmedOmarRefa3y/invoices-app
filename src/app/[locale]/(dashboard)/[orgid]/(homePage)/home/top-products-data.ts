import prismaDb from "@/lib/prisma";

export type Period = "year" | "month";

export async function getTopProducts(orgid: string, period: Period) {
  const now = new Date();
  const startDate = new Date();

  if (period === "month") {
    startDate.setDate(1); // Set the start date to the first day of the current month
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  const products = await prismaDb.orderItem.groupBy({
    by: ["productId"],
    where: {
      organizationId: orgid,
      Invoice: {
        date: {
          gte: startDate,
          lte: now,
        },
      },
    },
    _sum: {
      quantity: true,
      amount: true,
    },
    _count: {
      productId: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
    take: 50,
  });

  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      const productDetails = await prismaDb.product.findUnique({
        where: { id: product.productId },
      });

      return {
        id: product.productId,
        name: productDetails?.name || "",
        totalAmount: product._sum.amount || 0,
        totalQuantity: product._sum.quantity || 0,
        invoiceCount: product._count.productId,
      };
    })
  );

  return productsWithDetails;
}
