import useInvoice from "@/lib/zustand/invoiceStore";
import CommandItemIActions from "./invoiceTableBodyComps/CommandItemIActions";
import CommandItemSelect from "./invoiceTableBodyComps/CommandItemPopover/CommandSelect";

const InvoiceTableBody = () => {
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
                        <CommandItemSelect itemInInvoice={item} />
                        <CommandItemIActions itemInInvoice={item} />
                    </tr>
                );
            })}
        </tbody>
    );
};

export default InvoiceTableBody;
