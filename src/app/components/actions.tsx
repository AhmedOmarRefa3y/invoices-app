"use client";
import { FaUser } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { PiGearBold } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { TbPackages } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBuildingGear } from "react-icons/bs";

import React, { Suspense } from "react";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";

const Actions = () => {
    const router = useRouter();
    const Store = useInvoice();
    const GridItem = ({
        menu,
    }: {
        menu: { label: String; icon?: any; func?: () => void; link?: string };
    }) => (
        <div
            className=" flex flex-col h-full items-center justify-center p-2 border  border-stone-300 w-full bg-white text-black hover:bg-slate-700 hover:text-white hover:cursor-pointer hover:select-none"
            onClick={() => {
                menu?.func
                    ? menu?.func()
                    : menu.link
                    ? router.push(menu.link)
                    : null;
            }}
        >
            <span>
                {React.createElement(menu?.icon, {
                    size: "70",
                })}
            </span>
            <span className="text-xl mt-2 whitespace-nowrap w-fit text-center">
                {menu.label}
            </span>
        </div>
    );

    const data: {
        label: String;
        icon?: any;
        func?: () => void;
        link?: string;
    }[] = [
        {
            label: "اضافة عميل",
            icon: FaUser,
            func: () => {
                Store.SetAddcustomerModalIsOpen(true);
            },
        },
        {
            label: "انشاء فاتورة بيع",
            link: "/addinvoice/sales",
            icon: FaFileInvoice,
        },
        {
            label: "اضافة صنف",
            icon: LuPackagePlus,
            func: () => {
                Store.SetAddProdctModalIsOpen(true);
            },
        },
        {
            label: "اضافة مدفوعة",
            icon: GiReceiveMoney,
            func: () => {
                Store.SetAddPaymentModalIsOpen(true);
            },
        },

        {
            label: "فواتير العملاء",
            link: "/invoices/sales",
            icon: TbReportAnalytics,
        },
        {
            label: "حسابات العملاء",
            link: "/accounts-reports",
            icon: FaUser,
        },
        {
            label: "المخزن",
            link: "/inventory",
            icon: TbPackages,
        },
        {
            label: "مدفوعات العملاء",
            link: "/Payments",
            icon: FaMoneyBillTransfer,
        },
        {
            label: "امر انتاج",
            link: "/production-orders/new",

            icon: PiGearBold,
        },
        {
            label: "اوامر الانتاج",
            link: "/production-orders",
            icon: BsBuildingGear,
        },
        {
            label: "خطة انتاج",
            link: "/production-plans/new",
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: "/production-plans/",
            icon: FaUser,
        },
        {
            label: "الاصناف المجمعة",
            link: "/inventory/composed-items",
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: "/production-plans/",
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: "/production-plans/",
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: "/production-plans/",
            icon: FaUser,
        },
    ];
    const items: any = data.map((menu, index) => {
        return <GridItem key={index} menu={menu} />;
    });

    // data.map((menu, index) => {
    //     items.push(<GridItem key={index} menu={menu} />);
    // });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="grid grid-cols-4   w-[600px] h-[550px]  border-collapse rounded-lg  backdrop-blur-xl text-white 0  bg-white   items-center justify-items-center">
                {items}
            </div>
        </Suspense>
    );
};

export default Actions;
