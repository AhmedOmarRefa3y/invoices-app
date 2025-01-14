"use client";

import { DbEdit } from "@/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";

const HomePage = () => {
    const ModalsStore = useModals();
    const { SetAddPaymentModalIsOpen, SetIsProductioModalOpen } = ModalsStore;
    const t = useTranslations("topNav");
    const th = useTranslations("homePage");

    const Items = [
        {
            name: t("add-sales-invoice"),
            href: "/add-sales-invoice",
        },
        {
            name: th("showSalesInvoices"),
            href: "/sales",
        },
        {
            name: t("add-returns-invoice"),
            href: "/add-returns-invoice",
        },
        {
            name: th("showReturnsInvoices"),
            href: "/returnedInvoices",
        },
        {
            name: th("creditNotice"),
            href: "",
            func: () => {
                SetAddPaymentModalIsOpen(true);
            },
        },
        {
            name: th("creditNotices"),
            href: "/Payments",
        },
        {
            name: th("production"),
            href: "",
            func: () => {
                SetIsProductioModalOpen(true);
            },
        },
        {
            name: t("inventory"),
            href: "/inventory",
        },
        {
            name: t("accounts-reports"),
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
                {th("edit")}
            </Button>
        </div>
    );
};

export default HomePage;
