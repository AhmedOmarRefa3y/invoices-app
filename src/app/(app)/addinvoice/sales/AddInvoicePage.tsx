"use client";

import * as React from "react";

import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";

import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import CustomerBalance from "../components/customerBalance";
import InvoiceAction from "../components/InvoiceAction";
import SetCustomerAndDate from "../components/SetCustomerAndDate";

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
        Part: true;
    };
}>;

const AddInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const Invoice = useInvoice();
    const { customerId } = Invoice;
    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId
    );

    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <div className="flex flex-col  p-[2%]  z-20 min-h-screen  shadow-2xl w-[70%] bg-[#fafafa]">
            <div className="flex items-center justify-center">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable products={products} />
            <div className="flex justify-between w-full mt-2 ml-10 mr-auto ">
                <CustomerBalance
                    customerBalance={customer ? customer.Currbalance : 0}
                />
                <InvoiceAction />
            </div>
        </div>
    );
};

export default AddInvoicePage;
