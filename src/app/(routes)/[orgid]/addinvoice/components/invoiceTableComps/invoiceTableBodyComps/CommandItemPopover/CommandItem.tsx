import { CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import { Check } from "lucide-react";
import EditProduct from "./EditProduct";

const CommandItemUi = ({
    productId,
    itemInInvoice,
}: {
    productId: string;
    itemInInvoice: InvoiceItem;
}) => {
    const DataStore = useInvoice();
    const productInfo = DataStore.products.find(
        (product) => product.id === productId
    );
    if (!productInfo) {
        return null;
    }
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
            className={`w-full flex   hover:bg-slate-200 rounded-none p-0 border-b border-b-stone-300 ${
                productInfo?.id === itemInInvoice.id &&
                "bg-emerald-200 hover:bg-emerald-200"
            }`}
        >
            <div className="basis-[60%] min-w-[60%] sm:min-w-[80%] sm:basis-[80%] flex text-base font-bold pr-2 py-1 border-l border-stone-300 overflow-x-auto">
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
            <div className="basis-[20%] sm:basis-[10%] flex items-center text-base font-bold  py-1 border-l border-stone-300">
                <div className="w-full text-center">{productInfo.price}</div>
            </div>
            <div className="basis-[20%] sm:basis-[80%] flex items-center justify-center text-base font-bold  py-1 border-l border-stone-300">
                <EditProduct id={productInfo.id} />
            </div>
        </CommandItem>
    );
};

export default CommandItemUi;
