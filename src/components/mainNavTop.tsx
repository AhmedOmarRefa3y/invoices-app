"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const MainNavTop = ({
    orgName,
    userName,
}: {
    userName: string | null | undefined;
    orgName: string;
}) => {
    const pathName = usePathname();
    const parts = pathName.split("/");

    const paths: any = {
        "/": "الرئيسية",
        "add-sales-invoice": "اضافة فاتورة مبيعات",
        "add-returns-invoice": "اضافة فاتورة مرتجعات",
        "production-orders": "امر انتاج",
        "production-plans": "خطة انتاج",
        "accounts-reports": "حسابات العملاء",
        "customer-credit": "كشف حساب عميل",
        invoices: "الفواتير",
        "composed-items": "الاصناف المجمعة",
        "initial-quantities": "اول المدة",
        "product-records": "حركة صنف",
        Payments: "مدفوعات العملاء",
        returnedInvoices: "فواتير المرتجعات",
        showREtInvoice: "عرض فاتورة مرتجعات",
        sales: "فواتير المبيعات",
        releaseorder: "اذن تحميل",
        showInvoice: "عرض فاتورة",
        inventory: "المخزون",
        "account-statement": " كشف حساب عميل",
    };

    let value = "";

    for (let i = parts.length - 1; i >= 0; i--) {
        if (paths[parts[i]]) {
            value = paths[parts[i]];
            break;
        }
    }
    return (
        <div className=" flex items-center sticky top-0 left-0 right-0 w-full  justify-end py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px]  border-b border-b-stone-300 mx-auto z-50">
            <div className="ml-auto hidden sm:flex">
                <span> {value ? value : "الرئيسية"}</span>
            </div>

            <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col text-sm items-end justify-center font-light">
                    <span>{userName}</span>
                    <span>{orgName}</span>
                </div>
                <span
                    onClick={() => signOut()}
                    className="text-slate-900 duration-300 hover:bg-[#f5f4f4] p-1 rounded-sm hover:text-emerald-500 "
                >
                    <LogOut size={25} />
                </span>
            </div>
        </div>
    );
};

export default MainNavTop;
