"use client";

import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand/invoiceStore";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import { useTranslations } from "next-intl";

export default function InvoiceDate({ type }: { type: "sales" | "returns" | "purchases" }) {
  const SalesStore = useInvoice();
  const ReturnsStore = useReturnsInvoice();
  const PurchasesStore = usePurchaseInvoice();
  const t = useTranslations("sales_invoice");

  const date = {
    sales: SalesStore.date,
    returns: ReturnsStore.date,
    purchases: PurchasesStore.Date,
  };
  const updateDate = {
    sales: SalesStore.updateDate,
    returns: ReturnsStore.updateDate,
    purchases: PurchasesStore.UpdateDate,
  };
  return (
    <Popover>
      <div className="flex flex-col">
        <label htmlFor="">{t("date")}</label>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              " flex justify-between items-center text-center h-9 w-full sm:w-[250px]  text-black font-bold text-base border-stone-300 rounded-none",
              !date && "text-muted-foreground"
            )}
          >
            {date ? format(new Date(date[type] || new Date()), "PPP") : <span>{t("date")}</span>}
            <CalendarIcon className="mr-2 h-5 w-5 " />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0 text-black" matchTriggerWidth={false}>
        <Calendar
          mode="single"
          selected={date[type]}
          onSelect={(value) => updateDate[type](value)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
