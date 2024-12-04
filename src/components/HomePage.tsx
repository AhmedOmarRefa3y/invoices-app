"use client";

import { DbEdit } from "@/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import useModals from "@/lib/zustand/useModals";

const HomePage = () => {
    const ModalsStore = useModals();
    const { SetAddPaymentModalIsOpen, SetIsProductioModalOpen } = ModalsStore;

    const Items = [
        {
            name: "Sales Invoice",
            href: "/add-sales-invoice",
        },
        {
            name: "Show Sales Invoices",
            href: "/sales",
        },
        {
            name: "Returns Invoice",
            href: "/add-returns-invoice",
        },
        {
            name: "Show Returns Invoices",
            href: "/returnedInvoices",
        },
        {
            name: "Credit Notice",
            href: "",
            func: () => {
                SetAddPaymentModalIsOpen(true);
            },
        },
        {
            name: "Credit Notices",
            href: "/Payments",
        },
        {
            name: "Production",
            href: "",
            func: () => {
                SetIsProductioModalOpen(true);
            },
        },
        {
            name: "Inventory",
            href: "/inventory",
        },

        {
            name: "Customer Accounts",
            href: "/accounts-reports",
        },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center   gap-3 w-full shadow-xl p-5">
            {Items.map((item, i) => {
                return (
                    <Link
                        key={i}
                        href={item.href}
                        className="basis-[400px] flex-1 h-[150px] flex items-center justify-center bg-gradient-to-r from-[#F2DDC1] to-[#E2C2B9]  text-black text-center text-4xl font-bold p-2 rounded hover:from-[#F05454]  hover:to-[#F05454] hover:text-black duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-[#F05454]"
                        onClick={item.func}
                    >
                        {item.name}
                    </Link>
                );
            })}
            <Button
                onClick={async () => {
                    DbEdit();
                }}
            >
                Edit
            </Button>
        </div>
    );
};

export default HomePage;
