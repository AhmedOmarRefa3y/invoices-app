"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { Customer, Product } from "@prisma/client";
import ItemsContainer from "./Items";
import InvoiceHeader from "./InvoiceHeader";
import axios from "axios";
import AddProduct from "./addProduct";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "../ui/input";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

const AddInvoiceFrom: React.FC<InvoiceProps> = ({ customers, products }) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const [paidAmount, setpaidAmount] = React.useState(0);

    console.log("rerendred");

    const saveInvoiceToDB = async () => {
        const data = Invoice;
        const res = await axios.post("/api/saveInvoice", data);
        if (res.status === 200) {
            Invoice.clearData();
            router.push(`/invoices/${res.data.id}`);
            if (true) {
            }
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
    return (
        // form container
        <div className="flex flex-col mt-3 w-full p-3 bg-slate-400 h-full rounded-lg">
            {/* Invoice Haeder */}
            <InvoiceHeader customers={customers} />
            {/* Add A PRODUCT */}
            <AddProduct products={products} />
            {/* Items Container */}
            <ItemsContainer />
            {/* <Button type="button" onClick={sendTodb}>
                Save Invoice
            </Button> */}
            <div className="mr-auto ml-10">
                <div>
                    <label htmlFor="">المدفوع</label>
                    <Input
                        value={paidAmount}
                        type="number"
                        placeholder="ادخل القيمة المدفوعة"
                        className="w-fit"
                        onChange={(e) => setpaidAmount(e.target.valueAsNumber)}
                    />
                </div>
                <div>
                    <label htmlFor="">المتبقي</label>
                    <span>{totalAmount - paidAmount}</span>
                </div>
            </div>
            <Button
                type="button"
                onClick={saveInvoiceToDB}
                className="w-fit mt-4 px-16 py-8 text-lg"
            >
                حفظ الفاتورة
            </Button>
        </div>
    );
};

export default AddInvoiceFrom;
