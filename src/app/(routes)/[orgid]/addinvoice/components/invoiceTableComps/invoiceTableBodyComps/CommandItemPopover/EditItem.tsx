import useInvoice from "@/lib/zustand/invoiceStore";
import { Prisma } from "@prisma/client";
import { Edit } from "lucide-react";
import React from "react";

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: {
            include: {
                product: true;
            };
        };
    };
}>;
const EditItem = ({
    productInfo,
    products,
}: {
    productInfo: product;
    products: product[];
}) => {
    // console.log(productInfo);

    const DataStore = useInvoice();
    const { setproductToBeEdited, SetAddProdctModalIsOpen } = DataStore;
    return (
        <Edit
            className="w-[10%] hover:text-red-700"
            onClick={() => {
                // console.log(productInfo);
                setproductToBeEdited({
                    isAcomopsition: productInfo.isAcomopsition,
                    PrdocutId: productInfo.id,
                    name: productInfo.name,
                    price: productInfo.price,
                    unitID: productInfo.unitId,
                    categoryID: productInfo.catgoryId,
                    parts: productInfo.Part.map((part) => {
                        return {
                            name: part.name,
                            productid: part.partProductId as string,
                            quantity: part.quantity,
                        };
                    }),
                    
                });

                SetAddProdctModalIsOpen(true);
            }}
        />
    );
};

export default EditItem;
