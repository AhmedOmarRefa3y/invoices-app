"use client";
import { Prisma } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import InvoiceHeader from "@/components/InvoiceHeader";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

interface InvoiceBodyProps {
    invoices: invoice[];
}

type invoice = Prisma.ReturnedInvoiceGetPayload<{
    include: {
        customer: true;
        orders: {
            include: {
                Product: true;
            };
        };
    };
}>;

const RETinvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
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
                className=" mx-auto bg-white max-w-4xl print:w-full  p-5 border border-stone-300 print:h-screen  font-semibold h-full "
                ref={componentRef}
            >
                <InvoiceHeader />
                <div className=" border-y-2 border-black flex items-center justify-center relative  py-5">
                    <div className="text-4xl">فاتورة مرتجعات</div>
                </div>
                <div className="flex  mb-4 border-b-2  justify-between w-full border-black py-5">
                    <div className="flex flex-col gap-4 w-[35%]">
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
                                <ArrowBigRight
                                    size={"30px"}
                                    className={`${
                                        nextInvoice
                                            ? "hover:text-orange-500"
                                            : ""
                                    }   duration-300 `}
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
                                <ArrowBigLeft
                                    size={"30px"}
                                    className={`${
                                        PerviousInvoice
                                            ? "hover:text-orange-500"
                                            : ""
                                    }   duration-300 `}
                                />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="print:hidden  w-fit block"
                            >
                                {/* <BsFillPrinterFill
                                    size={"40px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                /> */}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto mt-4 w-full print:w-full ">
                    <table className="table table-xs mx-auto">
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
                            {curruntInvoice?.orders.map((item) => {
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
                                            className=" text-black font-semibold border border-black  px-3"
                                        >
                                            {item.Product?.name}
                                        </th>

                                        <td
                                            align="center"
                                            className=" telg text-black font-semibold border border-black px-3"
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
                                            className=" text-black font-semibold border border-black  px-3"
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
                                            className=" text-black font-semibold border border-black  px-3"
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

export default RETinvoiceBody;
