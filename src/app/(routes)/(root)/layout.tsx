import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import { redirect } from "next/navigation";
import "./../../globals.css";
export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
        redirect(`/${store.id}`);
    }
    return <>{children}</>;
}
