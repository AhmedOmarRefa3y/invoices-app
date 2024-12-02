"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import EditInvoiceBtn, { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { Vazirmatn } from "next/font/google";
import {
    GetAvaiableSalesInvoices,
    GetAvaiableReturnsInvoices,
} from "@/actions/invoice";

interface InvoiceBodyProps {
    EditInvoiceD: EditInvoiceT | null;
    InvoiceData: Invoice | ReturnedInvoice | null;
    label: string;
    type: "sales" | "returns";
}

type Invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        orders: {
            include: {
                Product: true;
            };
        };
        payment: true;
    };
}>;

type ReturnedInvoice = Prisma.ReturnedInvoiceGetPayload<{
    include: {
        customer: true;
        orders: {
            include: {
                Product: true;
            };
        };
    };
}>;
const InvoiceComp: React.FC<InvoiceBodyProps> = ({
    EditInvoiceD,
    InvoiceData,
    label,
    type,
}) => {
    const params: { orgid: string } = useParams();
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: true,
        documentTitle: `فاتورة ${InvoiceData?.number} للعميل ${InvoiceData?.customer.name}`,
    });
    let itemsNumber = 0;
    return (
        <>
            <div
                className="h-full max-w-3xl w-full p-5 mx-auto font-semibold whitespace-nowrap border print:w-full print:h-screen border-stone-300"
                ref={componentRef}
            >
                <InvoiceHeader />
                <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
                    <div className="sm:text-4xl text-2xl">{label}</div>
                    <div className="sm:absolute left-0 flex items-center justify-center gap-2">
                        {type === "sales" && (
                            <>
                                <div>
                                    <EditInvoiceBtn
                                        Invoice={EditInvoiceD}
                                        orgid={params.orgid || ""}
                                        className="h-full sm:p-2 sm:text-lg text-base sm:font-bold font-semibold text-black bg-blue-400 print:hidden hover:bg-blue-600 py-1 px-2 rounded"
                                    />
                                </div>
                                <Link
                                    className="sm:p-2 px-2 py-1 mr-auto sm:text-lg  sm:font-bold font-semibold text-base duration-300 bg-blue-400 rounded print:hidden hover:bg-blue-600"
                                    href={`/${params.orgid}/sales/releaseorder?num=${InvoiceData?.number}`}
                                >
                                    إذن التحميل
                                </Link>
                            </>
                        )}
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
                                    {InvoiceData?.customer.name.toLocaleUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex sm:pr-4 text-lg">
                            <label className="w-[102px]">تاريخ الفاتورة</label>
                            <div className="rounded-md w-fit ">
                                :
                                <span className="pr-2">
                                    {InvoiceData
                                        ? InvoiceData.date.toLocaleDateString(
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
                            رقم الفاتورة :
                            <span className=" tracking-[3px]">
                                {InvoiceData?.number.toLocaleString("ar-EG", {
                                    useGrouping: false,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-end mr-auto">
                            <NaviagteInvoices type={type} />
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
                    <div className="overflow-x-auto  sm:w-full print:w-full mx-auto">
                        <table className="table min-w-[500px] sm:w-full mx-auto ">
                            {/* head */}
                            <thead>
                                <tr className="bg-orange-300">
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[5%] py-1 px-1"
                                    >
                                        م
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[65%] py-1 px-3"
                                    >
                                        البيان
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        الكمية
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        السعر
                                    </th>

                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        القيمة
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {InvoiceData?.orders.map((item) => {
                                    itemsNumber += 1;
                                    return (
                                        <tr key={item.id}>
                                            <th
                                                align="center"
                                                className=" text-black font-semibold border border-black py-[2px] px-1"
                                            >
                                                {itemsNumber}
                                            </th>
                                            <th
                                                align="right"
                                                className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-right"
                                            >
                                                {item.Product?.name}
                                            </th>

                                            <td
                                                align="center"
                                                className="px-3 font-semibold text-black border border-black telg"
                                            >
                                                {item.quantity.toLocaleString(
                                                    "ar-EG",
                                                    {
                                                        useGrouping: false,
                                                    }
                                                )}
                                            </td>
                                            <td
                                                align="center"
                                                className="px-3 font-semibold text-black border border-black "
                                            >
                                                {item.price.toLocaleString(
                                                    "ar-EG",
                                                    {
                                                        useGrouping: false,
                                                    }
                                                )}
                                            </td>
                                            <td
                                                align="center"
                                                className="px-3 font-semibold text-black border border-black "
                                            >
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString("ar-EG", {
                                                    useGrouping: false,
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th
                                        colSpan={3}
                                        align="left"
                                        className="text-lg text-black border border-black"
                                    >
                                        إجمالي الفاتورة
                                    </th>

                                    <td
                                        colSpan={2}
                                        align="center"
                                        className="text-lg text-black bg-orange-300 border border-black"
                                    >
                                        {InvoiceData?.amount.toLocaleString(
                                            "ar-EG",
                                            {
                                                useGrouping: false,
                                            }
                                        )}
                                        ج
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoiceComp;

const NaviagteInvoices = ({ type }: { type: "sales" | "returns" }) => {
    const router = useRouter();
    const { orgid, num }: { orgid: string; num: string } = useParams();
    console.log(orgid, num);

    const [invoices, setInvoices] = useState<
        {
            number: number;
        }[]
    >([]);
    useEffect(() => {
        const getData = async () => {
            const AvaiableInvoices =
                type === "sales"
                    ? await GetAvaiableSalesInvoices(orgid)
                    : await GetAvaiableReturnsInvoices(orgid);
            setInvoices(AvaiableInvoices);
        };
        getData();
    }, [orgid]);
    console.log(invoices);

    const curruntInvoiceIndex = invoices.findIndex(
        (item) => item.number === parseInt(num)
    );

    const PerviousInvoice = invoices[curruntInvoiceIndex - 1]?.number;
    const nextInvoice = invoices[curruntInvoiceIndex + 1]?.number;
    console.log(PerviousInvoice);
    return (
        <>
            <Link
                href={
                    type === "sales"
                        ? `/${orgid}/sales/showInvoice/${nextInvoice || num}`
                        : `/${orgid}/returnedInvoices/showREtInvoice/${
                              nextInvoice || num
                          }`
                }
                className={`print:hidden  w-fit block ${
                    !nextInvoice && "cursor-default"
                } `}
                prefetch={true}
            >
                <ArrowBigRight
                    size={"30px"}
                    className={`${
                        nextInvoice ? "hover:text-orange-500" : ""
                    }   duration-300 text-6xl`}
                />
            </Link>
            <Link
                href={
                    type === "sales"
                        ? `/${orgid}/sales/showInvoice/${
                              PerviousInvoice || num
                          }`
                        : `/${orgid}/returnedInvoices/showREtInvoice/${
                              PerviousInvoice || num
                          }`
                }
                className={`print:hidden  w-fit block ${
                    !PerviousInvoice && "cursor-default"
                } `}
                prefetch={true}
            >
                <ArrowBigLeft
                    size={"30px"}
                    className={`${
                        PerviousInvoice ? "hover:text-orange-500" : ""
                    }   duration-300 text-3xl`}
                />
            </Link>
        </>
    );
};
