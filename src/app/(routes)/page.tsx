import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
export default async function RootPage() {
    const user = await auth();
    if (!user?.user.id) {
        redirect("/login");
    }
    const store = await prismaDb.organization.findFirst({
        where: {
            ownerId: user?.user.id,
        },
    });
    if (store) {
        console.log("redirected");
        redirect(`/${store.id}`);
    }
    return (
        <div className="h-screen w-full flex items-center justify-center ">
            <Loader2 />
        </div>
    );
}
