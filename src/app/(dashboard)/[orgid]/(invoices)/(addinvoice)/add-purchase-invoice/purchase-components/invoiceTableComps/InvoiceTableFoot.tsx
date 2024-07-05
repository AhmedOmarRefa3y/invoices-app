import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import React from "react";

const InvoiceTableFoot = () => {
    const DataStore = usePurchaseInvoice();
    const { PurchaseInvoiceItems } = DataStore;
    let totalAmount = 0;

    PurchaseInvoiceItems.map((item) => {
        totalAmount += item.price * item.quantity;
    });

    return (
        <tfoot className="">
            <tr className="border sticky bottom-0 bg-[#fafafa] ">
                <th
                    colSpan={4}
                    align="center"
                    className="pl-2 text-lg text-left  border border-stone-300"
                >
                    إجمالي الفاتورة
                </th>
                <td
                    colSpan={2}
                    align="center"
                    className="text-lg text-black bg-sky-500  border border-stone-300"
                >
                    {totalAmount.toFixed(2)}ج
                </td>
            </tr>
        </tfoot>
    );
};

export default InvoiceTableFoot;
