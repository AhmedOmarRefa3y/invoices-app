import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import MainNavTop from "@/components/mainNavTop";
import { redirect } from "next/navigation";
import MainNav from "@/components/MainNav";
import dynamic from "next/dynamic";
import useInvoice from "@/lib/zustand/invoiceStore";

export const metadata: Metadata = {
    title: "ُEdara Erp",
    description: "ERP system",
};

const DynamicProviders = dynamic(
    () => import("@/components/providers/Providers"),
    {
        ssr: false,
    }
);

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { orgid: string };
}) {
    useInvoice.setState({
        addOrgMOdalIsOpen: false,
    });
    const user = await auth();

    if (!user?.user) {
        redirect("/login");
    }

    const organization = await prismaDb.organization.findFirst({
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
            <Backdrop />
            <div className=" w-full bg-[#fafafa]  ">
                <MainNav />
                <div className="mr-12 sm:mr-16">
                    <div
                        id="radix-modal"
                        className="relative flex flex-col h-screen max-h-screen mx-auto max-w-screen-2xl"
                    >
                        <DynamicProviders
                            categories={organization.Catgories}
                            products={organization.products}
                            customers={organization.Customer}
                            units={organization.Units}
                        />
                        <MainNavTop
                            orgName={organization.name}
                            userName={user?.user.name}
                        />
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
        </>
    );
}
