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

    // Flatten the array of line items into a single array of line items
    const allLineItems = LineItems.flatMap((invoice) => invoice.lineItems);

    console.log(allLineItems);

    // Calculate the sum of quantities
    const totalQuantity = allLineItems.reduce(
        (total, currentItem) => total + currentItem.quantity,
        0
    );

    console.log("Total Quantity:", totalQuantity);

    return (
        <div>
            <Refetch />
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
