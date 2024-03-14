"use client";
import useInvoice from "@/lib/zustand";
import Link from "next/link";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { MdPayments } from "react-icons/md";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { AiTwotonePlusSquare } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { ImMakeGroup } from "react-icons/im";
import { TbPackages, TbReportAnalytics } from "react-icons/tb";

const MainNav = () => {
    const invoice = useInvoice();

    const { isSidebarOpen, toggleSideBar, SetAddPaymentModalIsOpen } = invoice;
    const menus = [
        {
            name: "الرئيسية",
            link: "/",
            icon: IoHome,
        },
        {
            name: "اضافة فاتورة",
            link: "/addinvoice/sales",
            icon: AiTwotonePlusSquare,
        },
        {
            name: "انتاج",
            link: "/production",
            icon: ImMakeGroup,
            // button: true,
            // func: SetIsProductioModalOpen,
        },

        {
            name: "اضافة مدفوعة",
            link: "/",
            icon: GiTakeMyMoney,
            button: true,
            func: SetAddPaymentModalIsOpen,
            img: "bill.png",
        },

        {
            name: "عرض الفواتير",
            link: "/invoices/sales",
            icon: TbReportAnalytics,
            margin: true,
        },
        {
            name: "اشعارات دائنة",
            link: "/Payments",
            icon: MdPayments,
            margin: true,
        },
        {
            name: "كشف حساب عميل",
            link: "/accounts-reports",
            icon: AiOutlineUser,
        },
        {
            name: "المخزن",
            link: "/inventory",
            icon: TbPackages,
            img: "warehouse.png",
        },
        {
            name: "تسجيل خروج",
            link: "/",
            icon: LogOut,
            button: true,
            func: signOut,
            img: "bill.png",
        },
    ];
    return (
        <section className="flex gap-6 drop-shadow-2xl  sticky top-0 right-0 h-[100vh]   z-[51]">
            <div
                className={`bg-[#0e0e0e] min-h-screen ${
                    isSidebarOpen ? "w-[185px]" : "w-16"
                } duration-500 text-gray-100 px-4 absolute `}
            >
                <div className="py-3 flex justify-end">
                    <HiMenuAlt3
                        size={26}
                        className="cursor-pointer"
                        onClick={toggleSideBar}
                    />
                </div>
                <div className="mt-4 flex flex-col gap-4 relative">
                    {menus?.map((menu, i) => {
                        if (menu.button === undefined) {
                            return (
                                <Link
                                    href={menu?.link}
                                    key={i}
                                    className={` ${
                                        menu?.margin && "mt-5"
                                    } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                                >
                                    <div>
                                        {React.createElement(menu?.icon, {
                                            size: "20",
                                        })}
                                    </div>
                                    <h2
                                        className={`whitespace-pre duration-500 ${
                                            !isSidebarOpen &&
                                            "opacity-0 translate-l-28 overflow-hidden"
                                        }`}
                                    >
                                        {menu?.name}
                                    </h2>
                                    <h2
                                        className={`${
                                            isSidebarOpen && "hidden"
                                        } absolute right-14 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg scale-0  w-0 overflow-hidden group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50 `}
                                    >
                                        {menu?.name}
                                    </h2>
                                </Link>
                            );
                        } else {
                            return (
                                <div
                                    key={i}
                                    className={` ${
                                        menu?.margin && "mt-5"
                                    } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                                    onClick={() => {
                                        menu.func(true);
                                        // console.log(IsProductioModalOpen);
                                    }}
                                >
                                    <div>
                                        {React.createElement(menu?.icon, {
                                            size: "20",
                                        })}
                                    </div>
                                    <h2
                                        className={`whitespace-pre duration-500 ${
                                            !isSidebarOpen &&
                                            "opacity-0 translate-l-28 overflow-hidden"
                                        }`}
                                    >
                                        {menu?.name}
                                    </h2>
                                    <h2
                                        className={`${
                                            isSidebarOpen && "hidden"
                                        } absolute right-14 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg scale-0  w-0 overflow-hidden group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50 `}
                                    >
                                        {menu?.name}
                                    </h2>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </section>
    );
};

export default MainNav;
