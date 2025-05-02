"use client";

import { Part } from "@prisma/client";

import { CreateInitailQuantitesList, UpdateInitailQuantitesList } from "@/actions/production";
import { Button } from "@/components/ui/button";
import useInitaliQuanttiesStore from "@/lib/zustand/initialStore";
import toast from "react-hot-toast";
import SelectItem from "../../../_(production)/components/SelectProduct";
import ItemsTable from "../../../_(production)/components/productsTable";
import { useParams } from "next/navigation";

interface ProductionPlanTableProps {
  products: {
    id: string;
    name: string;
    isAComposistion?: boolean;
    avaliableQuantity: number;
    unit: string;
    parts?: Part[];
  }[];
}
const InitaliQuanttiesPage: React.FC<ProductionPlanTableProps> = ({ products }) => {
  const InitaliQuantties = useInitaliQuanttiesStore();
  const { orgid } = useParams();
  return (
    <div className="flex flex-col gap-2 items-center w-[700px]">
      <SelectItem
        products={products}
        addItem={InitaliQuantties.AddProduct}
        type="InitaliQuantties"
      />
      <div className="w-full">
        <div>Items</div>
        <ItemsTable
          deleteItem={InitaliQuantties.DeleteProduct}
          items={InitaliQuantties.InitaliQuanttiesProducts}
          type="initialQuantities"
          updateItem={InitaliQuantties.updateProduct}
        />
      </div>

      <Button
        onClick={async () => {
          const formattedProducts = InitaliQuantties.InitaliQuanttiesProducts.map((item) => {
            return {
              id: item.id,
              quantity: item.Quantity,
            };
          });
          const res = InitaliQuantties.editMode
            ? await UpdateInitailQuantitesList({
                products: formattedProducts,
                id: InitaliQuantties.EditID as string,
                orgid: orgid as string,
              })
            : await CreateInitailQuantitesList({
                products: formattedProducts,
                orgid: orgid as string,
              });
          if (res.status === "ok") {
            toast.success(`${res.message}`);
          } else {
            toast.error(`${res.message}`);
          }
        }}
      >
        {InitaliQuantties.editMode ? "Edit" : "Save"}
      </Button>
    </div>
  );
};

export default InitaliQuanttiesPage;
