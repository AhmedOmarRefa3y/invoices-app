import { Button } from "@/components/ui/button";

import { Command, CommandGroup, CommandList } from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import CommandItemHeader from "./CommandItemPopover/CommandHeader";
import CommandItemUi from "./CommandItemPopover/CommandItem";
import useModals from "@/lib/zustand/useModals";
import useGlobal from "@/lib/zustand/GlobalStore";

const CommandItemSelect = ({
    itemInInvoice,
    updateItem,
}: {
    itemInInvoice: {
        id: string;
        number: number;
        name: string;
    };
    updateItem: (number: number, item: Partial<InvoiceItem>) => void;
}) => {
    const { products } = useGlobal();
    const ModalsStore = useModals();
    const { SetAddProdctModalIsOpen } = ModalsStore;
    return (
        <td
            align="center"
            className="p-0 font-semibold  duration-300 border border-stone-300 border-r-0 border-t-0  "
        >
            <div className="flex items-center h-full">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center w-full h-full ">
                            <div
                                className={cn(
                                    `flex justify-between h-full bg-none w-full px-2 cursor-pointer   `
                                )}
                            >
                                <div>{itemInInvoice.name}</div>
                                <ChevronsUpDown className="w-4 shrink-0 " />
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[497px] relative rounded-none p-0 border border-stone-400 ">
                        <Command className="rounded-none">
                            <CommandList>
                                <CommandItemHeader />
                                <CommandGroup className="overflow-y-hidden p-0 ">
                                    {products.map((product) => (
                                        <CommandItemUi
                                            updateItem={updateItem}
                                            itemInInvoice={itemInInvoice}
                                            productId={product.id}
                                            key={product.id}
                                        />
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            <div className="flex items-center justify-center">
                                <Button
                                    variant="default"
                                    onClick={() =>
                                        SetAddProdctModalIsOpen(true)
                                    }
                                    className="w-full text-xl rounded-none hover:bg-black/80 "
                                >
                                    اضافة صنف
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                </Button>
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </td>
    );
};

export default CommandItemSelect;
