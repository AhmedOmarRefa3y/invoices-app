"use client";

import useInvoice from "@/lib/zustand";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomePage = () => {
    const router = useRouter();
    const InvoiceStore = useInvoice();
    const { SetMode, SetAddPaymentModalIsOpen, SetIsProductioModalOpen } =
        InvoiceStore;

    const Items = [
        {
            name: "فاتورة مبيعات",
            href: "/addinvoice/sales",
            func: () => {
                SetMode({
                    id: 1,
                });
            },
        },
        {
            name: "فاتورة مرتجعات",
            href: "/addinvoice/sales-returns",
            func: () => {
                SetMode({
                    id: 2,
                });
            },
        },
        {
            name: "اشعار دائن",
            href: "",
            func: () => {
                SetAddPaymentModalIsOpen(true);
            },
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
            name: "عرض فواتير المرتجعات ",
            href: "/returnedInvoices",
        },
        {
            name: " عرض فواتير المبيعات ",
            href: "/invoices/sales",
        },
        {
            name: "اشعارات دائنة",
            href: "/Payments",
        },
        {
            name: "حسابات العملاء",
            href: "/accounts-reports",
        },
    ];

    return (
        <div className="flex flex-wrap items-center justify-center min-h-screen  p-3 mx-auto  rounded-lg max-w-7xl ">
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
            </div>
        </div>
    );
};

export default HomePage;
