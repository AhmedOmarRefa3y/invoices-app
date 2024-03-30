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
    params: { orgid: string };
}

const CustomerReport: React.FC<CustomerStatementProps> = async ({
    searchParams,
    params,
}) => {
    const { CustomerInvoicesAndPayments, customers } = await GetCustomerCredit({
        ...searchParams,
        orgid: params.orgid,
    });
    return (
        <div className="  rounded-md z-50 relative min-h-screen mt-1">
            <div className="grid grid-cols-4 mb-2 gap-4 z-[100] font-extrabold bg-white w-[70%] rounded-lg p-2">
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
