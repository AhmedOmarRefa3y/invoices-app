import React from "react";

import useInvoice from "@/lib/zustand/invoiceStore";
import { Prisma } from "@prisma/client";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandItemPopover/CommandSelect";

interface invoiceTableBodyT {
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

const InvoiceTableBody: React.FC<invoiceTableBodyT> = ({ products }) => {
    const DataStore = useInvoice();
    const { items } = DataStore;
    return (
        <tbody className="text-black  ">
            {items.map((item, i) => {
                return (
                    <tr key={i + 1} className="bg-white">
                        <td className="font-semibold text-center border border-stone-300 ">
                            {i + 1}
                        </td>
                        <CommandItemSelect item={item} products={products} />
                        <CommandItemIActions item={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
