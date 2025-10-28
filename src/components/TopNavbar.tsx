"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OrgSwitcher } from "./OrgSwitcher";
import { organization } from "@prisma/client";
import { getUsrOrganizations } from "@/actions/organization";
import LoadingIndicator from "@/components/ui/loading-indicator";

export const MainNavTop = ({ userID }: { userID: string }) => {
  const pathName = usePathname();
  const { orgid } = useParams();
  const t = useTranslations("topNav");

  const [userOrgs, setUserOrgs] = useState<organization[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserOrgs = async () => {
      setLoading(true);
      try {
        const res = await getUsrOrganizations(userID);
        setUserOrgs(res);
      } catch (error) {
        console.error("Error fetching user organizations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrgs();
  }, [userID]);

  const parts = pathName.split("/");
  const paths: Record<string, string> = {
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

  let value = t("home");
  for (let i = parts.length - 1; i >= 0; i--) {
    if (paths[parts[i]]) {
      value = paths[parts[i]];
      break;
    }
  }

  return (
    <div className="flex items-center sticky top-0 left-0 right-0 w-full justify-end sm:justify-between py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px] border-b border-b-stone-300 mx-auto z-50 overflow-hidden">
      <div className="hidden sm:flex">
        <span className="font-medium truncate px-2">{value}</span>
      </div>
      <LoadingIndicator />

      <div className="flex gap-2 items-center justify-center">
        {loading ? (
          <div className="h-9 w-[90px] bg-muted animate-pulse rounded-md" />
        ) : (
          <OrgSwitcher organizations={userOrgs ?? []} currentOrgId={orgid as string} />
        )}

        <LanguageSwitcher />

        <span
          onClick={() => signOut()}
          className="text-slate-900 duration-300 hover:bg-[#f5f4f4] p-1 rounded-sm hover:text-emerald-500 cursor-pointer"
        >
          <LogOut size={25} />
        </span>
      </div>
    </div>
  );
};

export default MainNavTop;
