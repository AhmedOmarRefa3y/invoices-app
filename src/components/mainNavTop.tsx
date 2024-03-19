"use client";
import useInvoice from "@/lib/zustand/invoiceStore";
import Link from "next/link";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { MdPayments } from "react-icons/md";

import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AiTwotonePlusSquare } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import { ImMakeGroup } from "react-icons/im";
import { TbPackages, TbReportAnalytics } from "react-icons/tb";
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar";

export const MainNavTop = () => {
    const invoice = useInvoice();
    const { orgid } = useParams();
    const router = useRouter();
    const pathname = usePathname();
    const session = useSession();
    
    const { isSidebarOpen, toggleSideBar, SetAddPaymentModalIsOpen } = invoice;
    const menus = [
        {
            name: "الرئيسية",
            link: `/${orgid}`,
            icon: IoHome,
        },
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
                    margin: true,
                },
            ],
        },
        {
            name: "انتاج",
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
            name: "اضافة مدفوعة",
            link: "/",
            icon: GiTakeMyMoney,
            button: true,
            func: SetAddPaymentModalIsOpen,
            img: "bill.png",
        },

        {
            name: "اشعارات دائنة",
            link: `/${orgid}/Payments`,
            icon: MdPayments,
            margin: true,
        },
        {
            name: "كشف حساب عميل",
            link: `/${orgid}/accounts-reports`,
            icon: AiOutlineUser,
        },
        {
            name: "المخزن",
            link: `/${orgid}/inventory`,
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
        <section className=" drop-shadow-2xl flex items-center justify-center sticky top-0  bg-[#0e0e0e]  duration-500 text-gray-100 px-4 h-[50px] w-full z-[51]">
            {/*  <div
                className={` `}
            >
                {/* <div className="py-3 flex justify-end">
                    <HiMenuAlt3
                        size={26}
                        className="cursor-pointer"
                        onClick={toggleSideBar}
                    />
                </div> 
                <div className=" flex  gap-4 ">
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
                                    {/* <div>
                                        {React.createElement(menu?.icon, {
                                            size: "20",
                                        })}
                                    </div> 
                                    <h2
                                    // className={`whitespace-pre duration-500 ${
                                    //     !isSidebarOpen &&
                                    //     "opacity-0 translate-l-28 overflow-hidden"
                                    // }`}
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
                                        signOut();
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
            </div> */}
            <Menubar
                className="w-fit my-auto bg-transparent  border-0 flex gap-2 "
                dir="rtl"
            >
                <MenubarMenu>
                    <MenubarTrigger
                        onClick={() => router.push(`/${orgid}/`)}
                        className={`${
                            pathname === `/${orgid}` && "bg-white text-black"
                        } flex gap-2 cursor-pointer hover:bg-white hover:text-black`}
                    >
                        <span>الرئيسية</span>
                        <div>
                            {React.createElement(IoHome, {
                                size: "20",
                            })}
                        </div>
                    </MenubarTrigger>
                </MenubarMenu>
                {menus?.map((menu, i) => {
                    return (
                        <MenubarMenu key={i}>
                            <MenubarTrigger>{menu.name}</MenubarTrigger>
                            <MenubarContent>
                                {menu.children?.map((child, i) => (
                                    <MenubarItem
                                        key={i}
                                        className="focus:bg-sky-500 font-bold text-lg"
                                    >
                                        <Link href={child.link}>
                                            {child.name}
                                        </Link>
                                    </MenubarItem>
                                ))}
                            </MenubarContent>
                        </MenubarMenu>
                    );
                })}
                {/* <MenubarMenu>
                    <MenubarTrigger>Edit</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>
                            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>Find</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>Search the web</MenubarItem>
                                <MenubarSeparator />
                                <MenubarItem>Find...</MenubarItem>
                                <MenubarItem>Find Next</MenubarItem>
                                <MenubarItem>Find Previous</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem>Cut</MenubarItem>
                        <MenubarItem>Copy</MenubarItem>
                        <MenubarItem>Paste</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem>
                            Always Show Bookmarks Bar
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem checked>
                            Always Show Full URLs
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarItem inset>
                            Reload <MenubarShortcut>⌘R</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem disabled inset>
                            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Hide Sidebar</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Profiles</MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value="benoit">
                            <MenubarRadioItem value="andy">
                                Andy
                            </MenubarRadioItem>
                            <MenubarRadioItem value="benoit">
                                Benoit
                            </MenubarRadioItem>
                            <MenubarRadioItem value="Luis">
                                Luis
                            </MenubarRadioItem>
                        </MenubarRadioGroup>
                        <MenubarSeparator />
                        <MenubarItem inset>Edit...</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Add Profile...</MenubarItem>
                    </MenubarContent>
                </MenubarMenu> */}
            </Menubar>
        </section>
    );
};

export default MainNavTop;
