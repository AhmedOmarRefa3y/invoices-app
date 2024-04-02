import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import type { Metadata } from "next";
import "../../../app/globals.css";

import MainNavTop from "@/components/mainNavTop";
import { Providers } from "@/components/providers/Providers";
import { redirect } from "next/navigation";
import MainNav from "@/components/MainNav";

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
                <div className="relative h-screen w-full mx-auto bg-[#fafafa] ">
                    <div className="fixed top-0 w-full z-50">
                        <MainNavTop organization={organization} />
                    </div>
                    <div className="flex h-screen">
                        <MainNav />
                        <div className="max-w-screen-2xl max-h-screen h-full mr-16 2xl:mx-auto  w-full  relative pt-[50px] px-2  overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </Providers>
        </>
    );
}
