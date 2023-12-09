"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import InvoiceTable from "./components/InvoiceTable";
import { Input } from "@/components/ui/input";
import Mode from "./components/Mode";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments: number;
        InvoiceTotal: number;
    }[];
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
        Inventory: true;
        Parts: true;
    };
}>;

const ReturnedInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const { paidAmount, setpaidAmount, customerId, InvoiceId, clearData } =
        Invoice;

    console.log("rerendred");

    const saveInvoiceToDB = async () => {
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
        const data = { InvoiceItems, ...Invoice, InvoiceId };
        if (InvoiceItems.length > 0) {
            const res = await axios.post("/api/saveInvoice", data);
            console.log(res);
            if (res.status === 200) {
                Invoice.clearData();
                setpaidAmount(0);
                router.push(
                    `/invoices/showInvoice?num=${res.data.Invoice.number}`
                );

                toast.success("تم حفظ الفاتورة بنجاح");
            }
        } else {
            toast.error("لم تقم بإضافة اي صنف للفاتورة");
        }
    };

    let totalAmount = 0;
    Invoice.items.map((item) => {
        totalAmount += item.quantity * item.price;
        console.log(totalAmount);
    });
    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId
    );
    const customerBalance = customer
        ? customer.InvoiceTotal - customer?.TotalPayments
        : 0;

    const newBalance = paidAmount
        ? customerBalance + totalAmount - paidAmount
        : customerBalance + totalAmount;

    return (
        <div className="flex flex-col  max-w-3xl mx-auto p-1 pr-3 z-20 min-h-screen  bg-gray-200 border-gray-300 border shadow-lg bg-opacity-70">
            <div className="flex items-center justify-center">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            {/* <AddProductToInvoice products={products} /> */}
            <InvoiceTable products={products} />
            <div className="w-fit flex gap-2 mr-auto">
                <Button
                    type="button"
                    onClick={saveInvoiceToDB}
                    className="w-full md:w-fit   text-lg "
                    disabled={
                        !Invoice.customerId || Invoice.items.length < 1
                            ? true
                            : false
                    }
                >
                    {InvoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
                </Button>
                <Button
                    className="w-fit mr-auto col-span-2"
                    onClick={clearData}
                >
                    إلغاء
                </Button>
            </div>
        </div>
    );
};

export default ReturnedInvoicePage;
