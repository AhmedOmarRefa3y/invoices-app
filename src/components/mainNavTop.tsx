"use client";
import useInvoice from "@/lib/zustand/invoiceStore";
import Link from "next/link";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { MdPayments } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { LogOut, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AiTwotonePlusSquare } from "react-icons/ai";
import { ImMakeGroup } from "react-icons/im";
import { TbPackages, TbReportAnalytics } from "react-icons/tb";
import { organization } from "@prisma/client";

interface menu {
    name: string;
    link?: string;
    icon?: any;
    children?: menu[];
    func?: () => void;
    button?: boolean;
    img?: string;
}
export const MainNavTop = ({
    organization,
}: {
    organization: organization;
}) => {
    const invoice = useInvoice();
    const { orgid } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const session = useSession();

    const {
        isSidebarOpen,
        toggleSideBar,
        SetAddPaymentModalIsOpen,
        SetAddcustomerModalIsOpen,
        SetAddProdctModalIsOpen,
    } = invoice;

    const menus: menu[] = [
        {
            name: "الفواتير",
            children: [
                {
                    name: "اضافة فاتورة",
                    link: `/${orgid}/addinvoice/sales`,
                    icon: AiTwotonePlusSquare,
                },
                {
                    name: "عرض الفواتير",
                    link: `/${orgid}/invoices/sales`,
                    icon: TbReportAnalytics,
                },
            ],
        },
        {
            name: "الانتاج",
            link: `/${orgid}/production-orders/new`,
            icon: ImMakeGroup,
            children: [
                {
                    name: "خطة انتاج جديدة",
                    link: `/${orgid}/production-plans/new`,
                    // icon: FaUser,
                },

                {
                    name: " امر انتاج جديد",
                    link: `/${orgid}/production-orders/new`,
                    // icon: PiGearBold,
                },
                {
                    name: "اوامر الانتاج",
                    link: `/${orgid}/production-orders/`,
                    // icon: BsBuildingGear,
                },
                {
                    name: " خطط الانتاج",
                    link: `/${orgid}/production-plans`,
                    // icon: FaUser,
                },
            ],
        },
        {
            name: "العملاء",
            children: [
                {
                    name: "اضافة عميل",
                    button: true,
                    func: () => {
                        SetAddcustomerModalIsOpen(true);
                    },
                },
                {
                    name: "اضافة مدفوعة",
                    icon: GiTakeMyMoney,
                    button: true,
                    func: () => SetAddPaymentModalIsOpen(true),
                },
                {
                    name: "سجل السداد",
                    link: `/${orgid}/Payments`,
                    icon: MdPayments,
                },
                {
                    name: "حسابات العملاء",
                    link: `/${orgid}/accounts-reports`,
                    icon: AiOutlineUser,
                },
            ],
        },
        {
            name: "المخزن",
            children: [
                {
                    name: "تقارير الاصناف",
                    link: `/${orgid}/inventory`,
                },
                {
                    name: "اضافة صنف",
                    button: true,
                    func: () => {
                        SetAddProdctModalIsOpen(true);
                    },
                },
                {
                    name: "ارصدة الاصناف المجمعة ",
                    link: `/${orgid}/inventory/composed-items`,
                    icon: TbPackages,
                },
            ],
        },
    ];
    return (
        <div className=" flex items-center justify-end  py-2 text-lg font-bold  text-black  bg-[#fafafa]  duration-300  px-4 h-[50px] w-full border-b border-b-stone-300 max-w-7xl mx-auto">
            <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col text-sm items-end justify-center font-light">
                    <span>{session.data?.user.name}</span>
                    <span>{organization.name}</span>
                </div>
                <span
                    onClick={() => signOut()}
                    className="text-slate-900 duration-300 bg-[#fafafa] p-1 rounded-sm hover:text-emerald-500 "
                >
                    <RiShutDownLine size={25} />
                </span>
            </div>
        </div>
    );
};

export default MainNavTop;
