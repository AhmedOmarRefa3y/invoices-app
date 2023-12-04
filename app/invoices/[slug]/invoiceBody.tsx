"use client";
import { Prisma } from "@prisma/client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "./Logo";

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

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (data && data.lineItems) {
        data.lineItems.forEach((item) => {
            totalAmount += item.quantity * item.product.price;
        });
    }

    return (
        <>
            <div
                className=" mx-auto bg-slate-300  p-5 rounded font-semibold min-h-screen "
                ref={componentRef}
            >
                <Logo />
                <div className="mb-4 border-b-2 border-black pb-5 ">
                    رقم الفاتورة :
                    <span className="ml-5">
                        {data?.number.toLocaleString("ar-EG", {
                            useGrouping: false,
                        })}
                    </span>
                </div>
                <div className="flex gap-10 mb-4 border-b-2 border-black pb-5">
                    <div>
                        <label>اسم العميل :</label>
                        <div className="w-fit  rounded-md ">
                            {data?.customer.name.toLocaleUpperCase()}
                        </div>
                    </div>
                    <div>
                        <label>تاريخ الفاتورة :</label>
                        <div className="w-fit  rounded-md ">
                            {data
                                ? data.date.toLocaleDateString("ar-EG", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : ""}
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
                                return (
                                    <tr key={item.id}>
                                        <th
                                            align="center"
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
                                    colSpan={3}
                                    align="center"
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
            <button onClick={handlePrint}>Print this out!</button>
        </>
    );
};

export default InvoiceBody;
