"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand/invoiceStore";
import {
    ArrowRightLeft,
    Banknote,
    CalendarPlus,
    Cog,
    Component,
    FileCog,
    FilePlus,
    FileSpreadsheet,
    FileStack,
    FolderCog,
    Hash,
    LucideIcon,
    PackagePlus,
    Undo2,
    User,
    UserPlus,
    Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsClient } from "@uidotdev/usehooks";
import { useEffect } from "react";

const HomePAge = () => {
    const router = useRouter();
    const { orgid } = useParams();
    const Store = useInvoice();
    const isClient = useIsClient();
    const isOpen = useInvoice((state) => state.addOrgMOdalIsOpen);
    const setAddOrgModalIsOpen = useInvoice(
        (state) => state.setAddOrgModalIsOpen
    );
    useEffect(() => {
        if (isOpen) {
            setAddOrgModalIsOpen(false);
        }
    }, [isOpen, setAddOrgModalIsOpen]);
    if (!isClient) {
        return null;
    }

    const GridItem = ({
        ItemD,
        className,
    }: {
        ItemD: {
            label: String;
            icon?: LucideIcon;
            func?: () => void;
            link?: string;
        };
        className?: string;
    }) => (
        <div
            className={cn(
                " flex flex-col  items-center justify-center p-2 border  border-stone-300   bg-white text-black hover:bg-slate-700 hover:text-white cursor-pointer select-none  w-36  grow",
                className
            )}
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
            label: " فاتورة مبيعات",
            link: `/${orgid}/add-sales-invoice`,
            icon: FilePlus,
        },
        {
            label: " فاتورة مشتريات",
            link: `/${orgid}/add-purchase-invoice`,
            icon: FileStack,
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
            label: "فواتير المبيعات",
            link: `/${orgid}/sales`,
            icon: FileStack,
        },
        {
            label: "فواتير المشتريات",
            link: `/${orgid}/purchases_invocies`,
            icon: FileStack,
        },

        {
            label: "فواتير المرتجعات",
            link: `/${orgid}/returnedInvoices`,
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
            link: `/${orgid}/add-returns-invoice`,
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
        // {
        //     label: "تسجيل خروج",
        //     func: signOut,
        //     icon: LogOut,
        // },
    ];
    const items: React.JSX.Element[] = data.map((menu, index) => {
        return <GridItem key={index} ItemD={menu} />;
    });

    return (
        <div className="flex items-center justify-center flex-wrap sm:max-w-[70%]  my-auto      border-collapse rounded-lg  backdrop-blur-xl text-white place-items-stretch mx-auto bg-green-300">
            {items}
        </div>
    );
};

export default HomePAge;
