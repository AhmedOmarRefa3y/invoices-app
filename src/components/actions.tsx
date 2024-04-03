"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand/invoiceStore";
import { FaUser } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { LuPackagePlus } from "react-icons/lu";
import { GiReceiveMoney } from "react-icons/gi";
import { PiGearBold } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import { TbPackages } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { BsBuildingGear } from "react-icons/bs";
import { MdWarehouse } from "react-icons/md";
import { IconType } from "react-icons";

const Actions = () => {
    const router = useRouter();
    const Store = useInvoice();
    const { orgid } = useParams();

    const GridItem = ({
        ItemD,
    }: {
        ItemD: {
            label: String;
            icon: IconType;
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
            <span>
                {React.createElement(ItemD?.icon, {
                    size: "70",
                })}
            </span>
            <span className="text-xl mt-2 whitespace-nowrap w-fit text-center">
                {ItemD.label}
            </span>
        </div>
    );

    const data: {
        label: String;
        icon: IconType;
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
            link: `/${orgid}/addinvoice/sales`,
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
            link: `/${orgid}/invoices/sales`,
            icon: TbReportAnalytics,
        },
        {
            label: "حسابات العملاء",
            link: `/${orgid}/accounts-reports`,
            icon: FaUser,
        },
        {
            label: "المخزن",
            link: `/${orgid}/inventory`,
            icon: MdWarehouse,
        },
        {
            label: "مدفوعات العملاء",
            link: `/${orgid}/Payments`,
            icon: FaMoneyBillTransfer,
        },
        {
            label: "امر انتاج",
            link: `/${orgid}/production-orders/new`,
            icon: PiGearBold,
        },
        {
            label: "اوامر الانتاج",
            link: `/${orgid}/production-orders/`,
            icon: BsBuildingGear,
        },
        {
            label: "خطة انتاج",
            link: `/${orgid}/production-plans/new`,
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: `/${orgid}/production-plans`,
            icon: FaUser,
        },
        {
            label: "فاتورة مرتجعات",
            link: `/${orgid}/addinvoice/sales-returns`,
            icon: FaUser,
        },
        {
            label: "الاصناف المجمعة",
            link: `/${orgid}/inventory/composed-items`,
            icon: TbPackages,
        },
        {
            label: " خطط الانتاج",
            link: `/${orgid}/production-plans`,
            icon: FaUser,
        },
        {
            label: " خطط الانتاج",
            link: `/${orgid}/production-plans`,
            icon: FaUser,
        },
    ];
    const items: React.JSX.Element[] = data.map((menu, index) => {
        return <GridItem key={index} ItemD={menu} />;
    });

    return (
        <div className="grid grid-cols-4   w-[600px] h-[540px]  border-collapse rounded-lg  backdrop-blur-xl text-white   bg-white   items-center justify-items-center mx-auto">
            {items}
        </div>
    );
};

export default Actions;
