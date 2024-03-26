import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandItem } from "@/components/ui/command";
import { ProductT } from "@/lib/types";
import EditProduct from "./EditProduct";

const CommandItemUi = ({
    productInfo,
    itemInInvoice,
}: {
    productInfo: {
        id: string;
        name: string;
        price: number;
        Part:
            | {
                  product: {
                      name: string;
                      price: number;
                  };
                  name: string;
                  partProductId: string;
                  quantity: number;
              }[];
        isAcomopsition: boolean;
        catgoryId: string;
        unitId: string;
    };
    itemInInvoice: InvoiceItem;
}) => {
    console.log(productInfo);

    const DataStore = useInvoice();
    const { updateItem } = DataStore;
    return (
        <CommandItem
            key={itemInInvoice.number}
            onSelect={() => {
                updateItem(itemInInvoice.number, {
                    id:
                        itemInInvoice.id === productInfo.id
                            ? ""
                            : productInfo.id,
                    name:
                        itemInInvoice.id === productInfo.id
                            ? ""
                            : productInfo.name,
                    price:
                        itemInInvoice.id === productInfo.id
                            ? 0
                            : productInfo.price,
                    quantity: 0,
                    parts:
                        productInfo.Part && productInfo.Part?.length > 0
                            ? productInfo.Part.map((part) => {
                                  return {
                                      name: part.product.name,
                                      productid: part.partProductId as string,
                                      quantity: part.quantity,
                                  };
                              })
                            : undefined,
                });
            }}
            className={`w-full text-sm my-1 hover:bg-slate-200 ${
                productInfo?.id === itemInInvoice.id &&
                "bg-emerald-200 hover:bg-emerald-200"
            }`}
        >
            <div className="w-[80%] flex text-base">
                <span>{productInfo.name}</span>
                <Check
                    className={cn(
                        "mr-auto ml-2",
                        productInfo?.id === itemInInvoice.id
                            ? "opacity-100"
                            : "opacity-0"
                    )}
                ></Check>
            </div>
            <span className="w-[10%] text-center text-lg">
                {productInfo.price}
            </span>
            <EditProduct productInfo={productInfo} />
        </CommandItem>
    );
};

export default CommandItemUi;
