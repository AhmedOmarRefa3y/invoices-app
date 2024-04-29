import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import { redirect } from "next/navigation";
import OpenOrgModal from "@/components/openOrgModal";
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
    } else {
        return <OpenOrgModal />;
    }
}
