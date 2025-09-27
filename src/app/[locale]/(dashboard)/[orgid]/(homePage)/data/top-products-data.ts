import prismaDb from "@/lib/prisma";

export type Period = "year" | "month";

export async function getTopProducts(orgid: string, period: Period) {
  const now = new Date();
  const startDate = new Date();

  if (period === "month") {
    startDate.setDate(1); // Set the start date to the first day of the current month
  } else {
    startDate.setFullYear(now.getFullYear(), 0, 1); // Set to the first day of the current year
  }

  // Get all ordered items from regular invoices (sales)
  const salesItems = await prismaDb.orderItem.groupBy({
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
  });

  // Get all ordered items from returned invoices (returns)
  const returnItems = await prismaDb.orderItem.groupBy({
    by: ["productId"],
    where: {
      organizationId: orgid,
      ReturnedInvoice: {
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
  });

  // Combine sales and returns data for each product
  const productSalesMap = new Map();

  // Add sales data to the map
  salesItems.forEach((item) => {
    productSalesMap.set(item.productId, {
      totalSalesAmount: item._sum.amount || 0,
      totalSalesQuantity: item._sum.quantity || 0,
      salesInvoiceCount: item._count.productId,
      totalReturnsAmount: 0,
      totalReturnsQuantity: 0,
      returnInvoiceCount: 0,
    });
  });

  // Add or update with returns data
  returnItems.forEach((item) => {
    if (productSalesMap.has(item.productId)) {
      const productData = productSalesMap.get(item.productId);
      productData.totalReturnsAmount = item._sum.amount || 0;
      productData.totalReturnsQuantity = item._sum.quantity || 0;
      productData.returnInvoiceCount = item._count.productId;
    } else {
      productSalesMap.set(item.productId, {
        totalSalesAmount: 0,
        totalSalesQuantity: 0,
        salesInvoiceCount: 0,
        totalReturnsAmount: item._sum.amount || 0,
        totalReturnsQuantity: item._sum.quantity || 0,
        returnInvoiceCount: item._count.productId,
      });
    }
  });

  // Calculate net amounts (sales - returns) for each product
  const netProducts = Array.from(productSalesMap.entries()).map(([productId, data]) => {
    const netAmount = (data.totalSalesAmount || 0) - (data.totalReturnsAmount || 0);
    const netQuantity = (data.totalSalesQuantity || 0) - (data.totalReturnsQuantity || 0);

    return {
      productId,
      netAmount,
      netQuantity,
      totalSalesAmount: data.totalSalesAmount,
      totalReturnsAmount: data.totalReturnsAmount,
      totalSalesQuantity: data.totalSalesQuantity,
      totalReturnsQuantity: data.totalReturnsQuantity,
      salesInvoiceCount: data.salesInvoiceCount,
      returnInvoiceCount: data.returnInvoiceCount,
    };
  });

  // Filter out products with negative net amounts (if returns exceed sales)
  const filteredNetProducts = netProducts.filter((item) => item.netAmount > 0);

  // Sort by net amount in descending order
  const sortedProducts = filteredNetProducts
    .sort((a, b) => b.netAmount - a.netAmount)
    .slice(0, 100);

  // Add product details to the final result
  const productsWithDetails = await Promise.all(
    sortedProducts.map(async (product) => {
      const productDetails = await prismaDb.product.findUnique({
        where: { id: product.productId },
      });

      return {
        id: product.productId,
        name: productDetails?.name || "",
        totalAmount: product.netAmount,
        totalQuantity: product.netQuantity,
        invoiceCount: product.salesInvoiceCount,
        returnCount: product.returnInvoiceCount,
        totalSalesAmount: product.totalSalesAmount,
        totalReturnsAmount: product.totalReturnsAmount,
      };
    })
  );

  return productsWithDetails;
}
