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
import useModals from "@/lib/zustand/useModals";

const HomePAge = () => {
    const router = useRouter();
    const { orgid } = useParams();
    const Modals = useModals();
    const isClient = useIsClient();
    const isOpen = useModals((state) => state.addOrgMOdalIsOpen);
    const setAddOrgModalIsOpen = useModals(
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
            label: "New Customer",
            icon: UserPlus,
            func: () => {
                Modals.SetAddcustomerModalIsOpen(true);
            },
        },
        {
            label: "Sales Invoice",
            link: `/${orgid}/add-sales-invoice`,
            icon: FilePlus,
        },
        {
            label: "Purchase Invoice",
            link: `/${orgid}/add-purchase-invoice`,
            icon: FileStack,
        },
        {
            label: "Add Product",
            icon: PackagePlus,
            func: () => {
                Modals.SetAddProdctModalIsOpen(true);
            },
        },
        {
            label: "Add Payment",
            icon: Banknote,
            func: () => {
                Modals.SetAddPaymentModalIsOpen(true);
            },
        },

        {
            label: "Sales Invoices",
            link: `/${orgid}/sales`,
            icon: FileStack,
        },
        {
            label: "Purchases Invoices",
            link: `/${orgid}/purchases_invocies`,
            icon: FileStack,
        },

        {
            label: "Returns Invoices",
            link: `/${orgid}/returnedInvoices`,
            icon: FileStack,
        },
        {
            label: "Accounts Reports",
            link: `/${orgid}/accounts-reports`,
            icon: FileSpreadsheet,
        },
        {
            label: "Inventory",
            link: `/${orgid}/inventory`,
            icon: Warehouse,
        },
        {
            label: "Payments",
            link: `/${orgid}/Payments`,
            icon: ArrowRightLeft,
        },
        {
            label: "Production Order",
            link: `/${orgid}/production-orders/new`,
            icon: Cog,
        },
        {
            label: "Production Orders",
            link: `/${orgid}/production-orders/`,
            icon: FileCog,
        },
        {
            label: "Production Plan",
            link: `/${orgid}/production-plans/new`,
            icon: CalendarPlus,
        },
        {
            label: " Production Plans",
            link: `/${orgid}/production-plans`,
            icon: FolderCog,
        },
        {
            label: "Returns Invoice",
            link: `/${orgid}/add-returns-invoice`,
            icon: Undo2,
        },
        {
            label: "Composed Items",
            link: `/${orgid}/inventory/composed-items`,
            icon: Component,
        },
        {
            label: "Initial Quantities",
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
        <div className="flex items-center justify-center flex-wrap xl:max-w-[60%]  my-auto      border-collapse rounded-lg  backdrop-blur-xl text-white place-items-stretch mx-auto bg-green-300">
            {items}
        </div>
    );
};

export default HomePAge;
