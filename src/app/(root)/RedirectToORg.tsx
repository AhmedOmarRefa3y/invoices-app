"use client";
import LoadingComp from "@/components/loadingComp";
import { useRouter } from "next/navigation";

const RedirectToORg = ({ id }: { id: string }) => {
    const router = useRouter();
    router.push(`/${id}`);
    return <LoadingComp />;
};

export default RedirectToORg;
