"use client";
import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";
import { GetCustomerCredit } from "./customer-credit-utils";
import Loading from "../../loading";
import { useReactToPrint } from "react-to-print";
import { BsFillPrinterFill } from "react-icons/bs";

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

const CustomerReport: React.FC<CustomerStatementProps> = ({
    searchParams,
    params,
}) => {
    const [CustomerInvoicesAndPayments, setCustomerInvoicesAndPayments] =
        useState<
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
          }[]
        | null
    >(null);
    // loading state
    const [isLoading, setIsLoading] = useState(true);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const getData = async () => {
        const { CustomerInvoicesAndPayments, customers } =
            await GetCustomerCredit({
                ...searchParams,
                orgid: params.orgid,
            });
        setCustomerInvoicesAndPayments(CustomerInvoicesAndPayments);
        setcustomers(customers);
        setIsLoading(false);
    };
    useEffect(() => {
        setIsLoading(true);
        // setTimeout(getData, 2000);
        getData();
    }, [searchParams]);

    const customer = customers?.find((c) => c.id === searchParams.customerid);
    return (
        <div className="max-w-5xl   rounded-md z-50 relative  mt-1 p-2">
            <div className="grid grid-cols-4 mb-2 gap-4 z-[100] font-extrabold bg-white w-[70%] rounded-lg ">
                <CustomerCommandComp
                    customers={customers || []}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex items-center justify-center flex-col gap-2 flex-1 w-full">
                    <FilterCheckBox filtername="Credit" label="دائن" />
                    <FilterCheckBox filtername="Debit" label="مدين" />
                </div>
            </div>
            <div ref={componentRef} className="p-2">
                <div className="bg-amber-200 h-[150px] w-full flex flex-col items-center justify-center text-xl font-bold">
                    <button
                        onClick={handlePrint}
                        className="print:hidden  w-fit block"
                    >
                        <BsFillPrinterFill
                            size={"40px"}
                            className=" cursor-pointer hover:text-orange-500 duration-300"
                        />
                    </button>
                    <div className="">كشف حساب</div>
                    <div className="flex justify-center items-center">
                        <div>
                            العميل :
                            {isLoading ? (
                                <Spinner
                                    color="red.500"
                                    size="sm"
                                    className="mr-5"
                                />
                            ) : (
                                <span className="pr-2">{customer?.name}</span>
                            )}
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-full my-10 ">
                        <Spinner color="red.500" size="xl" />
                    </div>
                ) : (
                    <InvoicesAndPayments
                        CustomerInvoicesAndPayments={
                            CustomerInvoicesAndPayments || []
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default CustomerReport;
