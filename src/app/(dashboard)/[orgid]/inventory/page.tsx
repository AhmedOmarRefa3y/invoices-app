import { TableUi } from "@/components/table";
import { getAvailableProducts } from "./inventory-utils";
import { InventoryColumns } from "./tableComponents/columns";

const page = async ({ params }: { params: { orgid: string } }) => {
    const InventoryItems = await getAvailableProducts(params.orgid);
    const FilterdItems = InventoryItems.filter((item) => !item.isAcomposistion);
    return (
        <div className="px-2">
            <TableUi
                columns={InventoryColumns}
                data={FilterdItems}
                filterAccessorKey="productName"
                filterlabel="Product Name"
                filterplaceholder="Search for product"
                notfound="No product found with this name"
                visabilty={true}
            />
        </div>
    );
};

export default page;
