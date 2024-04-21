import dynamic from "next/dynamic";

const DynamicHomePage = dynamic(() => import("@/components/NewHomePAge"), {
    ssr: false,
});

const page = async () => {
    return <DynamicHomePage />;
};

export default page;
