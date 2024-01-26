import { SaveReturnedInvoice, saveREtInvoiceType } from "@/actions/invoice";
import { Store } from "@/lib/zustand";
import { Part } from "@prisma/client";
import toast from "react-hot-toast";

export const saveREtInvoiceToDB = async (
    Invoice: Store,
    setloading: (sate: boolean) => void,
    redirect: (num: any) => void
) => {
    setloading(true);
    const { invoiceAmount } = Invoice;
    let InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
        parts?: Part[];
    }[] = [];

    Invoice.items.map((item) => {
        if (item.quantity > 0) {
            InvoiceItems.push({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
                parts: item.parts,
            });
        }
    });

    const data: saveREtInvoiceType = {
        customerId: Invoice.customerId || "",
        date: Invoice.date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
    };

    if (InvoiceItems.length > 0) {
        console.log(data);
        const res = await SaveReturnedInvoice(data);
        if (res.status === "ok") {
            Invoice.clearData();
            redirect(
                `/returnedInvoices/showREtInvoice?num=${res.data?.number}`
            );
            toast.success("تم حفظ الفاتورةالمرتجعات بنجاح");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("لم تقم بإضافة اي صنف للفاتورة");
        setloading(false);
    }
};
