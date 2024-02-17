import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React from "react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";
import { GetCustomerCredit } from "./customer-credit-utils";

interface CustomerStatementProps {
    searchParams: {
        customerid: string;
        ltdate: string;
        gtdate: string;
        Debit: string;
        Credit: string;
        items: string;
    };
}

const CustomerReport: React.FC<CustomerStatementProps> = async ({
    searchParams,
}) => {
    const { CustomerInvoicesAndPayments, customers } = await GetCustomerCredit(
        searchParams
    );
    return (
        <div className=" p-2 rounded-md z-50 relative min-h-screen">
            <div className="grid grid-cols-5 mb-2 gap-4 z-[100] ">
                <CustomerCommandComp
                    customers={customers}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex items-center justify-center flex-col gap-2 flex-1 w-full">
                    <FilterCheckBox filtername="Credit" label="دائن" />
                    <FilterCheckBox filtername="Debit" label="مدين" />
                </div>
            </div>
            <InvoicesAndPayments
                CustomerInvoicesAndPayments={CustomerInvoicesAndPayments}
            />
        </div>
    );
};

export default CustomerReport;
