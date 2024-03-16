import MainNav from "@/components/MainNav";
import Backdrop from "@/components/ui/backdrop";
import type { Metadata } from "next";
import "../../../app/globals.css";
import { auth } from "auth";
import prismaDb from "@/lib/prisma";
import { Providers } from "@/providers/Providers";
import { redirect } from "next/navigation";
import SelectOrg from "@/components/selectOrg";

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
    console.log(user?.user);
    if (!user?.user) {
        redirect("/login");
    }
    const organization = await prismaDb.organization.findUnique({
        where: {
            id: params.orgid,
            ownerId: user?.user.id,
        },
    });

    if (!organization) {
        redirect("/");
    }
    const products = await prismaDb.product.findMany({
        where: {
            organizationId: params.orgid,
        },
        include: {
            Part: true,
        },
    });

    const categories = await prismaDb.catgories.findMany({
        where: {
            organizationId: params.orgid,
        },
    });
    const customers = await prismaDb.customer.findMany({
        where: {
            organizationId: params.orgid,
        },
    });
    const units = await prismaDb.units.findMany({
        where: {
            organizationId: params.orgid,
        },
    });
    const organizations = await prismaDb.organization.findMany({
        where: {
            ownerId: user?.user.id,
        },
    });
    return (
        <>
            <Providers
                categories={categories}
                products={products}
                customers={customers}
                units={units}
            >
                <Backdrop />
                <div className="relative flex max-h-screen">
                    <div className="w-16">
                        <MainNav />
                    </div>
                    <div className="w-full h-full max-h-screen min-h-screen overflow-y-scroll relative ">
                        <div className="absolute flex flex-col items-center top-1 left-0 bg-red-500 z-40">
                            <div>{user.user.name}</div>
                            <div>{organization.name}</div>
                            <SelectOrg organizations={organizations} />
                        </div>
                        <div className="max-w-screen-2xl mx-auto ">
                            {children}
                        </div>
                    </div>
                </div>
            </Providers>
        </>
    );
}
