"use client";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useReactToPrint } from "react-to-print";
import Logo from "./Logo";

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
                        Parts: {
                            include: {
                                product: {
                                    include: {
                                        unit: true;
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        payment: true;
    };
}>;
export const dynamic = "force-dynamic";

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const num: number = parseInt(searchParams.get("num") || "1");

    const curruntInvoice: invoice | undefined = invoices.find(
        (invoice) => invoice.number === num
    );
    const componentRef = useRef(null);

    const curruntInvoiceIndex = invoices.findIndex(
        (item) => item.number === curruntInvoice?.number
    );

    const PerviousInvoice = invoices[curruntInvoiceIndex - 1];
    const nextInvoice = invoices[curruntInvoiceIndex + 1];

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    let itemsNumber = 0;
    return (
        <>
            <div
                className=" mx-auto bg-slate-300 max-w-4xl print:w-full  p-5 print:bg-white    rounded font-semibold min-h-screen "
                ref={componentRef}
            >
                <Logo />
                <div className=" border-y-2 border-black flex items-center justify-center relative  py-5">
                    <div className="text-4xl">فاتورة مبدئية</div>
                    <Link
                        className="mr-auto text-lg print:hidden bg-blue-400  p-2 rounded absolute left-0 hover:bg-blue-600 duration-300"
                        href={`/invoices/sales/releaseorder?num=${curruntInvoice?.number}`}
                    >
                        إذن التحميل
                    </Link>
                </div>
                <div className="flex mb-4 border-b-2  justify-between w-full border-black py-5">
                    <div className="flex flex-col gap-4 w-[60%]">
                        <div className="text-lg flex pr-4 ">
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
                            رقم الفاتورة :
                            <span className=" tracking-[3px] text-2xl">
                                {num.toLocaleString("ar-EG", {
                                    useGrouping: false,
                                })}
                            </span>
                        </div>
                        <div className="flex mr-auto justify-end">
                            <button
                                onClick={() => {
                                    if (nextInvoice) {
                                        router.push(
                                            `?num=${nextInvoice.number}`
                                        );
                                    }
                                }}
                                className={`print:hidden  w-fit block ${
                                    !nextInvoice && "cursor-default"
                                } `}
                            >
                                <GrNext
                                    size={"30px"}
                                    className={`${
                                        nextInvoice
                                            ? "hover:text-orange-500"
                                            : ""
                                    }   duration-300`}
                                />
                            </button>
                            <button
                                onClick={() => {
                                    if (PerviousInvoice) {
                                        router.push(
                                            `?num=${PerviousInvoice.number}`
                                        );
                                    }
                                }}
                                className={`print:hidden  w-fit block ${
                                    !PerviousInvoice && "cursor-default"
                                } `}
                            >
                                <GrPrevious
                                    size={"30px"}
                                    className={`${
                                        PerviousInvoice
                                            ? "hover:text-orange-500"
                                            : ""
                                    }   duration-300`}
                                />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="print:hidden  w-fit block"
                            >
                                <BsFillPrinterFill
                                    size={"40px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {/* items */}
                <div className="overflow-x-auto mt-4 w-[70%] print:w-full mx-auto">
                    <table className="table table-xs">
                        {/* head */}
                        <thead>
                            <tr className="bg-orange-300">
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[5%]"
                                >
                                    م
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[65%]"
                                >
                                    البيان
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    الكمية
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    السعر
                                </th>

                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    القيمة
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {curruntInvoice?.lineItems.map((item) => {
                                itemsNumber += 1;
                                return (
                                    <tr key={item.id}>
                                        <th
                                            align="center"
                                            className="text-base text-black font-semibold border border-black"
                                        >
                                            {itemsNumber}
                                        </th>
                                        <th
                                            align="right"
                                            className="text-base text-black font-semibold border border-black"
                                        >
                                            {item.product.name}
                                        </th>

                                        <td
                                            align="center"
                                            className="text-base text-black font-semibold border border-black"
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
                                            className="text-base text-black font-semibold border border-black"
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
                                            className="text-base text-black font-semibold border border-black"
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
                                    className="text-lg text-black border border-black bg-orange-300"
                                >
                                    {curruntInvoice?.amount.toLocaleString(
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
        </>
    );
};

export default InvoiceBody;
