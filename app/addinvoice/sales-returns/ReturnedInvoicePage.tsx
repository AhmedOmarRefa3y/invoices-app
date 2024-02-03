"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import SetCustomerAndDate from "@/app/addinvoice/components/SetCustomerAndDate";
import useInvoice from "@/lib/zustand";
import { Customer, Prisma } from "@prisma/client";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import { saveREtInvoiceToDB } from "./sales-returns-utils";
import { useRouter } from "next/navigation";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

type Product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;

const ReturnedInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
}) => {
    const router = useRouter();
    const [loading, setloading] = React.useState(false);
    const [mounted, setmounted] = React.useState(false);
    const Invoice = useInvoice();
    const { customerId, InvoiceId, clearData, date } = Invoice;
    const redirect = (url: string) => {
        router.push(url);
    };
    const saveInvoice = async () => {
        await saveREtInvoiceToDB(Invoice, setloading, redirect);
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
                    onClick={saveInvoice}
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
