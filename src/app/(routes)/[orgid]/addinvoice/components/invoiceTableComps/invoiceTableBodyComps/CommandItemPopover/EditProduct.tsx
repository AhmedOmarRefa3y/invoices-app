import useInvoice from "@/lib/zustand/invoiceStore";
import { Edit } from "lucide-react";

const EditProduct = ({ id }: { id: string }) => {
    const DataStore = useInvoice();
    const { setproductToBeEdited, SetAddProdctModalIsOpen } = DataStore;
    const Product = DataStore.products.find((product) => product.id === id);
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
            className={`w-[10%] hover:text-red-700 z-50 `}
            onClick={() => {
                EditProductF();
            }}
        />
    );
};

export default EditProduct;
