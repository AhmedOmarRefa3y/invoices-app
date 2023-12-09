"use client";
import { Customer, Prisma } from "@prisma/client";
import React, { useState } from "react";
import AddInvoicePage from "./AddInvoicePage";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import ReturnedInvoicePage from "./ReturnedInvoicePage";
import useInvoice from "@/lib/zustand";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments: number;
        InvoiceTotal: number;
    }[];
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
        Inventory: true;
        Parts: true;
    };
}>;
const Rendreing: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const invoice = useInvoice();
    const { Mode } = invoice;

    return (
        <div className="flex flex-col justify-center">
            {Mode.id === 1 ? (
                <AddInvoicePage
                    products={products}
                    customers={customers}
                    customersBalannces={customersBalannces}
                />
            ) : (
                <ReturnedInvoicePage
                    products={products}
                    customers={customers}
                    customersBalannces={customersBalannces}
                />
            )}
        </div>
    );
};

export default Rendreing;
