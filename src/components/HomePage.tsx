"use client";

import useInvoice from "@/lib/zustand/invoiceStore";

import { DbEdit } from "@/app/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const HomePage = () => {
    const InvoiceStore = useInvoice();
    const { SetAddPaymentModalIsOpen, SetIsProductioModalOpen } = InvoiceStore;

    const Items = [
        {
            name: "فاتورة مبيعات",
            href: "/addinvoice/sales",
        },
        {
            name: " عرض فواتير المبيعات ",
            href: "/invoices/sales",
        },
        {
            name: "فاتورة مرتجعات",
            href: "/addinvoice/sales-returns",
        },
        {
            name: "عرض فواتير المرتجعات ",
            href: "/returnedInvoices",
        },
        {
            name: "اشعار دائن",
            href: "",
            func: () => {
                SetAddPaymentModalIsOpen(true);
            },
        },
        {
            name: "اشعارات دائنة",
            href: "/Payments",
        },
        {
            name: "انتاج",
            href: "",
            func: () => {
                SetIsProductioModalOpen(true);
            },
        },
        {
            name: "المخزن",
            href: "/inventory",
        },

        {
            name: "حسابات العملاء",
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
