import React from "react";

import useInvoice from "@/lib/zustand/invoiceStore";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandItemPopover/CommandSelect";
import { ProductT } from "@/lib/types";

interface invoiceTableBodyT {
    products: {
        id: string;
        name: string;
        price: number;
        Part:
            | {
                  product: {
                      name: string;
                      price: number;
                  };
                  name: string;
                  partProductId: string;
                  quantity: number;
              }[];
        isAcomopsition: boolean;
        catgoryId: string;
        unitId: string;
    }[];
}

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
                        <CommandItemSelect
                            itemInInvoice={item}
                            products={products}
                        />
                        <CommandItemIActions itemInInvoice={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
