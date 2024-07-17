import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";
import RedirectToORg from "./RedirectToORg";
import OpenModal from "./openModal";
const page = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const store = await prismaDb.organization.findFirst({
        where: {
            ownerId: session.user.id,
        },
    });

    if (store) {
        return <RedirectToORg id={store.id} />;
    } else {
        return <OpenModal />;
    }
};

export default page;
