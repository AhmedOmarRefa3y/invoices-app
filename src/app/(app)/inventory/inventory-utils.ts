import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";
import { endOfYear, startOfYear } from "date-fns";

export async function getAvailableProducts() {
    const availableProducts = await prismaDb.product.findMany({
        include: {
            LineItem: {
                include: {
                    invoice: {
                        where: {
                            date: {
                                gte: startOfYear(new Date()),
                                lte: endOfYear(new Date()),
                            },
                        },
                    },
                    ReturnedInvoice: {
                        where: {
                            date: {
                                gte: startOfYear(new Date()),
                                lte: endOfYear(new Date()),
                            },
                        },
                    },
                    ProductionEvent: {
                        where: {
                            producedAt: {
                                gte: startOfYear(new Date()),
                                lte: endOfYear(new Date()),
                            },
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

    const productsWithAvailability: inventoryT[] = availableProducts.map(
        (product) => {
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
                availableQuantity:
                    initalQuantity +
                    produced +
                    reuturned -
                    sold -
                    outProduction,
                parts: product.Part,
                unit: product.unit?.name as string,
            };
        }
    );
    productsWithAvailability.sort((a, b) =>
        a.productName.localeCompare(b.productName)
    );

    return productsWithAvailability;
}
