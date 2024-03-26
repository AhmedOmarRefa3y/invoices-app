import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import type { Metadata } from "next";
import "../../../app/globals.css";

import MainNavTop from "@/components/mainNavTop";
import { Providers } from "@/components/providers/Providers";
import { redirect } from "next/navigation";
import MainNav from "@/components/mainNav";

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
                <div className="relative">
                    <div className="fixed top-0 w-full">
                        <MainNavTop organization={organization} />
                    </div>
                    <div className="flex h-screen">
                        <div className="relative">
                            <MainNav />
                        </div>
                        <div className="max-w-screen-2xl  min-h-screen h-full mr-16 2xl:mx-auto  w-full  relative pt-[50px] ">
                            {children}
                        </div>
                    </div>
                </div>
            </Providers>
        </>
    );
}
