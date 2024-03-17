import { Input } from "@/components/ui/input";
import useInvoice from "@/lib/zustand";
import React from "react";

interface customerBalanceT {
    customerBalance: number;
}

const CustomerBalance: React.FC<customerBalanceT> = ({ customerBalance }) => {
    const Invoice = useInvoice();
    const { setpaidAmount, paidAmount, items } = Invoice;

    let totalAmount = 0;
    items.map((item) => {
        totalAmount += item.quantity * item.price;
    });
    const newBalance = paidAmount
        ? customerBalance + totalAmount - paidAmount
        : customerBalance + totalAmount;

    return (
        <div className="">
            <div className="flex items-center gap-4 my-1 ">
                <label htmlFor="" className="w-[40px] whitespace-nowrap">
                    الرصيد
                </label>
                <span className="flex justify-center items-center w-full gap-4 p-2 text-black  border border-stone-300">
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
            <div className="flex items-center justify-center gap-4 my-1 ">
                <label htmlFor="" className="w-[40px] whitespace-nowrap text-sky-500 font-bold">
                    المدفوع
                </label>
                <Input
                    value={paidAmount === 0 ? "" : paidAmount}
                    type="number"
                    min={0}
                    placeholder="ادخل القيمة المدفوعة"
                    className=" text-black text-center font-bold border-sky-500 border-2 text-base rounded-none"
                    onChange={(e) => setpaidAmount(e.target.valueAsNumber)}
                />
            </div>
            <div className="flex items-center gap-4 my-1">
                <label className="w-[40px] whitespace-nowrap">المتبقي</label>
                <span className="flex justify-center w-full text-black font-bold gap-4 p-2 border border-stone-300 ">
                    <span>
                        {" "}
                        {newBalance > 0
                            ? newBalance.toFixed(0)
                            : (newBalance * -1).toFixed(0)}
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
    );
};

export default CustomerBalance;
