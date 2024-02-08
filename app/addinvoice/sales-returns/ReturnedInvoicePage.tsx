"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import { saveREtInvoiceToDB } from "./sales-returns-utils";
import { useRouter } from "next/navigation";
import InvoiceAction from "../components/InvoiceAction";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;

const ReturnedInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
}) => {
    const [mounted, setmounted] = React.useState(false);
    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col mx-auto p-[2%]  z-20 min-h-screen   border-gray-300 border shadow-lg bg-opacity-70">
            <div className="flex items-center justify-center">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable products={products} />
            <div className="flex items-start justify-center gap-2 mt-2 mr-auto ">
                <InvoiceAction />
            </div>
        </div>
    );
};

export default ReturnedInvoicePage;
