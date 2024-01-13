"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";

import { SaveInvoice, UpdateInvoice } from "@/actions/invoice";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments: number;
        InvoiceTotal: number;
        REtInvTotal: number;
        Currbalance: number;
    }[];
    customers: Customer[];
    products: Product[];
}
type Product = Prisma.ProductGetPayload<{
    include: {
        Parts: true;
    };
}>;

const AddInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const {
        paidAmount,
        setpaidAmount,
        customerId,
        InvoiceId,
        clearData,
        invoiceAmount,
    } = Invoice;
    const [loading, setloading] = React.useState(false);

    const NewInvoice = async () => {
        setloading(true);
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
            customerId: string;
            date: Date;
            InvoiceItems: {
                id: string;
                quantity: number;
                price: number;
            }[];
            invoiceAmount: number;
            paidAmount: number;
        } = {
            customerId: Invoice.customerId || "",
            date: Invoice.date,
            invoiceAmount: invoiceAmount,
            InvoiceItems,
            paidAmount: paidAmount,
        };

        if (InvoiceItems.length > 0) {
            const res = await SaveInvoice(data);

            if (res.status === "ok") {
                Invoice.clearData();
                setpaidAmount(0);
                router.push(
                    `/invoices/sales/showInvoice?num=${res.data?.number}`
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

    const UpadteInvoice = async () => {
        setloading(true);
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
        } = {
            Id: InvoiceId || "",
            customerId: Invoice.customerId || "",
            date: Invoice.date,
            invoiceAmount: invoiceAmount,
            InvoiceItems,
            paidAmount: paidAmount,
        };

        if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
            const res = await UpdateInvoice(data);
            if (res.status === "ok") {
                Invoice.clearData();
                setpaidAmount(0);
                router.push(
                    `/invoices/sales/showInvoice?num=${res.data?.number}`
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

    let totalAmount = 0;
    Invoice.items.map((item) => {
        totalAmount += item.quantity * item.price;
    });

    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId
    );

    const customerBalance = customer ? customer.Currbalance : 0;

    const newBalance = paidAmount
        ? customerBalance + totalAmount - paidAmount
        : customerBalance + totalAmount;

    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    console.log("addInvoiceRenderd");
    return (
        <div className="flex flex-col mx-auto p-[2%]  z-20 min-h-screen   border-gray-300 border shadow-lg bg-opacity-70">
            <div className="flex items-center justify-center">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable products={products} />
            <div className="flex justify-between w-full mt-2 ml-10 mr-auto ">
                <div>
                    <div className="flex items-center gap-4">
                        <label htmlFor="" className="w-[60px]">
                            الرصيد
                        </label>
                        <span className="flex justify-center w-full gap-4 p-2 bg-gray-300 rounded-md">
                            <span>
                                {" "}
                                {customerBalance > 0
                                    ? customerBalance.toFixed(2)
                                    : (customerBalance * -1).toFixed(2)}
                            </span>
                            <span>
                                {customerBalance > 0
                                    ? "مدين"
                                    : customerBalance === 0
                                    ? null
                                    : "دائن"}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 ">
                        <label htmlFor="" className="w-[60px]">
                            المدفوع
                        </label>
                        <Input
                            value={paidAmount === 0 ? "" : paidAmount}
                            type="number"
                            min={0}
                            placeholder="ادخل القيمة المدفوعة"
                            className="w-full"
                            onChange={(e) =>
                                setpaidAmount(e.target.valueAsNumber)
                            }
                        />
                    </div>
                    <div className="flex items-center gap-4 ">
                        <label className="w-[60px]">المتبقي</label>
                        <span className="flex justify-center w-full gap-4 p-2 bg-gray-300 rounded-md">
                            <span>
                                {" "}
                                {newBalance > 0
                                    ? newBalance.toFixed(2)
                                    : (newBalance * -1).toFixed(2)}
                            </span>
                            <span>
                                {newBalance > 0
                                    ? "مدين"
                                    : newBalance === 0
                                    ? null
                                    : "دائن"}
                            </span>
                        </span>
                    </div>
                </div>
                <div className="flex items-start justify-center gap-2 ">
                    <Button
                        type="button"
                        onClick={InvoiceId ? UpadteInvoice : NewInvoice}
                        className="w-full text-lg md:w-fit "
                        disabled={
                            !Invoice.customerId ||
                            Invoice.items.length < 1 ||
                            loading
                                ? true
                                : false
                        }
                    >
                        {InvoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
                    </Button>
                    <Button
                        className="col-span-2 mr-auto w-fit"
                        onClick={clearData}
                    >
                        إلغاء
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddInvoicePage;
