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
        "/": "Home",
        "add-sales-invoice": "New Sales Invoice",
        "add-returns-invoice": "New Returns Invoice",
        "production-orders": "Production Order",
        "production-plans": "Production Plan",
        "accounts-reports": "Accounts Reports",
        "customer-credit": "Customer Credit",
        invoices: "Invoices",
        "composed-items": "Compose Items",
        "initial-quantities": "Initial Quantities",
        "product-records": "Product Records",
        Payments: "Payments",
        returnedInvoices: "Returned Invoices",
        showREtInvoice: "Returned Invoice",
        sales: "Sales Invoices",
        releaseorder: "Release Orders",
        showInvoice: "Sales Invoice",
        inventory: "Inventory",
        "account-statement": " Account Statement",
        "add-purchase-invoice": "New Purchase Invoice",
        purchases_invocies: "Purchases Invoices",
    };

    let value = "";

    for (let i = parts.length - 1; i >= 0; i--) {
        if (paths[parts[i]]) {
            value = paths[parts[i]];
            break;
        }
    }
    return (
        <div className=" flex items-center sticky top-0 left-0 right-0 w-full  justify-between py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px]  border-b border-b-stone-300 mx-auto z-50">
            <div className=" hidden sm:flex">
                <span> {value ? value : "Home"}</span>
            </div>

            <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col text-sm  justify-center font-light">
                    <span>{userName}</span>
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
