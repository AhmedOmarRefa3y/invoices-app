import { TableUi } from "@/components/table";
import { getAvailableProducts } from "./inventory-utils";
import { InventoryColumns } from "./tableComponents/columns";

const page = async () => {
    const InventoryItems = await getAvailableProducts();

    return (
        <div>
            <TableUi
                columns={InventoryColumns}
                data={InventoryItems}
                filterAccessorKey="productName"
                filterlabel="اسم الصنف"
                filterplaceholder="البحث عن الصنف"
                notfound="لا يوجد صنف بهذا الاسم"
                visabilty={true}
            />
        </div>
    );
};

export default page;
