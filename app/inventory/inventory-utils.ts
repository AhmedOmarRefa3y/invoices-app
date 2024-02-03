import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";

export async function getAvailableProducts() {
    const currentYear = new Date().getFullYear();
    const lastDayOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    const availableProducts = await prismaDb.product.findMany({
        where: {
            LineItem: {
                some: {
                    invoice: {
                        date: {
                            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                            lte: lastDayOfYear,
                        },
                    },
                },
            },
        },
        include: {
            LineItem: {
                where: {
                    invoice: {
                        date: {
                            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                            lte: lastDayOfYear,
                        },
                    },
                },
                include: {
                    invoice: true,
                    ReturnedInvoice: true,
                    ProductionEvent: true,
                    product: true,
                },
            },
        },
    });

    console.log(availableProducts);

    const productsWithAvailability: inventoryT[] = availableProducts.map(
        (product) => {
            let sold = 0;
            let reuturned = 0;
            let produced = 0;

            product.LineItem.map((LineItem) => {
                if (LineItem.invoice) {
                    sold += LineItem.quantity;
                }
                if (LineItem.ReturnedInvoice) {
                    reuturned += LineItem.quantity;
                }
                if (LineItem.ProductionEvent) {
                    produced += LineItem.quantity;
                }
            });
            return {
                id: product.id,
                productName: product.name,
                initalQuantity: 0,
                producedQuantity: produced,
                returnedQuantity: reuturned,
                soldQuantity: sold,
                availableQuantity: 0 + produced + reuturned - sold,
            };
        }
    );
    productsWithAvailability.sort((a, b) =>
        a.productName.localeCompare(b.productName)
    );

    return productsWithAvailability;
}
