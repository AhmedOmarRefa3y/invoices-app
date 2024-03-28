"use client";

import * as React from "react";

import InvoiceAction from "../components/InvoiceAction";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import SetCustomerAndDate from "../components/SetCustomerAndDate";
import { CustomerT } from "@/lib/types";

interface InvoiceProps {
    customers: Omit<
        CustomerT,
        "Payment" | "Orders" | "organization" | "_count"
    >[];
}

const ReturnedInvoicePage: React.FC<InvoiceProps> = ({ customers }) => {
    const [mounted, setmounted] = React.useState(false);
    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="basis-[100%] p-2 max-w-[900px] mx-auto">
            <div className="flex items-center justify-between w-full">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable />
            <div className="flex items-start justify-end gap-2 mt-2 mr-auto ">
                <InvoiceAction />
            </div>
        </div>
    );
};

export default ReturnedInvoicePage;
