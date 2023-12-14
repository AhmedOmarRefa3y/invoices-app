"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InvoiceTable from "./components/InvoiceTable";
import Mode from "./components/Mode";

interface InvoiceProps {
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
}) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const { customerId, InvoiceId, clearData, date } = Invoice;

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

        const InvoiceInfo: {
            date: Date;
            Items: {
                productId: string;
                quantity: number;
                price: number;
            }[];
            customerId: string | null;
            amount: number;
        } = {
            customerId: customerId,
            date: date,
            Items: Invoice.items.map((item) => {
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                };
            }),
            amount: Invoice.invoiceAmount,
        };

        const data = { InvoiceInfo, InvoiceId };
        if (InvoiceItems.length > 0) {
            const res = await axios.post("/api/returnedInvoice", data);
            if (res.status === 200) {
                Invoice.clearData();
                router.push(`/invoices/showInvoice?num=${res.data.number}`);
                toast.success("تم حفظ الفاتورة بنجاح");
            }
        } else {
            toast.error("لم تقم بإضافة اي صنف للفاتورة");
        }
    };

    let totalAmount = 0;
    Invoice.items.map((item) => {
        totalAmount += item.quantity * item.price;
        // console.log(totalAmount);
    });

    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

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
