import { SaveReturnedInvoice, saveREtInvoiceType } from "@/actions/invoice";
import { ReturnsStore } from "@/lib/zustand/ReturnsInvoice";
import { Store } from "@/lib/zustand/invoiceStore";

import { Part } from "@prisma/client";
import toast from "react-hot-toast";

export const saveREtInvoiceToDB = async (
    Invoice: ReturnsStore,
    setloading: (sate: boolean) => void,
    redirect: (num: any) => void,
    orgid: string
) => {
    setloading(true);
    const { invoiceAmount } = Invoice;
    let InvoiceItems: {
        productId: string;
        quantity: number;
        price: number;
    }[] = [];

    Invoice.items.map((item) => {
        if (item.quantity > 0) {
            InvoiceItems.push({
                productId: item.id,
                price: item.price,
                quantity: item.quantity,
            });
        }
    });

    const data: saveREtInvoiceType = {
        customerId: Invoice.customerId || "",
        date: Invoice.date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
        orgid,
    };

    if (InvoiceItems.length > 0) {
        const res = await SaveReturnedInvoice(data);
        if (res.status === "ok") {
            Invoice.clearData();
            redirect(
                `/${orgid}/returnedInvoices/showREtInvoice?num=${res.data?.number}`
            );
            toast.success("تم الحفظ بنجاح");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("لم تقم بإضافة اي صنف للفاتورة");
        setloading(false);
    }
};
