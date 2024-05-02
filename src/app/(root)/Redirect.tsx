import { auth } from "auth";
import { redirect } from "next/navigation";
import prismaDb from "@/lib/prisma";
import RedirectClient from "./RedirectClient";

export default async function RedirectCompLayout() {
    const user = await auth();
    if (!user?.user.id) {
        redirect("/login");
    }
    const store = await prismaDb.organization.findFirst({
        where: {
            ownerId: user?.user.id,
        },
    });
    if (!store) {
        return;
    }
    return <RedirectClient id={store.id} />;
}
