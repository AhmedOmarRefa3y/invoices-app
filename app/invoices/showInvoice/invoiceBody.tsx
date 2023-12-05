"use client";
import { Prisma } from "@prisma/client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "./Logo";
import { BsFillPrinterFill, BsPrinterFill } from "react-icons/bs";
import { MdNavigateNext } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";
import { useRouter, useSearchParams } from "next/navigation";

interface InvoiceBodyProps {
    data: invoice | undefined;
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
    const router = useRouter();
    let totalAmount = 0;

    const searchParams = useSearchParams();
    console.log(searchParams.get("num"));
    const num: number = parseInt(searchParams.get("num") || "1");
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
                className=" mx-auto bg-slate-300 max-w-4xl print:w-full  p-5 rounded font-semibold min-h-screen "
                ref={componentRef}
            >
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
                            <GrNext
                                size={"30px"}
                                className="print:hidden cursor-pointer hover:text-orange-500 duration-300"
                                onClick={() => router.push(`?num=${num + 1}`)}
                            />
                            <GrPrevious
                                size={"30px"}
                                className="print:hidden cursor-pointer hover:text-orange-500 duration-300"
                                onClick={() =>
                                    router.push(`?num=${num - 1}&dec=true`)
                                }
                            />
                            <button
                                onClick={handlePrint}
                                className="print:hidden  w-fit block"
                            >
                                <BsFillPrinterFill
                                    size={"40px"}
                                    className="print:hidden cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                        </div>
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
                                    السعر
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
                                            {item.product.price.toLocaleString(
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
