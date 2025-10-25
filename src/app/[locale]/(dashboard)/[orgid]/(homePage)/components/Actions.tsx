"use client";
import React from "react";

import {
  ArrowRightLeft,
  Banknote,
  FilePlus,
  FileSpreadsheet,
  FileStack,
  LucideIcon,
  PackagePlus,
  Undo2,
  User,
  UserPlus,
  Warehouse,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useModals from "@/lib/zustand/useModals";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const Actions = () => {
  const {
    orgid,
    // locale
  } = useParams();
  const Modals = useModals();
  const t = useTranslations("homePage");

  const GridItem = ({
    ItemD,
    className,
  }: {
    ItemD: {
      label: string;
      icon?: LucideIcon;
      func?: () => void;
      link?: string;
    };
    className?: string;
  }) => {
    if (ItemD.func) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-3 border border-stone-100 shadow-sm rounded-lg bg-white text-gray-700 hover:bg-slate-700 hover:text-white cursor-pointer select-none transition-all duration-200 ease-in-out",
            className
          )}
          onClick={ItemD.func}
        >
          <div className="transform transition-transform duration-200 hover:scale-110">
            <span>{React.createElement(ItemD?.icon || User, { size: 32 })}</span>
          </div>
          <span className="text-xs mt-1 text-center line-clamp-2">{ItemD.label}</span>
        </div>
      );
    } else if (ItemD.link) {
      return (
        <Link
          href={`${ItemD.link}`}
          className={cn(
            "flex flex-col items-center justify-center p-3 border border-stone-100 shadow-sm rounded-lg bg-white text-gray-700 hover:bg-slate-700 hover:text-white cursor-pointer select-none transition-all duration-200 ease-in-out"
          )}
        >
          <div className="transform transition-transform duration-200 hover:scale-110">
            <span>{React.createElement(ItemD?.icon || User, { size: 32 })}</span>
          </div>
          <span className="text-xs mt-1 text-center line-clamp-2">{ItemD.label}</span>
        </Link>
      );
    } else {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-3 border border-stone-100 shadow-sm rounded-lg bg-white text-gray-700 select-none",
            className
          )}
        >
          <div className="transform transition-transform duration-200 hover:scale-110">
            <span>{React.createElement(ItemD?.icon || User, { size: 32 })}</span>
          </div>
          <span className="text-xs mt-1 text-center line-clamp-2">{ItemD.label}</span>
        </div>
      );
    }
  };

  const data: {
    label: string;
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
      label: t("returnsInvoice"),
      link: `/${orgid}/add-returns-invoice`,
      icon: Undo2,
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
      label: t("newSupplierPayment"),
      icon: DollarSign,
      func: () => {
        Modals.SetAddSupplierPaymentModalIsOpen(true);
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
    // {
    //   label: t("composedItems"),
    //   link: `/${orgid}/inventory/composed-items`,
    //   icon: Component,
    // },
  ];
  const items: React.JSX.Element[] = data.map((menu, index) => {
    return <GridItem key={index} ItemD={menu} />;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 h-full w-full gap-2 overflow-y-auto">
      {items}
    </div>
  );
};

export default Actions;
