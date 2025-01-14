"use client";
import React from "react";

import {
  ArrowRightLeft,
  Banknote,
  Cog,
  FilePlus,
  FileSpreadsheet,
  FileStack,
  Home,
  LogOut,
  Menu,
  PackagePlus,
  UserPlus,
  Warehouse,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import useModals from "@/lib/zustand/useModals";
import { Link } from "@/i18n/routing";

const MainNav = () => {
  const ModalsStore = useModals();
  const { orgid } = useParams();

  const {
    isSidebarOpen,
    toggleSideBar,
    SetAddPaymentModalIsOpen,
    SetAddcustomerModalIsOpen,
    SetAddProdctModalIsOpen,
  } = ModalsStore;
  const menus = [
    {
      name: "Home",
      link: `/${orgid}`,
      icon: Home,
    },
    {
      name: "New Invoice",
      link: `/${orgid}/add-sales-invoice`,
      icon: FilePlus,
    },

    {
      name: "New Product",
      icon: PackagePlus,
      button: true,
      func: () => {
        SetAddProdctModalIsOpen(true);
      },
    },
    {
      name: "New Customer",
      icon: UserPlus,
      button: true,
      func: () => {
        SetAddcustomerModalIsOpen(true);
      },
    },
    {
      name: "New Payment",
      icon: Banknote,
      button: true,
      func: () => {
        SetAddPaymentModalIsOpen(true);
      },
    },

    {
      name: "Invoices",
      link: `/${orgid}/sales`,
      icon: FileStack,
      margin: true,
    },
    {
      name: "Payments",
      link: `/${orgid}/Payments`,
      icon: ArrowRightLeft,
    },
    {
      name: "Accounts Reports",
      link: `/${orgid}/accounts-reports`,
      icon: FileSpreadsheet,
    },
    {
      name: "Inventory",
      link: `/${orgid}/inventory`,
      icon: Warehouse,
    },
    {
      name: "Sign Out",
      icon: LogOut,
      button: true,
      func: signOut,
      img: "bill.png",
    },
  ];
  return (
    <section className="flex gap-6 fixed top-0 bottom-0  rtl:right-0 h-[100vh] z-[51]">
      <div
        className={`bg-[#0e0e0e] h-full ${
          isSidebarOpen ? "w-[185px]" : "sm:w-16 w-12"
        } duration-500 text-gray-100  px-2 absolute text-center `}
      >
        <div className="py-3 flex justify-end">
          <Menu
            size={30}
            className={`cursor-pointer text-sm sm:text-2xl ${
              isSidebarOpen ? "rotate-90" : "rotate-0"
            } duration-300 hover:text-cyan-400`}
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
                  } group flex items-center text-sm text-center gap-3.5 font-medium p-1  ${
                    isSidebarOpen && "hover:bg-gray-800"
                  } rounded-md`}
                >
                  <div className="">
                    <span className="hover:text-cyan-400">
                      {React.createElement(menu.icon || Home, {
                        size: "30",
                      })}
                    </span>
                  </div>
                  <h2
                    className={`whitespace-pre duration-500 ${
                      !isSidebarOpen &&
                      "opacity-0 translate-r-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute left-16 bg-cyan-400/60 bg font-semibold whitespace-pre text-gray-900 rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
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
                  } group flex items-center text-sm text-center gap-3.5 font-medium p-1 cursor-pointer ${
                    isSidebarOpen && "hover:bg-gray-800"
                  } rounded-md`}
                  onClick={() => {
                    menu.func();
                  }}
                >
                  <div>
                    <span className="hover:text-cyan-400">
                      {React.createElement(menu.icon || Home, {
                        size: "30",
                      })}
                    </span>
                  </div>
                  <h2
                    className={`whitespace-pre duration-500 ${
                      !isSidebarOpen &&
                      "opacity-0 translate-r-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute left-16 bg-cyan-400/60 bg font-semibold whitespace-pre text-gray-900 rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
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
