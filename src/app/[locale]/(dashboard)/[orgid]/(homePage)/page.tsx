"use client";
import React from "react";
import { useRouter } from "@/i18n/routing";

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
import useModals from "@/lib/zustand/useModals";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const HomePAge = () => {
    const router = useRouter();
    const { orgid } = useParams();
    const Modals = useModals();
    const isClient = useIsClient();
    const isOpen = useModals((state) => state.addOrgMOdalIsOpen);
    const setAddOrgModalIsOpen = useModals(
        (state) => state.setAddOrgModalIsOpen
    );
    const t = useTranslations("homePage");

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
                " flex flex-col  items-center justify-center p-2 border  border-stone-300   bg-white text-black hover:bg-slate-700 hover:text-white cursor-pointer select-none  w-44  grow",
                className
            )}
            onClick={() => {
                ItemD.func
                    ? ItemD.func()
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
            label: t("newCustomer"),
            icon: UserPlus,
            func: () => {
                Modals.SetAddcustomerModalIsOpen(true);
            },
        },
        {
            label: t("salesInvoice"),
            link: `/${orgid}/add-sales-invoice`,
            icon: FilePlus,
        },
        {
            label: t("purchaseInvoice"),
            link: `/${orgid}/add-purchase-invoice`,
            icon: FileStack,
        },
        {
            label: t("addProduct"),
            icon: PackagePlus,
            func: () => {
                Modals.SetAddProdctModalIsOpen(true);
            },
        },
        {
            label: t("addPayment"),
            icon: Banknote,
            func: () => {
                Modals.SetAddPaymentModalIsOpen(true);
            },
        },
        {
            label: t("salesInvoices"),
            link: `/${orgid}/sales`,
            icon: FileStack,
        },
        {
            label: t("purchasesInvoices"),
            link: `/${orgid}/purchases_invocies`,
            icon: FileStack,
        },
        {
            label: t("returnsInvoices"),
            link: `/${orgid}/returnedInvoices`,
            icon: FileStack,
        },
        {
            label: t("accountsReports"),
            link: `/${orgid}/accounts-reports`,
            icon: FileSpreadsheet,
        },
        {
            label: t("inventory"),
            link: `/${orgid}/inventory`,
            icon: Warehouse,
        },
        {
            label: t("payments"),
            link: `/${orgid}/Payments`,
            icon: ArrowRightLeft,
        },
        {
            label: t("productionOrder"),
            link: `/${orgid}/production-orders/new`,
            icon: Cog,
        },
        {
            label: t("productionOrders"),
            link: `/${orgid}/production-orders/`,
            icon: FileCog,
        },
        {
            label: t("productionPlan"),
            link: `/${orgid}/production-plans/new`,
            icon: CalendarPlus,
        },
        {
            label: t("productionPlans"),
            link: `/${orgid}/production-plans`,
            icon: FolderCog,
        },
        {
            label: t("returnsInvoice"),
            link: `/${orgid}/add-returns-invoice`,
            icon: Undo2,
        },
        {
            label: t("composedItems"),
            link: `/${orgid}/inventory/composed-items`,
            icon: Component,
        },
        {
            label: t("initialQuantities"),
            link: `/${orgid}/inventory/initial-quantities/2024`,
            icon: Hash,
        },
    ];
    const items: React.JSX.Element[] = data.map((menu, index) => {
        return <GridItem key={index} ItemD={menu} />;
    });

    return (
        <div className="flex items-center justify-center flex-wrap xl:max-w-[60%]  my-auto      border-collapse rounded-lg  backdrop-blur-xl text-white place-items-stretch mx-auto bg-green-300">
            {items}
        </div>
    );
};

export default HomePAge;
