import { useState, useEffect, useCallback } from "react";
import useInvoice from "@/lib/zustand/invoiceStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import {
  SaveSalesInvoice,
  UpadteSalesInvoice,
} from "@/app/[locale]/(dashboard)/[orgid]/(invoices)/(addinvoice)/add-sales-invoice/sales-utils";
import { useRouter } from "@/i18n/routing";
import {
  SavePurchaseInvoice,
  UpadtePurchaseInvoice,
} from "@/app/[locale]/(dashboard)/[orgid]/(invoices)/(addinvoice)/add-purchase-invoice/purchase-utils";
import {
  saveREtInvoiceToDB,
  UpadteReturnsInvoice,
} from "@/app/[locale]/(dashboard)/[orgid]/(invoices)/(addinvoice)/add-returns-invoice/sales-returns-utils";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const useInvoiceActions = (type: "sales" | "returns" | "purchases") => {
  const router = useRouter();
  const params: { orgid: string } = useParams();
  const [loading, setLoading] = useState(false);
  const SalesStore = useInvoice();
  const ReturnsStore = useReturnsInvoice();
  const PurchasesStore = usePurchaseInvoice();
  const t = useTranslations("sales_invoice");

  const redirect = (url: any) => {
    router.push(url);
  };

  const getLabel = () => {
    if (
      SalesStore.InvoiceId ||
      ReturnsStore.InvoiceId ||
      PurchasesStore.InvoiceId
    ) {
      return t("update_invoice");
    } else {
      return t("save_invoice");
    }
  };

  const isDisabled = () => {
    switch (type) {
      case "sales":
        return !SalesStore.customerId || SalesStore.items.length < 1;
      case "returns":
        return !ReturnsStore.customerId || ReturnsStore.items.length < 1;
      case "purchases":
        return (
          !PurchasesStore.SupplierId ||
          PurchasesStore.PurchaseInvoiceItems.length < 1
        );
      default:
        return true;
    }
  };

  const onSave = async () => {
    if (type === "sales") {
      if (SalesStore.InvoiceId) {
        UpadteSalesInvoice(SalesStore, setLoading, redirect, params.orgid);
      } else {
        await SaveSalesInvoice(
          {
            customerId: SalesStore.customerId,
            date: SalesStore.date,
            invoiceAmount: SalesStore.invoiceAmount,
            Items: SalesStore.items,
            invoiceId: SalesStore.InvoiceId,
            paidAmount: SalesStore.paidAmount,
          },
          setLoading,
          redirect,
          params.orgid,
          SalesStore.setpaidAmount,
          SalesStore.clearData
        );
      }
    } else if (type === "returns") {
      if (ReturnsStore.InvoiceId) {
        UpadteReturnsInvoice(ReturnsStore, setLoading, redirect, params.orgid);
      } else {
        await saveREtInvoiceToDB(
          ReturnsStore,
          setLoading,
          redirect,
          params.orgid
        );
      }
    } else if (type === "purchases") {
      if (PurchasesStore.InvoiceId) {
        UpadtePurchaseInvoice(
          PurchasesStore,
          setLoading,
          redirect,
          params.orgid
        );
      } else {
        await SavePurchaseInvoice(
          PurchasesStore,
          setLoading,
          redirect,
          params.orgid as string
        );
      }
    }
  };

  const clearData = () => {
    switch (type) {
      case "sales":
        SalesStore.clearData();
        break;
      case "returns":
        ReturnsStore.clearData();
        break;
      case "purchases":
        PurchasesStore.ClearData();
        break;
    }
  };

  return {
    isDisabled: isDisabled(),
    onSave,
    clearData,
    label: getLabel(),
    loading,
  };
};

export { useInvoiceActions };
