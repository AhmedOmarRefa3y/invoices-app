import React from "react";
import { Button } from "./button";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Spinner } from "../loadingComp";

export default function Formbtn() {
  const { pending } = useFormStatus();
  const t = useTranslations("addNewCustomerModal");

  return (
    <Button
      type="submit"
      className={`w-full py-1 ${pending && "bg-black/70 cursor-not-allowed "} hover:bg-black/80`}
      disabled={pending}
    >
      {pending ? <Spinner /> : t("save")}
    </Button>
  );
}
