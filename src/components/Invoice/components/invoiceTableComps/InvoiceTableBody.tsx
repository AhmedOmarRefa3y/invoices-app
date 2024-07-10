import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandSelect";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

interface InvoiceTableBodyProps {
    type: "sales" | "returns" | "purchases";
}

const InvoiceTableBody = ({ type }: InvoiceTableBodyProps) => {
    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();
    const items = {
        sales: SalesStore.items,
        returns: ReturnsStore.items,
        purchases: PurchasesStore.PurchaseInvoiceItems,
    };
    const updateItem = {
        sales: SalesStore.updateItem,
        returns: ReturnsStore.updateItem,
        purchases: PurchasesStore.UpdateItem,
    };

    return (
        <tbody className="text-black">
            {items[type].map((item, i) => {
                return (
                    <tr key={i + 1} className="bg-white">
                        <td className="font-semibold text-center  border  border-t-0 border-stone-300 ">
                            {i + 1}
                        </td>
                        <CommandItemSelect
                            itemInInvoice={item}
                            updateItem={updateItem[type]}
                        />
                        <CommandItemIActions itemInInvoice={item} type={type} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
