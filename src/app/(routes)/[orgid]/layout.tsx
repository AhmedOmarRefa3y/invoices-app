import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import type { Metadata } from "next";
import "../../../app/globals.css";

import MainNavTop from "@/components/mainNavTop";
import { Providers } from "@/components/providers/Providers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "ُEdara Erp",
    description: "ERP system",
};

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { orgid: string };
}) {
    const user = await auth();

    if (!user?.user) {
        redirect("/login");
    }

    const organization = await prismaDb.organization.findUnique({
        where: {
            id: params.orgid,
            ownerId: user?.user.id,
        },
        include: {
            products: {
                include: {
                    Part: true,
                },
            },
            Catgories: true,
            Customer: true,
            Units: true,
        },
    });

    if (!organization) {
        redirect("/");
    }

    return (
        <>
            <Providers
                categories={organization.Catgories}
                products={organization.products}
                customers={organization.Customer}
                units={organization.Units}
            >
                <Backdrop />
                <div className="relative flex flex-col items-center justify-center h-screen">
                    {/* <div className="w-16">
                        <MainNav />
                    </div> */}
                    <MainNavTop organization={organization} />
                    <div className="w-full h-full relative max-w-screen-2xl mx-auto ">
                        {children}
                    </div>
                </div>
            </Providers>
        </>
    );
}
