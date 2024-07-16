import { redirect } from "next/navigation";
import prismaDb from "@/lib/prisma";
import RedirectClient from "./RedirectClient";
import { auth, signIn } from "@/auth";
import useModals from "@/lib/zustand/useModals";

export default async function RedirectCompLayout() {
    const user = await auth();
    console.log(user);
    if (!user?.user.id) {
        redirect("/login");
    }
    console.log(user?.user.id);

    const store = await prismaDb.organization.findFirst({
        where: {
            ownerId: user?.user.id,
        },
    });
    console.log(store);

    if (!store) {
        useModals.setState({
            addOrgMOdalIsOpen: true,
        });
    }
    return <RedirectClient id={store?.id} />;
}
