"use client";

import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import InvoiceTableHead from "./invoiceTableComps/InvoiceTableHead";
import InvoiceTableBody from "./invoiceTableComps/InvoiceTableBody";
import InvoiceTableFoot from "./invoiceTableComps/InvoiceTableFoot";

const InvoiceTable = () => {
    const DataStore = usePurchaseInvoice();
    const { AddRow } = DataStore;

    return (
        <div className="">
            <div className="mt-4 h-full ">
                <div className=" max-h-[200px] overflow-y-auto ">
                    <table className="w-full max-h-[200px] overflow-y-auto  border-separate border-spacing-0">
                        <InvoiceTableHead />
                        <InvoiceTableBody />
                        <InvoiceTableFoot />
                    </table>
                </div>
                <div
                    className="flex items-center justify-start gap-2 pr-2 cursor-pointer text-sky-500 hover:text-amber-500 "
                    onClick={AddRow}
                >
                    اضافة خانة
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
