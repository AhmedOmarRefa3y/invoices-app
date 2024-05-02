import { SaveInvoice, UpdateInvoice, saveInvoiceType } from "@/actions/invoice";
import prismaDb from "@/lib/prisma";
import { Store } from "@/lib/zustand/invoiceStore";

import toast from "react-hot-toast";

export const GetSalesData = async (orgID: string) => {
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
        distinct: ["name"],
    });
    const products = await prismaDb.product.findMany({
        where: {
            organizationId: orgID,
        },
        include: {
            Part: {
                select: {
                    product: {
                        select: {
                            name: true,
                            price: true,
                        },
                    },
                    name: true,
                    partProductId: true,
                    quantity: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
        distinct: ["name"],
    });

    const CustomersWithBalances = customers.map((customer) => {
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
            phoneNumber: customer.phoneNumber,
            location: customer.location,
            CustomerCredit: customer.CustomerCredit,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
            organizationId: customer.organizationId,
            TotalPayments,
            InvoiceTotal,
            REtInvTotal,
            openCredit: customer.CustomerCredit,
            Currbalance:
                InvoiceTotal -
                (TotalPayments + REtInvTotal) -
                customer.CustomerCredit,
        };
    });

    return {
        CustomersWithBalances,
        products,
        customers,
    };
};

export const SaveSalesInvoice = async (
    Invoice: Store,
    setloading: (sate: boolean) => void,
    redirect: (num: number | string) => void,
    orgid: string
) => {
    setloading(true);
    const { paidAmount, setpaidAmount, invoiceAmount, customerId, date } =
        Invoice;
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

    if (!customerId) {
        toast.error("يجب عليك تحديد العميل");
        setloading(false);
        return;
    }
    const data: saveInvoiceType = {
        customerId: customerId,
        date: date,
        invoiceAmount: invoiceAmount,
        InvoiceItems,
        paidAmount: paidAmount,
        orgid,
    };

    if (InvoiceItems.length > 0) {
        const res = await SaveInvoice(data);
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
        toast.error("يجب عليك تحديد العميل");
        setloading(false);
        return;
    }
    if (!InvoiceId) {
        toast.error("يجب عليك تحديد الفاتورة");
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
        const res = await UpdateInvoice(data);
        if (res.status === "ok") {
            Invoice.clearData();
            setpaidAmount(0);
            redirect(
                `/${orgid}/invoices/sales/showInvoice?num=${res.data?.number}`
            );
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
