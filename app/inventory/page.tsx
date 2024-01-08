import prismaDb from "@/lib/prisma";
import { inventoryColumns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const page = async () => {
    async function getAvailableProducts() {
        try {
            const availableProducts = await prismaDb.product.findMany({
                include: {
                    Inventory: true,
                    ProductionEvent: true,
                    LineItem: {
                        include: {
                            invoice: true,
                            ReturnedInvoice: true,
                        },
                    },
                },
            });

            const productsWithAvailability = availableProducts.map(
                (product) => {
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
                        product.initialQuantity +
                        producedQuantity -
                        soldQuantity +
                        returnedQuantity;

                    return {
                        productName: product.name,
                        id: product.id,
                        soldQuantity: soldQuantity,
                        returnedQuantity: returnedQuantity,
                        producedQuantity: producedQuantity,
                        availableQuantity,
                        initialQuantity: product.initialQuantity,
                    };
                }
            );

            return productsWithAvailability;
        } catch (error) {
            console.error("Error retrieving available products:", error);
            throw error;
        } finally {
            await prismaDb.$disconnect();
        }
    }

    const InventoryItems = await getAvailableProducts();

    return (
        <div>
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
