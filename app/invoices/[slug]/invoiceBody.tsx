"use client";
import { Prisma } from "@prisma/client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "./Logo";
import { BsFillPrinterFill, BsPrinterFill } from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";
import { GrPrevious } from "react-icons/gr";
import { useSearchParams } from "next/navigation";

interface InvoiceBodyProps {
    data: invoice | null;
}

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        Parts: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ data }) => {
    let totalAmount = 0;

    const searchParams = useSearchParams();
    console.log(searchParams.get("num"));

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (data && data.lineItems) {
        data.lineItems.forEach((item) => {
            totalAmount += item.quantity * item.product.price;
        });
    }
    let itemsNumber = 0;

    return (
        <>
            <div
                className=" mx-auto bg-slate-300  p-5 rounded font-semibold min-h-screen "
                ref={componentRef}
            >
                <div className="flex mr-auto justify-end">
                    <MdNavigateNext size={"40px"} />
                    <GrPrevious size={"40px"} />
                    <button
                        onClick={handlePrint}
                        className="print-button  w-fit block"
                    >
                        <BsFillPrinterFill size={"40px"} />
                    </button>
                </div>
                <Logo />
                <div className="flex gap-10 mb-4 border-y-2 justify-between border-black py-5">
                    <div className="flex flex-col gap-4">
                        <div className="text-lg flex">
                            <label className="w-[102px]">اسم العميل </label>
                            <div className="w-fit  rounded-md text-lg">
                                :{" "}
                                <span className="pr-2">
                                    {data?.customer.name.toLocaleUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="text-lg flex">
                            <label className="w-[102px]">تاريخ الفاتورة</label>
                            <div className="w-fit  rounded-md ">
                                :
                                <span className="pr-2">
                                    {data
                                        ? data.date.toLocaleDateString(
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
                    <div className=" ml-8 text-lg">
                        رقم الفاتورة :
                        <span className="mr-5 tracking-[3px] text-2xl">
                            {data?.number.toLocaleString("ar-EG", {
                                useGrouping: false,
                            })}
                        </span>
                    </div>
                </div>
                {/* items */}
                <div className="overflow-x-auto mt-4 w-[70%] mx-auto">
                    <table className="table table-xs">
                        {/* head */}
                        <thead>
                            <tr className="bg-slate-500">
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    م
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    البيان
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    السعر
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    الكمية
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black"
                                >
                                    القيمة
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {data?.lineItems.map((item) => {
                                itemsNumber += 1;
                                return (
                                    <tr key={item.id}>
                                        <th
                                            align="center"
                                            className="text-lg text-black font-semibold border border-black"
                                        >
                                            {itemsNumber}
                                        </th>
                                        <th
                                            align="right"
                                            className="text-lg text-black font-semibold border border-black"
                                        >
                                            {item.product.name}
                                        </th>
                                        <td
                                            align="center"
                                            className="text-lg text-black font-semibold border border-black"
                                        >
                                            {item.product.price.toLocaleString(
                                                "ar-EG",
                                                {
                                                    useGrouping: false,
                                                }
                                            )}
                                        </td>
                                        <td
                                            align="center"
                                            className="text-lg text-black font-semibold border border-black"
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
                                            className="text-lg text-black font-semibold border border-black"
                                        >
                                            {(
                                                item.product.price *
                                                item.quantity
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
                                    colSpan={4}
                                    align="left"
                                    className="text-lg text-black border border-black"
                                >
                                    إجمالي الفاتورة
                                </th>

                                <td
                                    colSpan={1}
                                    align="center"
                                    className="text-lg text-black border border-black bg-orange-300"
                                >
                                    {totalAmount.toLocaleString("ar-EG", {
                                        useGrouping: false,
                                    })}
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
