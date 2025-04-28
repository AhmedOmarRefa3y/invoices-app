import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";
import { endOfYear, startOfYear } from "date-fns";

const Peroid = {
  gte: startOfYear(new Date()),
  lte: endOfYear(new Date()),
};
export async function getAvailableProducts(orgId: string) {
  const availableProducts = await prismaDb.product.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      LineItem: {
        include: {
          invoice: {
            where: {
              date: Peroid,
            },
          },
          ReturnedInvoice: {
            where: {
              date: Peroid,
            },
          },
          ProductionEvent: {
            where: {
              producedAt: Peroid,
            },
          },
          product: true,
          Initialquantities: {
            where: {
              year: 2024,
            },
          },
        },
      },
      Part: true,
      unit: true,
    },
  });

  const productsWithAvailability: inventoryT[] = availableProducts.map((product) => {
    let sold = 0;
    let reuturned = 0;
    let produced = 0;
    let outProduction = 0;
    let initalQuantity = 0;

    product.LineItem.map((LineItem) => {
      if (LineItem.invoice) {
        sold += LineItem.quantity;
      }
      if (LineItem.ReturnedInvoice) {
        reuturned += LineItem.quantity;
      }
      if (LineItem.isProduction) {
        produced += LineItem.quantity;
      }
      if (LineItem.isReduction) {
        outProduction += LineItem.quantity;
      }
      if (LineItem.initialquantitiesId) {
        initalQuantity = LineItem.quantity;
      }
    });
    return {
      id: product.id,
      productName: product.name,
      isAcomposistion: product.isAcomopsition,
      initalQuantity,
      producedQuantity: produced,
      returnedQuantity: reuturned,
      soldQuantity: sold,
      outProduction: outProduction,
      availableQuantity: initalQuantity + produced + reuturned - sold - outProduction,
      parts: product.Part,
      unit: product.unit?.name as string,
      orgid: product.organizationId,
    };
  });
  productsWithAvailability.sort((a, b) => a.productName.localeCompare(b.productName));

  return productsWithAvailability;
}
