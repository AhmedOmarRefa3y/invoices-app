"use client";
import useInvoice from "@/lib/zustand";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { FiFolder, FiMessageSquare, FiShoppingCart } from "react-icons/fi";
import { GiTakeMyMoney } from "react-icons/gi";

import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { Button } from "./ui/button";
import ProductionEvent from "./modals/ProductionEvent";
import Image from "next/image";

const MainNav = () => {
    const invoice = useInvoice();

    const {
        isSidebarOpen,
        toggleSideBar,
        SetIsProductioModalOpen,
        IsProductioModalOpen,
        SetAddPaymentModalIsOpen,
    } = invoice;
    const menus = [
        { name: "اضافة فاتورة", link: "/addinvoice", icon: MdOutlineDashboard },
        {
            name: "انتاج",
            link: "/",
            icon: AiOutlineUser,
            button: true,
            func: SetIsProductioModalOpen,
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
            link: "/invoices",
            icon: TbReportAnalytics,
            margin: true,
        },
        {
            name: "كشف حساب عميل",
            link: "/accountstatement",
            icon: AiOutlineUser,
        },
        {
            name: "المخزن",
            link: "/inventory",
            icon: FiFolder,
            img: "warehouse.png",
        },
        { name: "Cart", link: "/", icon: FiShoppingCart },
        { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
        { name: "Setting", link: "/", icon: RiSettings4Line },
    ];
    const [open, setOpen] = useState(false);
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
                                        {!menu.img ? (
                                            React.createElement(menu?.icon, {
                                                size: "20",
                                            })
                                        ) : (
                                            <div>
                                                <Image
                                                    src={`/${menu.img}`}
                                                    alt="warehouse"
                                                    width={20}
                                                    height={20}
                                                    className="max-w-none"
                                                />
                                            </div>
                                        )}
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
                            console.log(menu);
                            return (
                                <div
                                    key={i}
                                    className={` ${
                                        menu?.margin && "mt-5"
                                    } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                                    onClick={() => {
                                        menu.func(true);
                                        console.log(IsProductioModalOpen);
                                    }}
                                >
                                    <div>
                                        {React.createElement(menu?.icon, {
                                            size: "20",
                                        })}
                                    </div>
                                    <h2
                                        // style={{
                                        //     transitionDelay: `${i + 3}00ms`,
                                        // }}
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
