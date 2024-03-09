"use client";
import { GoPlus } from "react-icons/go";

import useInvoice from "@/lib/zustand";
import { Prisma } from "@prisma/client";

import InvoiceTableFoot from "./invoiceTableComps/InvoiceTableFoot";
import InvoiceTableHead from "./invoiceTableComps/InvoiceTableHead";
import InvoiceTableBody from "./invoiceTableComps/InvoiceTableBody";

interface InvoiceTableProps {
    products: product[];
}

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: {
            include: {
                product: true;
            };
        };
    };
}>;
const InvoiceTable: React.FC<InvoiceTableProps> = ({ products }) => {
    const DataStore = useInvoice();
    const { addRow } = DataStore;

    return (
        <div className="">
            <div className="mt-4 h-full ">
                <div className=" overflow-hidden ">
                    <table className="w-full  border border-stone-300  ">
                        <InvoiceTableHead />
                        <InvoiceTableBody products={products} />
                        <InvoiceTableFoot />
                    </table>
                </div>
                <div
                    className="flex items-center justify-start gap-2 pr-2 cursor-pointer text-sky-500 hover:text-amber-500 "
                    onClick={addRow}
                >
                    اضافة خانة
                    <GoPlus className="text-lg" />
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
