"use client";
import CustomerCommandComp from "@/components/ui/CustomerCommand";
import FilterCheckBox from "@/components/ui/FilterCheckBox";
import DateSearch from "@/components/ui/search";
import React, { Suspense, useEffect, useRef, useState } from "react";

import InvoicesAndPayments from "./components/InvoicesAndPayments";
import { GetCustomerCredit } from "./customer-credit-utils";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";

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
    }, [params.orgid, searchParams]);

    const customer = customers?.find((c) => c.id === searchParams.customerid);
    return (
        <div className=" rounded-md z-50 relative w-full  p-2 flex gap-2 h-full">
            <div ref={componentRef} className=" relative w-full print:px-2">
                <div className="bg-amber-200 h-fit py-2 w-full text-center text-xl font-bold relative">
                    <button
                        onClick={handlePrint}
                        className="print:hidden  w-fit block absolute left-20 top-8"
                    >
                        <PrinterIcon
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
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <InvoicesAndPayments
                        CustomerInvoicesAndPayments={
                            CustomerInvoicesAndPayments || []
                        }
                    />
                )}
            </div>
            <div className="bg-white h-full z-[100] basis-[25%]  ">
                <div className="grid grid-cols-1 justify-start place-items-start  gap-4 font-extrabold   rounded-lg p-2 w-full">
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
        </div>
    );
};

export default CustomerReport;
