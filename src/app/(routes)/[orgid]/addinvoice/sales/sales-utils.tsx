import {
    SaveInvoice,
    UpdateInvoice,
    saveInvoiceType,
} from "@/app/actions/invoice";
import prismaDb from "@/lib/prisma";
import { Store } from "@/lib/zustand/invoiceStore";

import toast from "react-hot-toast";

export const GetSalesData = async (orgID: string) => {
    // console.log(orgID);
    const customers = await prismaDb.customer.findMany({
        where: {
            organizationId: orgID,
        },
        include: {
            invoices: true,
            Payment: true,
            ReturnedInvoice: true,
        },
        orderBy: {
            name: "asc",
        },
    });
    const products = await prismaDb.product.findMany({
        where: {
            organizationId: orgID,
        },
        include: {
            Part: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
    // console.log(products);

    const formattedCustomers = customers.map((customer) => {
        let InvoiceTotal = 0;
        customer.invoices.forEach((invoice) => {
            InvoiceTotal += invoice.amount;
        });
        let TotalPayments = 0;
        customer.Payment.forEach((payment) => {
            TotalPayments += payment.amount;
        });
        let REtInvTotal = 0;
        customer.ReturnedInvoice.forEach((REtInv) => {
            REtInvTotal += REtInv.amount;
        });

        return {
            id: customer.id,
            name: customer.name,
            TotalPayments,
            InvoiceTotal,
            REtInvTotal,
            Currbalance:
                InvoiceTotal -
                (TotalPayments + REtInvTotal) -
                customer.CustomerCredit,
        };
    });

    return {
        formattedCustomers,
        products,
        customers,
    };
};

export const SaveSalesInvoice = async (
    Invoice: Store,
    setloading: (sate: boolean) => void,
    redirect: (num: any) => void,
    orgid: string
) => {
    setloading(true);
    const { paidAmount, setpaidAmount, invoiceAmount } = Invoice;
    let InvoiceItems: {
        id: string;
        quantity: number;
        price: number;
    }[] = [];

    Invoice.items.map((item) => {
        if (item.quantity > 0) {
            InvoiceItems.push({
                id: item.id,
                price: item.price,
                quantity: item.quantity,
            });
        }
    });

    const data: saveInvoiceType = {
        customerId: Invoice.customerId || "",
        date: Invoice.date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
        paidAmount: paidAmount,
        orgid,
    };

    if (InvoiceItems.length > 0) {
        const res = await SaveInvoice(data);
        // console.log(res);
        if (res.status === "ok") {
            Invoice.clearData();
            setpaidAmount(0);
            redirect(
                `/${orgid}/invoices/sales/showInvoice?num=${res.data?.number}`
            );
            toast.success("تم حفظ الفاتورة بنجاح");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("لم تقم بإضافة اي صنف للفاتورة");
        setloading(false);
    }
};

export const UpadteSalesInvoice = async (
    Invoice: Store,
    setloading: (sate: boolean) => void,
    redirect: (num: any) => void,
    orgid: string
) => {
    setloading(true);
    const {
        paidAmount,
        setpaidAmount,
        customerId,
        InvoiceId,
        clearData,
        invoiceAmount,
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
        Id: InvoiceId || "",
        customerId: Invoice.customerId || "",
        date: Invoice.date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
        paidAmount: paidAmount,
        orgid,
    };

    if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
        const res = await UpdateInvoice(data);
        if (res.status === "ok") {
            Invoice.clearData();
            setpaidAmount(0);
            redirect(`/invoices/sales/showInvoice?num=${res.data?.number}`);
            toast.success("تم تعديل الفاتورة بنجاح");
        } else {
            toast.error(res.message);
            setloading(false);
        }
    } else {
        toast.error("لم يتم تعديل الفاتورة");
        setloading(false);
    }
};
