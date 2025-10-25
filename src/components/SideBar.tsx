"use client";
import React from "react";

import {
  ArrowRightLeft,
  Banknote,
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
import { useParams } from "next/navigation";
import useModals from "@/lib/zustand/useModals";
import { Link } from "@/i18n/routing";
import { useTranslations } from "use-intl";

const MainNav = () => {
  const ModalsStore = useModals();
  const params = useParams();
  const orgid = params.orgid as string;
  const t = useTranslations("topNav");

  const {
    isSidebarOpen,
    toggleSideBar,
    SetAddPaymentModalIsOpen,
    SetAddcustomerModalIsOpen,
    SetAddProdctModalIsOpen,
  } = ModalsStore;
  const menus = [
    {
      name: t("home"),
      link: `/${orgid}`,
      icon: Home,
    },
    {
      name: t("add-sales-invoice"),
      link: `/${orgid}/add-sales-invoice`,
      icon: FilePlus,
    },

    {
      name: t("add_product"),
      icon: PackagePlus,
      button: true,
      func: () => {
        SetAddProdctModalIsOpen(true);
      },
    },
    {
      name: t("add_customer"),
      icon: UserPlus,
      button: true,
      func: () => {
        SetAddcustomerModalIsOpen(true);
      },
    },
    {
      name: t("new_payment"),
      icon: Banknote,
      button: true,
      func: () => {
        SetAddPaymentModalIsOpen(true);
      },
    },

    {
      name: t("add-sales-invoice"),
      link: `/${orgid}/sales`,
      icon: FileStack,
      margin: true,
    },
    {
      name: t("add-sales-invoice") || "purchases Invoices",
      link: `/${orgid}/purchases_invocies`,
      icon: FileStack,
      margin: true,
    },
    {
      name: t("Payments"),
      link: `/${orgid}/Payments`,
      icon: ArrowRightLeft,
    },
    {
      name: t("accounts-reports"),
      link: `/${orgid}/accounts-reports`,
      icon: FileSpreadsheet,
    },
    {
      name: t("chartOfAccounts"),
      link: `/${orgid}/chart-of-accounts`,
      icon: FileSpreadsheet,
    },
    {
      name: t("journalEntries") || "Journal Entries",
      link: `/${orgid}/journal-entries`,
      icon: FileSpreadsheet,
    },
    {
      name: t("journalEntries") || "journal transactions",
      link: `/${orgid}/journal_transactions`,
      icon: FileSpreadsheet,
    },
    {
      name: t("inventory"),
      link: `/${orgid}/inventory`,
      icon: Warehouse,
    },
    {
      name: t("userManagement"),
      link: `/${orgid}/users`,
      icon: UserPlus,
    },
    {
      name: t("signOut"),
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
        {/* Fancy Language Switcher */}

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
                      !isSidebarOpen && "opacity-0 translate-r-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute start-16 bg-cyan-400/60 bg font-semibold whitespace-pre text-gray-900 rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
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
                      !isSidebarOpen && "opacity-0 translate-r-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute start-16 bg-cyan-400/60 bg font-semibold whitespace-pre text-gray-900 rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
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
