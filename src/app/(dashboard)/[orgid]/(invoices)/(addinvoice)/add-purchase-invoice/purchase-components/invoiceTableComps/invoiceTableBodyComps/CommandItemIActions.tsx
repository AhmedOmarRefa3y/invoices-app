import usePurchaseInvoice, {
    PurchaseInvoiceItem,
} from "@/lib/zustand/PurchaseStore";
import { Delete } from "lucide-react";
const CommandItemIActions = ({
    itemInInvoice,
}: {
    itemInInvoice: PurchaseInvoiceItem;
}) => {
    const DataStore = usePurchaseInvoice();
    const { UpdateItem, DelteItem } = DataStore;
    return (
        <>
            <td
                align="center"
                className="text-lg font-semibold border border-stone-300 border-r-0 border-t-0  "
            >
                <input
                    className="w-full  p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={1}
                    value={
                        itemInInvoice.quantity > 0 ? itemInInvoice.quantity : ""
                    }
                    onChange={(e) =>
                        UpdateItem(itemInInvoice.number, {
                            quantity:
                                parseFloat(e.target.value) > 1
                                    ? parseFloat(e.target.value)
                                    : 1,
                        })
                    }
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold  border border-stone-300 border-r-0 border-t-0"
            >
                <input
                    className="w-full  p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={0}
                    value={itemInInvoice.price >= 0 ? itemInInvoice.price : ""}
                    onChange={(e) =>
                        UpdateItem(itemInInvoice.number, {
                            price:
                                parseFloat(e.target.value) > 0
                                    ? parseFloat(e.target.value)
                                    : 0,
                        })
                    }
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold min-w-[100px]   border border-stone-300 border-r-0 border-t-0"
            >
                {itemInInvoice.price > 0 && itemInInvoice.quantity > 0
                    ? (itemInInvoice.price * itemInInvoice.quantity).toFixed(2)
                    : ""}
            </td>
            <td
                colSpan={1}
                align="center"
                className="text-lg  border border-stone-300 border-r-0 border-t-0"
            >
                <Delete
                    onClick={() => {
                        DelteItem(itemInInvoice.number);
                    }}
                    className="text-2xl text-red-600"
                />
            </td>
        </>
    );
};

export default CommandItemIActions;
