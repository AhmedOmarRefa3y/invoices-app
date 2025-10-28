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
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "use-intl";

const MainNav = () => {
  const ModalsStore = useModals();
  const params = useParams();
  const pathname = usePathname();
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
      name: t("purchases_invocies") || "purchases Invoices",
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
    // {
    //   name: t("chartOfAccounts"),
    //   link: `/${orgid}/chart-of-accounts`,
    //   icon: FileSpreadsheet,
    // },
    // {
    //   name: t("journalEntries") || "Journal Entries",
    //   link: `/${orgid}/journal-entries`,
    //   icon: FileSpreadsheet,
    // },
    // {
    //   name: t("journalEntries") || "journal transactions",
    //   link: `/${orgid}/journal_transactions`,
    //   icon: FileSpreadsheet,
    // },
    {
      name: t("inventory"),
      link: `/${orgid}/inventory`,
      icon: Warehouse,
    },
    // {
    //   name: t("userManagement"),
    //   link: `/${orgid}/users`,
    //   icon: UserPlus,
    // },
    {
      name: t("signOut"),
      icon: LogOut,
      button: true,
      func: signOut,
      img: "bill.png",
    },
  ];

  return (
    <section className="rtl:right-0 h-screen bg-[#0e0e0e] ">
      <div
        className={` h-full overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth ${
          isSidebarOpen ? "w-[185px] " : "sm:w-16 w-12"
        } duration-200 text-gray-100    text-center `}
      >
        {/* Fancy Language Switcher */}

        <div className="py-3 flex justify-end">
          <Menu
            size={25}
            className={`cursor-pointer me-1 text-sm sm:text-2xl ${
              isSidebarOpen ? " ms-auto" : " ms-[12px] rounded-s-md "
            } duration-300 `}
            onClick={toggleSideBar}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => {
            if (menu.button === undefined) {
              const isActive = pathname === menu?.link;
              return (
                <Link
                  prefetch={true}
                  href={menu?.link}
                  key={i}
                  className={` ${
                    menu?.margin && "mt-5"
                  } group flex items-center text-sm  text-center gap-3.5 font-medium   p-1 ${
                    isActive ? "bg-white text-black  " : "hover:bg-gray-800"
                  }  ms-[12px] rounded-s-md`}
                >
                  <div className="">
                    <span className={` ${isActive ? "text-black" : ""}`}>
                      {React.createElement(menu.icon || Home, {
                        size: "30",
                      })}
                    </span>
                  </div>
                  <h2
                    className={`whitespace-pre duration-200 delay-200 ${
                      !isSidebarOpen && "opacity-0 translate-r-28 overflow-hidden "
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  {/* <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute start-[80px] bg-black bg font-semibold whitespace-pre text-white rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
                  >
                    {menu?.name}
                  </h2> */}
                </Link>
              );
            } else {
              return (
                <button
                  key={i}
                  className={` ${
                    menu?.margin && "mt-5"
                  } group flex items-center text-sm text-center gap-3.5 font-medium p-1 hover:bg-gray-800 cursor-pointer ${
                    isSidebarOpen && ""
                  } ms-[12px] rounded-s-md`}
                  onClick={() => {
                    menu.func();
                  }}
                >
                  <div>
                    <span className="">
                      {React.createElement(menu.icon || Home, {
                        size: "30",
                      })}
                    </span>
                  </div>
                  <h2
                    className={`whitespace-pre duration-200 delay-200  ${
                      !isSidebarOpen && "opacity-0 translate-r-28 overflow-hidden "
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  {/* <h2
                    className={`${
                      isSidebarOpen && "hidden"
                    } absolute start-[80px] bg-black bg font-semibold whitespace-pre text-white rounded-md  scale-0  w-0 overflow-hidden sm:group-hover:scale-110 group-hover:scale-100 px-2 py-1  group-hover:duration-300 group-hover:w-fit z-50  `}
                  >
                    {menu?.name}
                  </h2> */}
                </button>
              );
            }
          })}
        </div>
      </div>
    </section>
  );
};

export default MainNav;
