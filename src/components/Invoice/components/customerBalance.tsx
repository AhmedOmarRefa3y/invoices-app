import { Input } from "@/components/ui/input";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import useInvoice from "@/lib/zustand/invoiceStore";

import React from "react";

interface customerBalanceT {
    customerBalance: number;
    type: "sales" | "returns" | "purchases";
}

const CustomerBalance: React.FC<customerBalanceT> = ({
    customerBalance,
    type,
}) => {
    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();
    const items = {
        sales: SalesStore.items,
        returns: ReturnsStore.items,
        purchases: PurchasesStore.PurchaseInvoiceItems,
    };
    const setpaidAmount = {
        sales: SalesStore.setpaidAmount,
        returns: ReturnsStore.setpaidAmount,
        purchases: PurchasesStore.SetpaidAmount,
    };
    const paidAmount = {
        sales: SalesStore.paidAmount,
        returns: 0,
        purchases: 0,
    };
    let totalAmount = 0;
    items[type].map((item) => {
        totalAmount += item.quantity * item.price;
    });
    const newBalance = {
        sales: customerBalance + totalAmount - paidAmount["sales"],
        returns: customerBalance - totalAmount,
        purchases: customerBalance - totalAmount,
    };
    return (
        <div className="">
            <div className="flex items-center gap-4 my-1 ">
                <label htmlFor="" className="w-[40px] text-sm">
                    اجمالي الفاتورة
                </label>
                <span className="flex w-[140px] justify-center items-center  gap-4 p-2 text-black  border border-stone-300">
                    <span>{totalAmount}</span>
                </span>
            </div>
            <div className="flex items-center gap-4 my-1 ">
                <label htmlFor="" className="w-[40px] whitespace-nowrap">
                    الرصيد
                </label>
                <span className="flex justify-center w-[140px] items-center  gap-4 p-2 text-black  border border-stone-300">
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
            {type === "sales" && (
                <div className="flex items-center justify-center gap-4 my-1 ">
                    <label
                        htmlFor=""
                        className="w-[40px] whitespace-nowrap text-sky-500 font-bold"
                    >
                        المدفوع
                    </label>
                    <Input
                        value={paidAmount[type] === 0 ? "" : paidAmount[type]}
                        type="number"
                        min={0}
                        placeholder="ادخل القيمة المدفوعة"
                        className=" text-black w-[140px] text-center font-bold border-sky-500 border-2 text-base rounded-none"
                        onChange={(e) =>
                            setpaidAmount[type](e.target.valueAsNumber)
                        }
                    />
                </div>
            )}
            <div className="flex items-center gap-4 my-1">
                <label className="w-[40px] whitespace-nowrap">المتبقي</label>
                <span className="flex justify-center w-full text-black font-bold gap-4 p-2 border border-stone-300 ">
                    <span>
                        {" "}
                        {newBalance[type] > 0
                            ? newBalance[type].toFixed(0)
                            : (newBalance[type] * -1).toFixed(0)}
                    </span>
                    <span>
                        {newBalance[type] > 0
                            ? "مدين"
                            : newBalance[type] === 0
                            ? null
                            : "دائن"}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default CustomerBalance;
