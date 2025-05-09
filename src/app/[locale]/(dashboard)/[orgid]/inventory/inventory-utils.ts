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
          PurchaseInvoice: {
            where: {
              date: Peroid,
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
    // let outProduction = 0;
    let reuturned = 0;
    // let produced = 0;
    let purchased = 0;
    const initalQuantity = product.initialquantity;

    product.LineItem.map((LineItem) => {
      if (LineItem.invoice) {
        sold += LineItem.quantity;
      }
      if (LineItem.ReturnedInvoice) {
        reuturned += LineItem.quantity;
      }
      // if (LineItem.isProduction) {
      //   produced += LineItem.quantity;
      // }
      // if (LineItem.isReduction) {
      //   outProduction += LineItem.quantity;
      // }

      if (LineItem.PurchaseInvoice) {
        purchased += LineItem.quantity;
      }
    });
    return {
      id: product.id,
      productName: product.name,
      isAcomposistion: product.isAcomopsition,
      initalQuantity,
      // producedQuantity: produced,
      returnedQuantity: reuturned,
      soldQuantity: sold,
      // outProduction: outProduction,
      purchasedQuantity: purchased,
      availableQuantity: initalQuantity + reuturned + purchased - sold,
      parts: product.Part,
      unit: product.unit?.name as string,
      orgid: product.organizationId,
    };
  });
  productsWithAvailability.sort((a, b) => a.productName.localeCompare(b.productName));

  return productsWithAvailability;
}
