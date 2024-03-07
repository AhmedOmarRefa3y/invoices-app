import HomePage from "@/components/HomePage";
import NewHomePAge from "@/components/NewHomePAge";
import { GetCustomersBalances } from "./accounts-reports/utils";
import prismaDb from "@/lib/prisma";
import { auth, signIn, signOut } from "auth";
import { Button } from "@/components/ui/button";
import SignInBtn from "./signInBtn";

const page = async () => {
    // return <NewHomePAge />;
    const session = await auth();
    console.log(session);

    return (
        <div>
            <div className="text-red-500 p-5">
                {session ? "signned in " : "not signed"}
            </div>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
            >
                <button type="submit">Sign Out</button>
            </form>
            <form
                action={async () => {
                    "use server";
                    await signIn();
                }}
            >
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default page;
