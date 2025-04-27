import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useInvoiceActions } from "@/lib/hooks/invoice/useInvoiceActions";
import { useTranslations } from "next-intl";

interface InvoiceProps {
  type: "sales" | "returns" | "purchases";
}

const InvoiceAction: React.FC<InvoiceProps> = ({ type }) => {
  const { isDisabled, onSave, clearData, label, loading } =
    useInvoiceActions(type);
  const t = useTranslations("sales_invoice");
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <Button
        variant="default"
        type="button"
        onClick={onSave}
        className="w-full text-lg md:w-fit bg-green-500 text-black font-bold hover:bg-green-600"
        disabled={isDisabled || loading}
      >
        {label}
      </Button>
      <Button
        className="col-span-2 mr-auto w-full bg-red-500 hover:bg-red-600 text-lg text-black font-bold"
        onClick={clearData}
      >
        {t("cancel")}
      </Button>
    </div>
  );
};

export default InvoiceAction;
