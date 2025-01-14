import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import MainNavTop from "@/components/mainNavTop";
import MainNav from "@/components/MainNav";
import dynamic from "next/dynamic";
import useInvoice from "@/lib/zustand/invoiceStore";
import useModals from "@/lib/zustand/useModals";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";

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
  params: { orgid: string; locale: string };
}) {
  useModals.setState({
    addOrgMOdalIsOpen: false,
  });
  const user = await auth();

  if (!user?.user) {
    redirect({ href: "/login", locale: params.locale });
    return null;
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
    redirect({ href: "/", locale: params.locale });
    return null;
  }

  return (
    <>
      <Backdrop />
      <div className=" w-full bg-[#fafafa]  ">
        <MainNav />
        <div className="rtl:mr-12 rtl:sm:mr-16 ltr:ml-12 ltr:sm:ml-16">
          <div
            id="radix-modal"
            className="relative flex flex-col h-screen max-h-screen mx-auto max-w-screen-2xl "
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
              className={`my-auto mx-auto  overflow-y-auto w-full py-1 h-full flex flex-col `}
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
