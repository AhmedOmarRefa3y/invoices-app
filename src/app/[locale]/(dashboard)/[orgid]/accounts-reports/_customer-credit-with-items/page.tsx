import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React from "react";

import ItemsAndPayments from "./components/ItemsAndPayments";
import { GetCustomerRecordsWithITems } from "./customer-credit-with-items-utils";
import {} from "@/i18n/routing";

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

const CustomerStatement: React.FC<CustomerStatementProps> = async ({
  searchParams,
  params,
}) => {
  const { CustomerItemsAndPayments, customers } =
    await GetCustomerRecordsWithITems({
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
        <DateSearch filter="gtdate" label="From Date" />
        <DateSearch filter="ltdate" label="To Date" />
        <div className="flex items-center justify-center flex-col gap-2 flex-1 w-full">
          <FilterCheckBox filtername="Debit" label="Debit" />
          <FilterCheckBox filtername="Credit" label="Credit" />
        </div>
      </div>
      <ItemsAndPayments CustomerItemsAndPayments={CustomerItemsAndPayments} />
    </div>
  );
};

export default CustomerStatement;
