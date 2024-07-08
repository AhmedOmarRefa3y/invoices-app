import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandSelect";

interface InvoiceTableBodyProps {
    items: {
        id: string;
        name: string;
        price: number;
        number: number;
        quantity: number;
    }[];
    updateItem: (number: number, item: Partial<InvoiceItem>) => void;
}

const InvoiceTableBody = ({ items, updateItem }: InvoiceTableBodyProps) => {
    return (
        <tbody className="text-black">
            {items.map((item, i) => {
                return (
                    <tr key={i + 1} className="bg-white">
                        <td className="font-semibold text-center  border  border-t-0 border-stone-300 ">
                            {i + 1}
                        </td>
                        <CommandItemSelect
                            itemInInvoice={item}
                            updateItem={updateItem}
                        />
                        <CommandItemIActions itemInInvoice={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
