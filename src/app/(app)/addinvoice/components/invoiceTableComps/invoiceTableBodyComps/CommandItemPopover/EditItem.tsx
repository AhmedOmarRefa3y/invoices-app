import useInvoice from "@/lib/zustand";
import { Prisma } from "@prisma/client";
import { Edit } from "lucide-react";
import React from "react";

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;
const EditItem = ({ productInfo }: { productInfo: product }) => {
    const DataStore = useInvoice();
    const {
        setproductToBeEdited,
        SetAddProdctModalIsOpen,
    } = DataStore;
    return (
        <Edit
            className="w-[10%] hover:text-red-700"
            onClick={() => {
                setproductToBeEdited({
                    isAcomposition: productInfo.isAcomopsition,
                    id: productInfo.id,
                    name: productInfo.name,
                    price: productInfo.price,
                    unitId: productInfo.unitId,
                    catgoryId: productInfo.catgoryId,
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
