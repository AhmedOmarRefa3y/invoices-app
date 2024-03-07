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
    if (!session || !session.user)
        return (
            <div>
                <div className="text-red-500 p-5">You Need To Sign In</div>
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
    return <div>This is a server Page and must be protected</div>;
};

export default page;
