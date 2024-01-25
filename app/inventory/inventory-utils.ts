import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";

export async function getAvailableProducts() {
    const availableProducts = await prismaDb.product.findMany({
        include: {
            LineItem: {
                include: {
                    invoice: true,
                    ReturnedInvoice: true,
                    ProductionEvent: true,
                    product: true,
                },
            },
            // InventoryRecord: {
            //     where: {
            //         year: 2024,
            //     },
            // },
        },
    });

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
