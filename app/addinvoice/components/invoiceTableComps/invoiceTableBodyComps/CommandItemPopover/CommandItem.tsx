import useInvoice, { InvoiceItem } from "@/lib/zustand";
import { Prisma } from "@prisma/client";
import React from "react";
import EditItem from "./EditItem";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandItem } from "@/components/ui/command";
export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;
const CommandItemUi = ({
    productInfo,
    item,
}: {
    productInfo: product;
    item: InvoiceItem;
}) => {
    const DataStore = useInvoice();
    const { updateItem } = DataStore;
    return (
        <CommandItem
            key={item.number}
            onSelect={() => {
                updateItem(item.number, {
                    id: item.id === productInfo.id ? "" : productInfo.id,
                    name: item.id === productInfo.id ? "" : productInfo.name,
                    price: item.id === productInfo.id ? 0 : productInfo.price,
                    quantity: 0,
                    parts:
                        productInfo.Part && productInfo.Part?.length > 0
                            ? productInfo.Part.map((part) => {
                                  return {
                                      name: part.name,
                                      productid: part.partProductId as string,
                                      quantity: part.quantity,
                                  };
                              })
                            : undefined,
                });
            }}
            className={`w-full text-sm my-1 hover:bg-slate-200 ${
                productInfo?.id === item.id &&
                "bg-emerald-200 hover:bg-emerald-200"
            }`}
        >
            <div className="w-[80%] flex text-base">
                <span>{productInfo.name}</span>
                <Check
                    className={cn(
                        "mr-auto ml-2",
                        productInfo?.id === item.id
                            ? "opacity-100"
                            : "opacity-0"
                    )}
                ></Check>
            </div>
            <span className="w-[10%] text-center text-lg">
                {productInfo.price}
            </span>
            <EditItem productInfo={productInfo} />
        </CommandItem>
    );
};

export default CommandItemUi;
