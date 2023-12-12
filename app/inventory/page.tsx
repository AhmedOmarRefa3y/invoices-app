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
    return (
        <div>
            <Refetch />
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
