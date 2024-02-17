import { getAvailableProducts } from "./inventory-utils";
import { inventoryColumns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const page = async () => {
    const InventoryItems = await getAvailableProducts();

    return (
        <div>
            <DataTable columns={inventoryColumns} data={InventoryItems} />
        </div>
    );
};

export default page;
