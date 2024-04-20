import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import type { Metadata } from "next";
import "../../../app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            Customer: {
                orderBy: {
                    name: "asc",
                },
            },
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

                <div className=" w-full bg-[#fafafa]  ">
                    <MainNav />
                    <div className="sm:mr-16 mr-12">
                        <div
                            id="radix-modal"
                            className="relative flex  flex-col  max-w-screen-2xl  h-screen max-h-screen mx-auto"
                        >
                            <MainNavTop organization={organization} />
                            <div
                                className={`my-auto mx-auto  overflow-y-auto w-full py-1 h-full `}
                            >
                                {children}
                                <Analytics />
                                <SpeedInsights />
                            </div>
                        </div>
                    </div>
                </div>
            </Providers>
        </>
    );
}
