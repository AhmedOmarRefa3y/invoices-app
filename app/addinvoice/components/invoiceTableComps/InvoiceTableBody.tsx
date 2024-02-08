import React from "react";
import { TiDelete } from "react-icons/ti";
import { Button } from "@/components/ui/button";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";
import { Prisma } from "@prisma/client";
import EditItem from "./invoiceTableBodyComps/CommandItemPopover/EditItem";
import CommandItemUi from "./invoiceTableBodyComps/CommandItemPopover/CommandItem";
import CommandItemHeader from "./invoiceTableBodyComps/CommandItemPopover/CommandHeader";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandItemPopover/CommandSelect";

interface invoiceTableBodyT {
    products: product[];
}

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;

const InvoiceTableBody: React.FC<invoiceTableBodyT> = ({ products }) => {
    const DataStore = useInvoice();
    const { items } = DataStore;
    return (
        <tbody>
            {items.map((item, i) => {
                return (
                    <tr key={i + 1}>
                        <td className="font-semibold text-center text-black border border-black ">
                            {i + 1}
                        </td>
                        <CommandItemSelect item={item} products={products} />
                        <CommandItemIActions item={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
