import prismaDb from "@/lib/prisma";
import { inventory, inventoryColumns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const page = async () => {
    const getInventoryItems = async () => {
        const data = await prismaDb.inventoryRecord.findMany({
            include: {
                product: true,
            },
            where: {
                year: 2024,
            },
        });

        console.log(data);

        const items: inventory[] = data.map((item) => {
            return {
                productName: item.product.name,
                id: item.id,
                initialQuantity: item.openingQuantity,
                Received: item.ReceivedQuantity,
                Issued: item.IssuedQuantity,
                availableQuantity:
                    item.openingQuantity +
                    item.ReceivedQuantity -
                    item.IssuedQuantity,
            };
        });
        return items;
    };

    const InventoryItems = await getInventoryItems();
    return (
        <div>
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
