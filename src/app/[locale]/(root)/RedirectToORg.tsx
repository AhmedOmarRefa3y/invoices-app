"use client";
import LoadingComp from "@/components/loadingComp";
import { redirect } from "@/i18n/routing";
import { useParams } from "next/navigation";

const RedirectToORg = ({ id }: { id: string }) => {
  const params = useParams();
  redirect({
    href: `/${id}`,
    locale: params.locale.toString(),
  });
  return <LoadingComp />;
};

export default RedirectToORg;
