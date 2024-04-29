"use client";
import dynamic from "next/dynamic";

const DynamicHome = dynamic(() => import("@/components/NewHomePAge"), {
    ssr: false,
});
const page = () => {
    return <DynamicHome />;
};

export default page;
