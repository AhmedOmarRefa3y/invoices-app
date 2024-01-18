import { SaveReturnedInvoice, saveREtInvoiceType } from "@/actions/invoice";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const saveREtInvoiceToDB = async (
    customerId: string | null,
    date: Date
) => {
    const router = useRouter();
    const Invoice = useInvoice();
    let InvoiceItems: {
        id: string;
        number: number;
        name: string;
        quantity: number;
        price: number;
    }[] = [];
    Invoice.items.map((item) => {
        if (item.quantity > 0) {
            InvoiceItems.push(item);
        }
    });

    const InvoiceInfo: saveREtInvoiceType = {
        customerId: customerId || "",
        date: date,
        InvoiceItems: Invoice.items.map((item) => {
            return {
                id: item.id,
                quantity: item.quantity,
                price: item.price,
            };
        }),
        invoiceAmount: Invoice.invoiceAmount,
    };

    if (InvoiceItems.length > 0) {
        const res = await SaveReturnedInvoice(InvoiceInfo);
        if (res.status === "ok") {
            Invoice.clearData();
            router.push(
                `/returnedInvoices/showREtInvoice?num=${res.data?.number}`
            );
            toast.success("تم حفظ الفاتورة بنجاح");
        } else {
            toast.error(res.message);
        }
    } else {
        toast.error("لم تقم بإضافة اي صنف للفاتورة");
    }
};
