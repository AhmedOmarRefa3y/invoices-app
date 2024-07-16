import { auth } from "@/auth";
import Form from "./form";
import { redirect } from "next/navigation";
import prismaDb from "@/lib/prisma";

export default async function LoginPage() {
    const user = await auth();
    if (!user?.user.id) {
        return <Form />;
    }
    const findUserInDb = await prismaDb.user.findUnique({
        where: {
            id: user?.user.id,
        },
    });
    if (findUserInDb) {
        redirect("/");
    }
}
