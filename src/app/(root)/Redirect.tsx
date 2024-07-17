import { redirect } from "next/navigation";
import prismaDb from "@/lib/prisma";
import RedirectClient from "./RedirectClient";
import { auth, signIn } from "@/auth";
import OpenModal from "./openModal";

export default async function RedirectCompLayout() {
    const user = await auth();
    if (!user?.user?.id) {
        redirect("/login");
    }
    const store = await prismaDb.organization.findFirst({
        where: {
            ownerId: user?.user.id,
        },
    });
    if (store) {
        redirect(`/${store.id}`);
    }
    return <OpenModal />;
}
