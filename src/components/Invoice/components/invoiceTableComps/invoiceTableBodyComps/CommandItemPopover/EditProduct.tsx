import useGlobal from "@/lib/zustand/GlobalStore";
import useModals from "@/lib/zustand/useModals";
import { Edit } from "lucide-react";

const EditProduct = ({ id }: { id: string }) => {
  const { products } = useGlobal();
  const ModalsStore = useModals();
  const { setproductToBeEdited, SetAddProdctModalIsOpen } = ModalsStore;
  const Product = products.find((product) => product.id === id);
  const EditProductF = () => {
    if (Product) {
      setproductToBeEdited({
        isAcomopsition: Product.isAcomopsition,
        PrdocutId: Product.id,
        name: Product.name,
        price: Product.price,
        unitID: Product.unitId,
        categoryID: Product.catgoryId,
        parts: Product.Part
          ? Product.Part.map((part) => {
              return {
                name: part.name,
                productid: part.partProductId as string,
                quantity: part.quantity,
              };
            })
          : undefined,
      });
    }
    SetAddProdctModalIsOpen(true);
  };
  return (
    <Edit
      className={`w-full hover:text-red-700 z-50 `}
      onClick={() => {
        EditProductF();
      }}
    />
  );
};

export default EditProduct;
