import React from "react";
import { DataTable } from "./tableComponents/data-table";
import { inventoryColumns } from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";

const page = async () => {
    const InventoryItems = await prismaDb.inventory.findMany({
        include: {
            product: true,
        },
    });
    return (
        <div>
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
