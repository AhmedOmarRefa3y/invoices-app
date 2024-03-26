import { ProductT } from "@/lib/types";
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
const EditProduct = ({
    productInfo,
}: {
    productInfo: {
        id: string;
        name: string;
        price: number;
        Part:
            | {
                  name: string;
                  partProductId: string;
                  quantity: number;
              }[];
        isAcomopsition: boolean;
        catgoryId: string;
        unitId: string;
    };
}) => {
    const DataStore = useInvoice();
    const { setproductToBeEdited, SetAddProdctModalIsOpen } = DataStore;
    return (
        <Edit
            className="w-[10%] hover:text-red-700"
            onClick={() => {
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

export default EditProduct;
