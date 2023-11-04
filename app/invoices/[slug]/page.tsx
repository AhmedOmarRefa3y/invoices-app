import prismaDb from "@/lib/prisma";
import React from "react";

interface InvoicePageProps {
    params: {
        slug: string;
    };
}

const InvoicePage: React.FC<InvoicePageProps> = async ({ params }) => {
    console.log(params);

    const data = await prismaDb.invoice.findFirst({
        where: {
            id: params.slug,
        },
        include: {
            customer: true,
            lineItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    let totalAmount = 0;
    if (data) {
        data.lineItems.map((item) => {
            totalAmount += item.quantity * item.product.price;
        });
    }
    return (
        <div className="h-[93%] w-full bg-slate-300 mt-3 p-5 rounded-lg font-semibold">
            <div className="mb-4 border-b-2 border-black pb-5">
                رقم الفاتورة :<span className="ml-5">{data?.number}</span>
            </div>
            <div className="flex gap-10 mb-4 border-b-2 border-black pb-5">
                <div>
                    <label>اسم العميل :</label>
                    <div className="w-fit  rounded-md ">
                        {data?.customer.name}
                    </div>
                </div>
                <div>
                    <label>تاريخ الفاتورة :</label>
                    <div className="w-fit  rounded-md ">
                        {data ? data.date.toDateString() : ""}
                    </div>
                </div>
            </div>
            {/* items */}
            <div className="overflow-x-auto mt-4">
                <table className="table">
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
                                <tr>
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
                                        {item.product.price}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.quantity}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.product.price * item.quantity}
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
                                {totalAmount}ج
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default InvoicePage;
