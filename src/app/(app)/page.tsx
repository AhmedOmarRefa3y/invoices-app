import HomePage from "@/components/HomePage";
import NewHomePAge from "@/components/NewHomePAge";
import { GetCustomersBalances } from "./accounts-reports/utils";
import prismaDb from "@/lib/prisma";

const page = async () => {
    return <NewHomePAge />;
};

export default page;
