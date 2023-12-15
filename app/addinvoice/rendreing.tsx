"use client";
import { Customer, Prisma } from "@prisma/client";
import React from "react";
import AddInvoicePage from "./AddInvoicePage";

import useInvoice from "@/lib/zustand";
import ReturnedInvoicePage from "./ReturnedInvoicePage";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments: number;
        InvoiceTotal: number;
        REtInvTotal: number;
        Currbalance: number;
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
                />
            )}
        </div>
    );
};

export default Rendreing;
