import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import useInvoice, { InvoiceItem } from "@/lib/zustand/invoiceStore";
import { Delete } from "lucide-react";
import { useTranslations } from "next-intl";

const CommandItemIActions = ({
    itemInInvoice,
    type,
}: {
    itemInInvoice: InvoiceItem;
    type: "sales" | "returns" | "purchases";
}) => {
    const t = useTranslations("invoice");
    const a = useTranslations("actions");

    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();

    const DelteItem = {
        sales: SalesStore.DelteItem,
        returns: ReturnsStore.DelteItem,
        purchases: PurchasesStore.DelteItem,
    };

    const updateItem = {
        sales: SalesStore.updateItem,
        returns: ReturnsStore.updateItem,
        purchases: PurchasesStore.UpdateItem,
    };

    return (
        <>
            <td
                align="center"
                className="text-lg font-semibold border border-stone-300 border-l-0 border-t-0"
            >
                <input
                    className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={1}
                    value={
                        itemInInvoice.quantity > 0 ? itemInInvoice.quantity : ""
                    }
                    onChange={(e) =>
                        updateItem[type](itemInInvoice.number, {
                            quantity:
                                parseFloat(e.target.value) > 1
                                    ? parseFloat(e.target.value)
                                    : 1,
                        })
                    }
                    aria-label={t("quantity")}
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold border border-stone-300 border-l-0 border-t-0"
            >
                <input
                    className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={0}
                    value={itemInInvoice.price >= 0 ? itemInInvoice.price : ""}
                    onChange={(e) =>
                        updateItem[type](itemInInvoice.number, {
                            price:
                                parseFloat(e.target.value) > 0
                                    ? parseFloat(e.target.value)
                                    : 0,
                        })
                    }
                    aria-label={t("price")}
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold min-w-[100px] border border-stone-300 border-l-0 border-t-0"
            >
                {itemInInvoice.price > 0 && itemInInvoice.quantity > 0
                    ? (itemInInvoice.price * itemInInvoice.quantity).toFixed(2)
                    : ""}
            </td>
            <td
                colSpan={1}
                align="center"
                className="text-lg border border-stone-300 border-l-0 border-t-0"
            >
                <Delete
                    onClick={() => {
                        DelteItem[type](itemInInvoice.number);
                    }}
                    className="text-2xl text-red-600"
                    aria-label={a("delete")}
                />
            </td>
        </>
    );
};

export default CommandItemIActions;
