"use client";

import useInvoice from "@/lib/zustand";

const InvoiceItems = () => {
    const { items, DelteItem } = useInvoice();
    const DeletItemHandler = (id: string) => {
        DelteItem(id);
    };

    let totalAmount = 0;
    items.map((item) => {
        totalAmount += item.quantity * item.price;
        console.log(totalAmount);
    });
    return (
        <div className=" mt-4 rounded-lg  overflow-auto bg-gray border-gray-400 shadow-lg bg-opacity-70 text-white ">
            <table className="table ">
                {/* head */}
                <thead>
                    {items.length < 1 ? null : (
                        <tr className="bg-gray-300 ">
                            <th
                                align="center"
                                className="text-lg text-black w-8/12"
                            >
                                البيان
                            </th>
                            <th align="center" className="text-lg text-black ">
                                السعر
                            </th>
                            <th align="center" className="text-lg text-black  ">
                                الكمية
                            </th>
                            <th align="center" className="text-lg text-black ">
                                القيمة
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black  "
                            ></th>
                        </tr>
                    )}
                </thead>
                <tbody>
                    {/* row 1 */}
                    {items.map((item) => {
                        return (
                            <tr key={item.id}>
                                <th
                                    align="center"
                                    className="text-lg text-black font-semibold"
                                >
                                    {item.name}
                                </th>
                                <td
                                    align="center"
                                    className="text-lg text-black font-semibold "
                                >
                                    {item.price}
                                </td>
                                <td
                                    align="center"
                                    className="text-lg text-black font-semibold "
                                >
                                    {item.quantity}
                                </td>
                                <td
                                    align="center"
                                    className="text-lg text-black font-semibold"
                                >
                                    {item.price * item.quantity}
                                </td>
                                <td
                                    align="center"
                                    className="text-lg text-black "
                                >
                                    <button
                                        className="h-full p-2 px-5 flex items-center justify-center bg-red-600 rounded-md text-white "
                                        onClick={() =>
                                            DeletItemHandler(item.id)
                                        }
                                    >
                                        ازالة
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    {items.length < 1 ? (
                        <tr>
                            <th
                                colSpan={5}
                                align="center"
                                className="text-lg bg-gray-600 text-white"
                            >
                                لم تقم بإضافة اي صنف للفاتورة
                            </th>
                        </tr>
                    ) : (
                        <tr className="">
                            <th
                                colSpan={3}
                                align="left"
                                className="text-lg text-black "
                            >
                                إجمالي الفاتورة
                            </th>
                            <td
                                colSpan={1}
                                align="center"
                                className="text-lg text-black bg-teal-200 rounded-md"
                            >
                                {totalAmount}ج
                            </td>
                        </tr>
                    )}
                </tfoot>
            </table>
        </div>
    );
};

export default InvoiceItems;
