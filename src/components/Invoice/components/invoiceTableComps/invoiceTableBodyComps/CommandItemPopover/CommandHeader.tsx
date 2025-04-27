import React from "react";
import { CommandEmpty, CommandInput } from "@/components/ui/command";
import { useTranslations } from "next-intl";
const CommandItemHeader = () => {
  const t = useTranslations("sales_invoice");

  return (
    <div className="sticky top-0 z-[100] w-full rounded-none">
      <CommandInput
        placeholder={t("search_product")}
        className="rounded-none h-fit py-1 capitalize"
      />
      <div className="flex rounded-none items-center  font-bold text-base bg-[#fafafa]    ">
        <span className="basis-[60%] sm:basis-[80%] text-start ps-3 border border-t-transparent border-r-transparent border-stone-300 py-1">
          {t("product")}
        </span>
        <span className="basis-[20%] sm:basis-[10%] text-center border border-t-transparent border-r-transparent border-stone-300 py-1">
          {t("price")}
        </span>
        <span className="basis-[20%] sm:basis-[10%] text-center border border-t-transparent border-r-transparent border-stone-300 py-1">
          {t("edit_product")}
        </span>
      </div>
      <CommandEmpty className="text-lg text-center font-bold p-4">
        {t("no_product")}
      </CommandEmpty>
    </div>
  );
};

export default CommandItemHeader;
