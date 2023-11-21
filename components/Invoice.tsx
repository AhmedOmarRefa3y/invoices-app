import React from "react";
interface InvoicePageProps {
    invoice: {
        id: string;
        customerName: string;
        customerId: string;
        date: Date;
        number: number;
        paidAmount: number | undefined;
        createdAt: Date;
        products: {
            id: string;
            name: string;
            quantity: number;
            price: number;
        }[];
    };
    className?: string;
}

const InvoiceModal: React.FC<InvoicePageProps> = ({ invoice }) => {
    let totalAmount = 0;
    if (invoice) {
        invoice.products.map((item) => {
            totalAmount += item.quantity * item.price;
        });
    }
    return (
        <div className="w-full bg-slate-300 bg-opacity-0 rounded-lg font-semibold p-10 mx-auto ">
            <div className="mb-4 border-b-2 border-black pb-3 ">
                <div className="w-fit h-fit bg-slate-500 p-2 rounded-md bg-opacity-30 ">
                    رقم الفاتورة :
                    <span className="mr-5">
                        {invoice?.number.toLocaleString("ar-EG", {
                            useGrouping: false,
                        })}
                    </span>
                </div>
            </div>
            <div className="flex gap-10 mb-4 border-b-2 border-black pb-5">
                <div>
                    <label>اسم العميل :</label>
                    <div className="w-fit  rounded-md ">
                        {invoice.customerName}
                    </div>
                </div>
                <div>
                    <label>تاريخ الفاتورة :</label>
                    <div className="w-fit  rounded-md ">
                        {invoice.date.toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className=" table-sm border-2 ">
                    <thead className="">
                        <tr className="bg-slate-500">
                            <th align="center" className="text-lg text-black ">
                                البيان
                            </th>
                            <th align="center" className="text-lg text-black ">
                                السعر
                            </th>
                            <th align="center" className="text-lg text-black ">
                                الكمية
                            </th>
                            <th align="center" className="text-lg text-black ">
                                القيمة
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice?.products.map((item) => {
                            return (
                                <tr key={item.id} className="border-b-1 ">
                                    <th
                                        align="center"
                                        className="text-lg text-black font-semibold w-4/5"
                                    >
                                        {item.name}
                                    </th>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold "
                                    >
                                        {item.price.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold "
                                    >
                                        {item.quantity.toLocaleString("ar-EG", {
                                            useGrouping: false,
                                        })}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold "
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
                                className="text-lg text-black mr-auto"
                            >
                                إجمالي الفاتورة
                            </th>
                            <td
                                colSpan={1}
                                align="center"
                                className="text-lg text-black  bg-orange-300"
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
    );
};

export default InvoiceModal;
