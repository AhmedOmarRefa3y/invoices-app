import { TableUi } from "@/components/table";
import { getAvailableProducts } from "./inventory-utils";
import { InventoryColumns } from "./tableComponents/columns";

const page = async (params: { params: { orgId: string } }) => {
    console.log(params);

    const InventoryItems = await getAvailableProducts();

    const FilterdItems = InventoryItems.filter((item) => !item.isAcomposistion);
    return (
        <div>
            <TableUi
                columns={InventoryColumns}
                data={FilterdItems}
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
