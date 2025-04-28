"use client";

import { DbEdit } from "@/actions";
import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const HomePage = () => {
  const ModalsStore = useModals();
  const { SetAddPaymentModalIsOpen, SetIsProductioModalOpen } = ModalsStore;
  const t = useTranslations("topNav");
  const th = useTranslations("homePage");
  const params = useParams();
  const orgid = params.orgid as string;
  const locale = params.locale as string;

  const Items = [
    {
      name: t("add-sales-invoice"),
      href: `/${locale}/${orgid}/add-sales-invoice`,
    },
    {
      name: th("showSalesInvoices"),
      href: `/${locale}/${orgid}/sales`,
    },
    {
      name: t("add-returns-invoice"),
      href: `/${locale}/${orgid}/add-returns-invoice`,
    },
    {
      name: th("showReturnsInvoices"),
      href: `/${locale}/${orgid}/returnedInvoices`,
    },
    {
      name: th("creditNotice"),
      href: "",
      func: () => {
        SetAddPaymentModalIsOpen(true);
      },
    },
    {
      name: th("creditNotices"),
      href: `/${locale}/${orgid}/Payments`,
    },
    {
      name: th("production"),
      href: "",
      func: () => {
        SetIsProductioModalOpen(true);
      },
    },
    {
      name: t("inventory"),
      href: `/${locale}/${orgid}/inventory`,
    },
    {
      name: t("accounts-reports"),
      href: `/${locale}/${orgid}/accounts-reports`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center   gap-3 w-full shadow-xl p-5">
      {Items.map((item, i) => {
        return (
          <Link
            key={i}
            href={item.href}
            className="basis-[400px] flex-1 h-[150px] flex items-center justify-center bg-gradient-to-r from-[#F2DDC1] to-[#E2C2B9]  text-black text-center text-4xl font-bold p-2 rounded hover:from-[#F05454]  hover:to-[#F05454] hover:text-black duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-[#F05454]"
            onClick={item.func}
          >
            {item.name}
          </Link>
        );
      })}
      <Button
        onClick={async () => {
          DbEdit();
        }}
      >
        {th("edit")}
      </Button>
    </div>
  );
};

export default HomePage;
