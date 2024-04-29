"use client";
import InvoiceHeader from "@/components/InvoiceHeader";
import { Button } from "@/components/ui/button";
import EditInvoiceBtn, { EditInvoiceT } from "@/components/ui/editInvoiceBtn";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import { ArrowBigLeft, ArrowBigRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface InvoiceBodyProps {
    invoices: invoice[];
}

type invoice = Prisma.InvoiceGetPayload<{
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

const InvoiceBody: React.FC<InvoiceBodyProps> = ({ invoices }) => {
    const router = useRouter();
    const params: { orgid: string } = useParams();

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
        removeAfterPrint: true,
    });

    let EditInvoiceD: EditInvoiceT | null = curruntInvoice
        ? {
              CreatedAt: curruntInvoice.createdAt,
              customer: curruntInvoice.customer,
              customerName: curruntInvoice.customer.name,
              date: curruntInvoice.date,
              id: curruntInvoice.id,
              Items: curruntInvoice.orders.map((item) => {
                  return item;
              }),
              number: curruntInvoice.number,
              PaidAmount: curruntInvoice.payment?.amount as number,
          }
        : null;

    let itemsNumber = 0;
    return (
        <>
            <div
                className="h-full max-w-4xl p-5 mx-auto font-semibold bg-white border print:w-full print:h-screen border-stone-300"
                ref={componentRef}
            >
                <InvoiceHeader />
                <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
                    <div className="sm:text-4xl text-2xl">فاتورة مبدئية</div>
                    <div className="sm:absolute left-0 flex items-center justify-center gap-2">
                        <div>
                            <EditInvoiceBtn
                                Invoice={EditInvoiceD}
                                orgid={params.orgid}
                                className="h-full sm:p-2 sm:text-lg text-base sm:font-bold font-semibold text-black bg-blue-400 print:hidden hover:bg-blue-600 py-1 px-2 rounded"
                            />
                        </div>
                        <Link
                            className="sm:p-2 px-2 py-1 mr-auto sm:text-lg  sm:font-bold font-semibold text-base duration-300 bg-blue-400 rounded print:hidden hover:bg-blue-600"
                            href={`/${params.orgid}/invoices/sales/releaseorder?num=${curruntInvoice?.number}`}
                        >
                            إذن التحميل
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
                            <label className="w-[102px]">تاريخ الفاتورة</label>
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
                            رقم الفاتورة :
                            <span className=" tracking-[3px]">
                                {num.toLocaleString("ar-EG", {
                                    useGrouping: false,
                                })}
                            </span>
                        </div>
                        <div className="flex justify-end mr-auto">
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
                                    }   duration-300 text-6xl`}
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
                                    }   duration-300 text-3xl`}
                                />
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
                                                className="px-3 font-semibold text-black border border-black "
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
            </div>
        </>
    );
};

export default InvoiceBody;
