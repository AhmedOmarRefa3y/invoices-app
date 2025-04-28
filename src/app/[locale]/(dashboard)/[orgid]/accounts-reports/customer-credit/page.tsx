"use client";
import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React, { useEffect, useRef, useState } from "react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";
import { GetCustomerCredit } from "./customer-credit-utils";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";
import { Spinner } from "@/components/loadingComp";

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

const CustomerReport: React.FC<CustomerStatementProps> = ({ searchParams, params }) => {
  const [CustomerInvoicesAndPayments, setCustomerInvoicesAndPayments] = useState<
    | {
        type: "Debit" | "credit" | "openCredit";
        amount: number;
        date?: Date | undefined;
        number?: number | undefined;
        recordType: "returns" | "openCredit" | "inv" | "paymnet";
        kind?: string | undefined;
        id?: string | undefined;
      }[]
    | null
  >(null);
  const [customers, setcustomers] = useState<
    | {
        id: string;
        name: string;
        phoneNumber: string;
        location: string;
        CustomerCredit: number;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        IsASupplier: boolean;
      }[]
    | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { CustomerInvoicesAndPayments } = await GetCustomerCredit({
        ...searchParams,
        orgid: params.orgid,
      });
      setCustomerInvoicesAndPayments(CustomerInvoicesAndPayments);
      setIsLoading(false);
    };
    fetchData();
  }, [searchParams, params.orgid]);
  useEffect(() => {
    const fetchData = async () => {
      const { customers } = await GetCustomerCredit({
        ...searchParams,
        orgid: params.orgid,
      });
      setcustomers(customers);
    };
    fetchData();
  }, [params.orgid, searchParams]);

  const customer = customers?.find((c) => c.id === searchParams.customerid);
  return (
    <div className=" rounded-md z-50 relative w-full  p-2 flex gap-2 h-full ">
      <div ref={componentRef} className=" relative w-full print:px-2 max-h-full overflow-hidden">
        <div className=" h-fit py-2 w-full text-center text-xl font-bold relative">
          <button
            onClick={handlePrint}
            className="print:hidden  w-fit block absolute left-20 top-8"
          >
            <PrinterIcon
              size={"40px"}
              className=" cursor-pointer hover:text-orange-500 duration-300"
            />
          </button>
          <div className="py-3">Customer Statement</div>
          <div className="flex items-center">
            <div className="  flex flex-col w-full  overflow-hidden">
              <div className="flex items-center justify-center ">
                <span className="border border-black  px-5 py-1">Customer Name</span>
                <span className="border flex-1 border-black border-r-0 text-start  px-5 py-1 w-full">
                  {customer?.name}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <InvoicesAndPayments CustomerInvoicesAndPayments={CustomerInvoicesAndPayments || []} />
        )}
      </div>
      <div className="bg-white h-full z-[100] basis-[25%]  ">
        <div className="grid grid-cols-1 justify-start place-items-start  gap-4 font-extrabold   rounded-lg p-2 w-full">
          <CustomerCommandComp customers={customers || []} slug={searchParams.customerid} />
          <DateSearch filter="gtdate" label="From Date" />
          <DateSearch filter="ltdate" label="To Date" />
          <div className="flex   flex-col gap-2 flex-1 w-full">
            <FilterCheckBox filtername="Credit" label="Credit" />
            <FilterCheckBox filtername="Debit" label="Debit" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;
