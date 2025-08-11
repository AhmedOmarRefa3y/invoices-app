"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const MainNavTop = ({
  userName,
  orgName,
}: {
  userName: string | null | undefined;
  orgName: string;
}) => {
  const pathName = usePathname();
  const parts = pathName.split("/");
  const t = useTranslations("topNav");
  const paths: any = {
    "/": t("home"),
    "add-sales-invoice": t("add-sales-invoice"),
    "add-returns-invoice": t("add-returns-invoice"),
    "production-orders": t("production-orders"),
    "production-plans": t("production-plans"),
    "accounts-reports": t("accounts-reports"),
    "customer-credit": t("customer-credit"),
    invoices: t("invoices"),
    "composed-items": t("composed-items"),
    "initial-quantities": t("initial-quantities"),
    "product-records": t("product-records"),
    Payments: t("Payments"),
    returnedInvoices: t("returnedInvoices"),
    showREtInvoice: t("showREtInvoice"),
    sales: t("sales"),
    releaseorder: t("releaseorder"),
    showInvoice: t("showInvoice"),
    inventory: t("inventory"),
    "account-statement": t("account-statement"),
    "add-purchase-invoice": t("add-purchase-invoice"),
    purchases_invocies: t("purchases_invocies"),
  };

  let value = null;

  for (let i = parts.length - 1; i >= 0; i--) {
    if (paths[parts[i]]) {
      value = paths[parts[i]];
      break;
    }
  }
  return (
    <div className=" flex items-center sticky top-0 left-0 right-0 w-full  justify-between py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px]  border-b border-b-stone-300 mx-auto z-50">
      <div className="  sm:flex">
        <span className="font-medium truncate max-w-[140px] px-2">
          {" "}
          {value ? value : t("home")}
        </span>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <div className="flex flex-col text-sm  justify-center font-light">
          <span className="font-medium truncate max-w-[100px] md:max-w-none">{orgName}</span>
          <span className="text-xs truncate max-w-[150px]">{userName}</span>
        </div>
        <LanguageSwitcher />
        <span
          onClick={() => signOut()}
          className="text-slate-900 duration-300 hover:bg-[#f5f4f4] p-1 rounded-sm hover:text-emerald-500 "
        >
          <LogOut size={25} />
        </span>
      </div>
    </div>
  );
};

export default MainNavTop;
