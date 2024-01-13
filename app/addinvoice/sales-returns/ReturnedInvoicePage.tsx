"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { SaveReturnedInvoice, saveREtInvoiceType } from "@/actions/invoice";
import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
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

    let totalAmount = 0;
    Invoice.items.map((item) => {
        totalAmount += item.quantity * item.price;
    });

    React.useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col mx-auto p-[2%]  z-20 min-h-screen   border-gray-300 border shadow-lg bg-opacity-70">
            <div className="flex items-center justify-center">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable products={products} />
            <div className="flex items-start justify-center gap-2 mt-2 mr-auto ">
                <Button
                    type="button"
                    onClick={saveInvoiceToDB}
                    className="w-full text-lg md:w-fit "
                    disabled={
                        !Invoice.customerId || Invoice.items.length < 1
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
    );
};

export default ReturnedInvoicePage;
