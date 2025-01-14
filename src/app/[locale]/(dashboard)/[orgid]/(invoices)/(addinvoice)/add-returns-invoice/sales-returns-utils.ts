import {
    SaveReturnedInvoice,
    UpdateReturnsInvoice,
    saveREtInvoiceType,
} from "@/actions/invoice";
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
    console.log(Invoice);

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
            toast.success("Invoice Created successfully");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("Please add items to the invoice");
        setloading(false);
    }
};

export const UpadteReturnsInvoice = async (
    Invoice: ReturnsStore,
    setloading: (sate: boolean) => void,
    redirect: (num: any) => void,
    orgid: string
) => {
    setloading(true);
    const {
        paidAmount,
        setpaidAmount,
        InvoiceId,
        invoiceAmount,
        customerId,
        date,
    } = Invoice;
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

    if (!customerId) {
        toast.error("You must select a customer");
        setloading(false);
        return;
    }
    if (!InvoiceId) {
        toast.error("You must select an invoice");
        setloading(false);
        return;
    }
    const data: {
        Id: string;
        customerId: string;
        date: Date;
        InvoiceItems: {
            id: string;
            quantity: number;
            price: number;
        }[];
        invoiceAmount: number;
        paidAmount: number;
        orgid: string;
    } = {
        Id: InvoiceId,
        customerId: customerId,
        date: date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
        paidAmount: paidAmount,
        orgid,
    };

    if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
        const res = await UpdateReturnsInvoice(data);
        if (res.status === "ok") {
            Invoice.clearData();
            setpaidAmount(0);
            redirect(
                `/${orgid}/returnedInvoices/showREtInvoice?num=${res.data?.number}`
            );
            toast.success("Invoice updated successfully");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("Invoice was not modified");
        setloading(false);
    }
};
