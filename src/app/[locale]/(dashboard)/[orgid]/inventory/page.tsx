import { TableUi } from "@/components/table";
import { getAvailableProducts } from "./inventory-utils";
import { InventoryColumns } from "./tableComponents/columns";
import { getTranslations } from "next-intl/server";

const page = async ({ params }: { params: { orgid: string } }) => {
  const InventoryItems = await getAvailableProducts(params.orgid);
  const FilterdItems = InventoryItems.filter((item) => !item.isAcomposistion);
  const t = await getTranslations("Inventory");
  return (
    <div className="px-2">
      <TableUi
        columns={InventoryColumns}
        data={FilterdItems}
        filterAccessorKey="productName"
        filterlabel={t("filterlabel")}
        filterplaceholder={t("filterplaceholder")}
        notfound={t("notfound")}
        visabilty={true}
      />
    </div>
  );
};

export default page;
