"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import useInvoice from "@/lib/zustand";
import { Customer, Product } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import SetCustomerAndDate from "./SetCustomerAndDate";
import InvoiceItems from "./InvoiceItems";
import AddProductToInvoice from "./AddProductToInvoice";

interface InvoiceProps {
    customersBalannces: {
        id: string;
        name: string;
        TotalPayments?: number;
        InvoiceTotal?: number;
    }[];
    customers: Customer[];
    products: Product[];
}

const AddInvoiceFrom: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const { paidAmount, setpaidAmount, customerId } = Invoice;

    console.log("rerendred");

    const saveInvoiceToDB = async () => {
        const data = Invoice;
        const res = await axios.post("/api/saveInvoice", data);
        if (res.status === 200) {
            Invoice.clearData();
            setpaidAmount(0);
            router.push(`/invoices/${res.data.Invoice.id}`);
            toast.success("تم حفظ الفاتورة بنجاح");
        }
        console.log(res);
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
    let invoicesTotal = 0;
    if (customer?.InvoiceTotal && customer.TotalPayments) {
        invoicesTotal = customer?.InvoiceTotal - customer?.TotalPayments;
    }

    return (
        <div className="flex flex-col mt-3 w-full p-3 z-20 h-full rounded-lg bg-gray-200 border-gray-300 border shadow-lg bg-opacity-70">
            <SetCustomerAndDate customers={customers} />
            <AddProductToInvoice products={products} />
            <InvoiceItems />
            <div className="mr-auto ml-10">
                <div className="flex items-center  mt-3 gap-4">
                    <label htmlFor="">الرصيد</label>
                    <span className="bg-gray-300 w-full p-2 rounded-md">
                        {invoicesTotal}
                    </span>
                </div>
                <div className="flex items-center justify-center mt-3 gap-4">
                    <label htmlFor="">المدفوع</label>
                    <Input
                        value={paidAmount}
                        type="number"
                        min={0}
                        placeholder="ادخل القيمة المدفوعة"
                        className="w-fit"
                        onChange={(e) =>
                            setpaidAmount(
                                e.target.valueAsNumber > 0
                                    ? e.target.valueAsNumber
                                    : 0
                            )
                        }
                    />
                </div>
                <div className="flex items-center  mt-3 gap-4">
                    <label htmlFor="">المتبقي</label>
                    <span className="bg-gray-300 w-full p-2 rounded-md">
                        {totalAmount + invoicesTotal - paidAmount}
                    </span>
                </div>
            </div>
            <Button
                type="button"
                onClick={saveInvoiceToDB}
                className="w-full md:w-fit mt-4 px-16 py-8 text-lg "
            >
                حفظ الفاتورة
            </Button>
        </div>
    );
};

export default AddInvoiceFrom;
