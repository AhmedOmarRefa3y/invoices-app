"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand/invoiceStore";
import {
    ArrowRightLeft,
    Banknote,
    CalendarPlus,
    Cog,
    Coins,
    Component,
    FileCog,
    FilePlus,
    FileSpreadsheet,
    FileStack,
    FolderCog,
    Hash,
    LogOut,
    LucideIcon,
    PackagePlus,
    Undo2,
    User,
    UserPlus,
    Warehouse,
} from "lucide-react";
import { signOut } from "next-auth/react";
const Actions = () => {
    const router = useRouter();
    const Store = useInvoice();
    const { orgid } = useParams();

    const GridItem = ({
        ItemD,
    }: {
        ItemD: {
            label: String;
            icon?: LucideIcon;
            func?: () => void;
            link?: string;
        };
    }) => (
        <div
            className=" flex flex-col h-full items-center justify-center p-2 border  border-stone-300 w-full bg-white text-black hover:bg-slate-700 hover:text-white cursor-pointer select-none"
            onClick={() => {
                ItemD?.func
                    ? ItemD?.func()
                    : ItemD.link
                    ? router.push(ItemD.link)
                    : null;
            }}
        >
            <span className="text-[80px]">
                {React.createElement(ItemD?.icon || User, { size: 70 })}
            </span>
            <span className="text-xl mt-2 whitespace-nowrap w-fit text-center">
                {ItemD.label}
            </span>
        </div>
    );

    const data: {
        label: String;
        icon?: LucideIcon;
        func?: () => void;
        link?: string;
    }[] = [
        {
            label: "اضافة عميل",
            icon: UserPlus,
            func: () => {
                Store.SetAddcustomerModalIsOpen(true);
            },
        },
        {
            label: "انشاء فاتورة بيع",
            link: `/${orgid}/addinvoice/sales`,
            icon: FilePlus,
        },
        {
            label: "اضافة صنف",
            icon: PackagePlus,
            func: () => {
                Store.SetAddProdctModalIsOpen(true);
            },
        },
        {
            label: "اضافة مدفوعة",
            icon: Banknote,
            func: () => {
                Store.SetAddPaymentModalIsOpen(true);
            },
        },

        {
            label: "فواتير العملاء",
            link: `/${orgid}/invoices/sales`,
            icon: FileStack,
        },
        {
            label: "حسابات العملاء",
            link: `/${orgid}/accounts-reports`,
            icon: FileSpreadsheet,
        },
        {
            label: "المخزن",
            link: `/${orgid}/inventory`,
            icon: Warehouse,
        },
        {
            label: "مدفوعات العملاء",
            link: `/${orgid}/Payments`,
            icon: ArrowRightLeft,
        },
        {
            label: "امر انتاج",
            link: `/${orgid}/production-orders/new`,
            icon: Cog,
        },
        {
            label: "اوامر الانتاج",
            link: `/${orgid}/production-orders/`,
            icon: FileCog,
        },
        {
            label: "خطة انتاج",
            link: `/${orgid}/production-plans/new`,
            icon: CalendarPlus,
        },
        {
            label: " خطط الانتاج",
            link: `/${orgid}/production-plans`,
            icon: FolderCog,
        },
        {
            label: "فاتورة مرتجعات",
            link: `/${orgid}/addinvoice/sales-returns`,
            icon: Undo2,
        },
        {
            label: "الاصناف المجمعة",
            link: `/${orgid}/inventory/composed-items`,
            icon: Component,
        },
        {
            label: "اول المدة",
            link: `/${orgid}/inventory/initial-quantities/2024`,
            icon: Hash,
        },
        {
            label: "تسجيل خروج",
            func: signOut,
            icon: LogOut,
        },
    ];
    const items: React.JSX.Element[] = data.map((menu, index) => {
        return <GridItem key={index} ItemD={menu} />;
    });

    return (
        <div className="grid lg:grid-cols-4 grid-cols-2 lg:w-[600px] lg:h-[540px]  border-collapse rounded-lg  backdrop-blur-xl text-white   bg-white   items-center justify-items-center mx-auto h-full">
            {items}
        </div>
    );
};

export default Actions;
