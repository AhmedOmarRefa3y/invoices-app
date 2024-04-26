"use client";
import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Spinner } from "@chakra-ui/react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";
import { GetCustomerCredit } from "./customer-credit-utils";
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
    }, [params.orgid]);

    const customer = customers?.find((c) => c.id === searchParams.customerid);
    return (
        <div className=" rounded-md z-50 relative w-full  mt-1 p-2 flex gap-2">
            <div ref={componentRef} className=" relative w-full print:px-2">
                <div className="bg-amber-200 h-fit py-2 w-full text-center text-xl font-bold relative">
                    <button
                        onClick={handlePrint}
                        className="print:hidden  w-fit block absolute left-20 top-8"
                    >
                        <BsFillPrinterFill
                            size={"40px"}
                            className=" cursor-pointer hover:text-orange-500 duration-300"
                        />
                    </button>
                    <div className="py-3">كشف حساب عميل</div>
                    <div className="flex pr-3 items-center">
                        <div>
                            اسم العميل :
                            <span className="pr-2">{customer?.name}</span>
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
            <div className="grid grid-cols-1 justify-start items-start mb-2 gap-4 z-[100] basis-[25%] h-fit font-extrabold bg-white  rounded-lg p-2">
                <CustomerCommandComp
                    customers={customers || []}
                    slug={searchParams.customerid}
                />
                <DateSearch filter="gtdate" label="من تاريخ" />
                <DateSearch filter="ltdate" label="الي تاريخ" />
                <div className="flex   flex-col gap-2 flex-1 w-full">
                    <FilterCheckBox filtername="Credit" label="دائن" />
                    <FilterCheckBox filtername="Debit" label="مدين" />
                </div>
            </div>
        </div>
    );
};

export default CustomerReport;
