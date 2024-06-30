"use client";
import { Prisma } from "@prisma/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { ReleaseOrderData } from "./releaseOrder-utils";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InvoiceBodyProps {
    invoices: invoice[];
}

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        unit: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const num: number = parseInt(searchParams.get("num") || "1");
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const params: { orgid: string } = useParams();

    const { curruntInvoice, items } = ReleaseOrderData(invoices, num);

    const findPerviousInvoice = () => {
        const curruntInvoiceIndex = invoices.findIndex(
            (item) => item.number === curruntInvoice?.number
        );

        const PerviousInvoice = invoices[curruntInvoiceIndex - 1];
        if (PerviousInvoice) {
            router.push(`?num=${PerviousInvoice.number}`);
        }
    };
    const findNextInvoice = () => {
        const curruntInvoiceIndex = invoices.findIndex(
            (item) => item.number === curruntInvoice?.number
        );

        const nextInvoice = invoices[curruntInvoiceIndex + 1];

        if (nextInvoice) {
            router.push(`?num=${nextInvoice.number}`);
        }
    };
    return (
        <div
            className="h-full sm:max-w-4xl max-w-full p-5 mx-auto font-semibold bg-white border print:w-full print:h-screen border-stone-300"
            ref={componentRef}
        >
            <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
                <div className="sm:text-4xl text-2xl">إذن صرف بضاعة</div>
                <div className="sm:absolute left-0 flex items-center justify-center gap-2">
                    <Link
                        className="sm:p-2 px-2 py-1 mr-auto sm:text-lg  sm:font-bold font-semibold text-base duration-300 bg-blue-400 rounded print:hidden hover:bg-blue-600"
                        href={`/${params.orgid}/sales/showInvoice?num=${curruntInvoice?.number}`}
                    >
                        عرض الفاتورة
                    </Link>
                    <Button
                        onClick={handlePrint}
                        className="block w-fit  h-fit sm:p-2 py-1 px-2 mr-auto sm:text-lg  sm:font-bold font-semibold text-base bg-blue-400 rounded print:hidden text-black hover:bg-blue-600 sm:hidden "
                    >
                        طباعة
                    </Button>
                </div>
            </div>
            <div className="flex sm:flex-row flex-col justify-between w-full py-5 mb-4 border-b-2 border-black">
                <div className="flex flex-col sm:gap-4 order-2 sm:order-1 gap-1 sm:w-[60%]">
                    <div className="flex sm:pr-4 text-lg ">
                        <label className="w-[102px]">اسم العميل </label>
                        <div className="text-lg rounded-md w-fit">
                            :{" "}
                            <span className="pr-2">
                                {curruntInvoice?.customer.name.toLocaleUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex sm:pr-4 text-lg">
                        <label className="w-[102px]">تاريخ الاذن</label>
                        <div className="rounded-md w-fit ">
                            :
                            <span className="pr-2">
                                {curruntInvoice
                                    ? curruntInvoice.date.toLocaleDateString(
                                          "ar-EG",
                                          {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          }
                                      )
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex sm:flex-col order-1  sm:items-center justify-center gap-1 sm:ml-8 text-lg ">
                    <div className="text-lg">
                        رقم الاذن :
                        <span className=" tracking-[3px]">
                            {num.toLocaleString("ar-EG", {
                                useGrouping: false,
                            })}
                        </span>
                    </div>
                    <div className="flex justify-end mr-auto">
                        <button
                            onClick={findNextInvoice}
                            className="print:hidden  w-fit block"
                        >
                            <ArrowBigRight size={"30px"} />
                        </button>
                        <button
                            onClick={findPerviousInvoice}
                            className="print:hidden  w-fit block"
                        >
                            <ArrowBigLeft size={"30px"} />
                        </button>
                        <button
                            onClick={handlePrint}
                            className="lg:block print:hidden w-fit hidden"
                        >
                            <Printer
                                size={"40px"}
                                className="duration-300 cursor-pointer hover:text-orange-500"
                            />
                        </button>
                    </div>
                </div>
            </div>
            {/* items */}
            <div className=" p-2 border border-black overflow-hidden sm:border-none">
                <div className="overflow-x-auto  sm:w-[70%]  print:w-full mx-auto">
                    <table className="table min-w-[500px] mx-auto table-xs">
                        {/* head */}
                        <thead>
                            <tr className="bg-slate-500">
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[5%] py-1"
                                >
                                    م
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[50%] px-3"
                                >
                                    البيان
                                </th>

                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[5%] px-3"
                                >
                                    الكمية
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%] px-3"
                                >
                                    الوحدة
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[25%] px-3"
                                >
                                    ملاحظات
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th
                                            align="center"
                                            className="text-base text-black font-semibold border border-black py-1"
                                        >
                                            {index + 1}
                                        </th>
                                        <th
                                            align="right"
                                            className="text-base text-black font-semibold border border-black px-3"
                                        >
                                            {item.name}
                                        </th>
                                        <th
                                            align="center"
                                            className="text-base text-black font-semibold border border-black"
                                        >
                                            {item.quantity}
                                        </th>
                                        <th
                                            align="center"
                                            className="text-base text-black font-semibold border border-black"
                                        >
                                            {item.unit}
                                        </th>
                                        <th
                                            align="center"
                                            className="text-base text-black font-semibold border border-black"
                                        ></th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceBody;
