import useInvoice from "@/lib/zustand/invoiceStore";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandSelect";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

const InvoiceTableBody = () => {
    const DataStore = usePurchaseInvoice();
    const { PurchaseInvoiceItems } = DataStore;
    return (
        <tbody className="text-black">
            {PurchaseInvoiceItems.map((item, i) => {
                return (
                    <tr key={i + 1} className="bg-white">
                        <td className="font-semibold text-center  border  border-t-0 border-stone-300 ">
                            {i + 1}
                        </td>
                        <CommandItemSelect itemInInvoice={item} />
                        <CommandItemIActions itemInInvoice={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
