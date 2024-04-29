"use client";
import { Prisma } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { ReleaseOrderData } from "./releaseOrder-utils";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";

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
        <>
            <div
                className=" mx-auto bg-white max-w-4xl print:w-full  p-5 print:h-screen border border-stone-300 font-semibold h-full flex flex-col "
                ref={componentRef}
            >
                <div className=" border-b-2 border-black flex items-center justify-center text-4xl py-5">
                    إذن صرف بضاعة
                </div>
                <div className="flex  mb-4 border-b-2 justify-between w-full border-black py-5">
                    <div className="flex flex-col gap-4 w-[60%]">
                        <div className="text-lg flex pr-4">
                            <label className="w-[102px]">اسم العميل </label>
                            <div className="w-fit  rounded-md text-lg">
                                :{" "}
                                <span className="pr-2">
                                    {curruntInvoice?.customer.name.toLocaleUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="text-lg flex  pr-4">
                            <label className="w-[102px]">تاريخ الفاتورة</label>
                            <div className="w-fit  rounded-md ">
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
                    <div className=" ml-8 text-lg flex flex-col gap-1 justify-center items-center ">
                        <div>
                            رقم الإذن :
                            <span className=" tracking-[3px] text-2xl">
                                {num.toLocaleString("ar-EG", {
                                    useGrouping: false,
                                })}
                            </span>
                        </div>
                        <div className="flex mr-auto justify-end">
                            <button
                                onClick={findNextInvoice}
                                className="print:hidden  w-fit block"
                            >
                                <ArrowBigRight
                                    size={"30px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                            <button
                                onClick={findPerviousInvoice}
                                className="print:hidden  w-fit block"
                            >
                                <ArrowBigLeft
                                    size={"30px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="print:hidden  w-fit block"
                            >
                                <Printer
                                    size={"40px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {/* items */}
                <div className="overflow-x-auto mt-4 w-[100%] mx-auto">
                    <table className="table table-xs">
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
                <div className="print:flex hidden justify-between   text-lg  mt-auto py-10 px-6  ">
                    <div className="">
                        <div>
                            <span className=" w-[95px]  inline-block ml-5">
                                اسم المستلم
                            </span>
                            :
                        </div>
                        <div>
                            {" "}
                            <span className="w-[95px]   inline-block ml-5">
                                التوقيع
                            </span>
                            :
                        </div>
                    </div>
                    <div>
                        <div>القائم بالتحميل</div>
                    </div>
                    <div>
                        <div>اعداد</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoiceBody;
