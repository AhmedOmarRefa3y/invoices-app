import React from "react";
import { DataTable } from "./tableComponents/data-table";
import { inventoryColumns } from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";
import Refetch from "@/components/refetch";

export const dynamic = "force-dynamic";

const page = async () => {
    const InventoryItems = await prismaDb.inventory.findMany({
        include: {
            product: true,
        },
    });
    const LineItems = await prismaDb.invoice.findMany({
        select: {
            lineItems: {
                where: {
                    productId: "16134089-6cf1-4e0c-b2bf-6b75bb35c4fe",
                },
            },
        },
    });

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
                        producedQuantity - (soldQuantity + returnedQuantity);

                    return {
                        productName: product.name,
                        availableQuantity,
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

    // Call the function to get available products
    await getAvailableProducts();
    console.log(await getAvailableProducts());

    return (
        <div>
            <Refetch />
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
