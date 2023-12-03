"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import useInvoice from "@/lib/zustand";
import { Customer, Product } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SetCustomerAndDate from "@/components/addInvoice/SetCustomerAndDate";
import AddProductToInvoice from "@/components/addInvoice/AddProductToInvoice";
import InvoiceTable from "./InvoiceTable";
import { Input } from "@/components/ui/input";

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

const AddInvoiceFrom: React.FC<InvoiceProps> = ({
    customers,
    products,
    customersBalannces,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const router = useRouter();
    const Invoice = useInvoice();
    const { paidAmount, setpaidAmount, customerId, InvoiceId } = Invoice;

    console.log("rerendred");

    const saveInvoiceToDB = async () => {
        const data = { ...Invoice, InvoiceId };
        const res = await axios.post("/api/saveInvoice", data);
        console.log(res);
        if (res.status === 200) {
            Invoice.clearData();
            setpaidAmount(0);
            router.push(`/invoices/${res.data.Invoice.id}`);

            toast.success("تم حفظ الفاتورة بنجاح");
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
            <SetCustomerAndDate customers={customers} />
            {/* <AddProductToInvoice products={products} /> */}
            <InvoiceTable products={products} />
            <div className="mr-auto ml-10 flex  justify-between w-full p-2">
                <div>
                    <div className="flex items-center  mt-3 gap-4">
                        <label htmlFor="" className="w-[60px]">
                            الرصيد
                        </label>
                        <span className="bg-gray-300 w-full  p-2 rounded-md flex justify-center gap-4">
                            <span>
                                {" "}
                                {customerBalance > 0
                                    ? customerBalance
                                    : customerBalance * -1}
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
                    <div className="flex items-center justify-center mt-3 gap-4 ">
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
                    <div className="flex items-center   mt-3 gap-4 ">
                        <label className="w-[60px]">المتبقي</label>
                        <span className="bg-gray-300 w-full  p-2 rounded-md flex justify-center gap-4">
                            <span>
                                {" "}
                                {newBalance > 0 ? newBalance : newBalance * -1}
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
                <Button
                    type="button"
                    onClick={saveInvoiceToDB}
                    className="w-full md:w-fit mt-4 px-16 py-8 text-lg "
                    disabled={
                        !Invoice.customerId || Invoice.items.length < 1
                            ? true
                            : false
                    }
                >
                    {InvoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
                </Button>
            </div>
        </div>
    );
};

export default AddInvoiceFrom;
