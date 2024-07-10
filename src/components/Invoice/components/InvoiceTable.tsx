"use client";

import InvoiceTableFoot from "./invoiceTableComps/InvoiceTableFoot";
import InvoiceTableHead from "./invoiceTableComps/InvoiceTableHead";
import InvoiceTableBody from "./invoiceTableComps/InvoiceTableBody";
import useReturnsInvoice, { InvoiceItem } from "@/lib/zustand/ReturnsInvoice";
import useInvoice from "@/lib/zustand/invoiceStore";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

interface InvoiceTableProps {
    type: "sales" | "returns" | "purchases";
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ type }) => {
    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();
    const addRow = {
        sales: SalesStore.addRow,
        returns: ReturnsStore.addRow,
        purchases: PurchasesStore.AddRow,
    };

    return (
        <div className="">
            <div className="mt-4 h-full ">
                <div className=" max-h-[200px] overflow-y-auto ">
                    <table className="w-full max-h-[200px] overflow-y-auto  border-separate border-spacing-0">
                        <InvoiceTableHead />
                        <InvoiceTableBody type={type} />
                        <InvoiceTableFoot type={type} />
                    </table>
                </div>
                <div
                    className="flex items-center justify-start gap-2 pr-2 cursor-pointer text-sky-500 hover:text-amber-500 "
                    onClick={addRow[type]}
                >
                    اضافة خانة
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
