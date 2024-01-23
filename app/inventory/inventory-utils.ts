import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";

export async function getAvailableProducts() {
    try {
        const availableProducts = await prismaDb.product.findMany({
            include: {
                ProductionEvent: true,
                LineItem: {
                    include: {
                        invoice: true,
                        ReturnedInvoice: true,
                    },
                },
                InventoryRecord: {
                    where: {
                        year: 2024,
                    },
                },
            },
        });

        const productsWithAvailability: inventoryT[] = availableProducts.map(
            (product) => {
                const initalQuantity =
                    product.InventoryRecord[0].openingQuantity;

                const soldQuantity = product.LineItem.reduce(
                    (total, lineItem) =>
                        total + (lineItem.invoice ? lineItem.quantity : 0),
                    0
                );

                const returnedQuantity = product.LineItem.reduce(
                    (total, lineItem) =>
                        total +
                        (lineItem.ReturnedInvoice ? lineItem.quantity : 0),
                    0
                );

                const producedQuantity = product.ProductionEvent.reduce(
                    (total, event) => total + event.quantity,
                    0
                );
                const availableQuantity =
                    initalQuantity +
                    producedQuantity -
                    soldQuantity +
                    returnedQuantity;

                return {
                    productName: product.name,
                    id: product.id,
                    initalQuantity,
                    soldQuantity: soldQuantity,
                    returnedQuantity: returnedQuantity,
                    producedQuantity: producedQuantity,
                    availableQuantity,
                };
            }
        );
        productsWithAvailability.sort((a, b) =>
            a.productName.localeCompare(b.productName)
        );

        return productsWithAvailability;
    } catch (error) {
        console.error("Error retrieving available products:", error);
        throw error;
    } finally {
        await prismaDb.$disconnect();
    }
}
