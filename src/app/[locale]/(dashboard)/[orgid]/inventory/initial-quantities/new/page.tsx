import { Part } from "@prisma/client";
import { getAvailableProducts } from "../../inventory-utils";
import InitaliQuanttiesPage from "./InitaliQuanttiesPage";

const page = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  const { orgid } = await params;
  const InventoryItems = await getAvailableProducts(orgid);
  const formattedProducts: {
    id: string;
    name: string;
    isAComposistion: boolean | undefined;
    avaliableQuantity: number;
    unit: string;
    parts?: Part[];
  }[] = InventoryItems.map((item) => {
    return {
      avaliableQuantity: item.availableQuantity,
      id: item.id,
      name: item.productName,
      isAComposistion: item.isAcomposistion,
      unit: item.unit,
      parts: item.parts,
    };
  });
  return (
    <div>
      <InitaliQuanttiesPage products={formattedProducts} />
    </div>
  );
};

export default page;
