"use client";

import * as React from "react";

import useInvoice from "@/lib/zustand/invoiceStore";

import { CustomerT } from "@/lib/types";
import SetCustomerAndDate from "./components/SetCustomerAndDate";
import Mode from "./components/Mode";
import InvoiceTable from "./components/InvoiceTable";
import CustomerBalance from "./components/customerBalance";
import InvoiceAction from "./components/InvoiceAction";
import useReturnsInvoice, { InvoiceItem } from "@/lib/zustand/ReturnsInvoice";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

interface CustomersWithBalancesT
    extends Omit<CustomerT, "Payment" | "Orders" | "organization" | "_count"> {
    Currbalance: number;
}

interface InvoiceProps {
    customersBalannces: CustomersWithBalancesT[];
    type: "sales" | "returns" | "purchases";
}

const AddInvoiceComponent: React.FC<InvoiceProps> = ({
    type,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();
    const customerId = {
        sales: SalesStore.customerId,
        returns: ReturnsStore.customerId,
        purchases: PurchasesStore.SupplierId,
    };
    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId[type]
    );

    React.useEffect(() => {
        setmounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    return (
        <div className="flex flex-col p-2 sm:w-[900px] max-w-full mx-auto gap-2">
            <div className="flex">
                <SetCustomerAndDate
                    customers={customersBalannces}
                    type={type}
                />
                {/* {type === "sales" || type === "returns" ? (
                    <div className="hidden sm:flex">
                        <Mode />
                    </div>
                ) : null} */}
            </div>
            <div className="w-full border sm:border-none border-slate-900 overflow-x-auto mx-auto">
                <div className="min-w-[500px] p-2 sm:p-0">
                    <InvoiceTable type={type} />
                </div>
            </div>
            <div className="flex flex-col  sm:flex-row justify-between w-full mt-2  ">
                <CustomerBalance
                    customerBalance={customer ? customer.Currbalance : 0}
                    type={type}
                />
                <InvoiceAction type={type} />
            </div>
        </div>
    );
};

export default AddInvoiceComponent;
