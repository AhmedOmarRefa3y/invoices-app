import useInvoice from "@/lib/zustand";
import React from "react";

const InvoiceTableFoot = () => {
    const DataStore = useInvoice();
    const { items } = DataStore;
    let totalAmount = 0;

    items.map((item) => {
        totalAmount += item.price * item.quantity;
    });

    return (
        <tfoot className="">
            <tr className="border-t">
                <th
                    colSpan={4}
                    align="center"
                    className="pl-2 text-lg text-left   "
                >
                    إجمالي الفاتورة
                </th>
                <td
                    colSpan={1}
                    align="center"
                    className="text-lg text-black bg-[#DCD6F7] "
                >
                    {totalAmount.toFixed(2)}ج
                </td>
            </tr>
        </tfoot>
    );
};

export default InvoiceTableFoot;
