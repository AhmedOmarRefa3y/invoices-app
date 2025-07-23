import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import type { Metadata } from "next";

import TopNavbar from "@/components/TopNavbar";
import SideBar from "@/components/SideBar";
import useModals from "@/lib/zustand/useModals";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
// import AddNewProductModal from "@/components/modals/addProductModal";
// import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
// import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
// import { AddNewUnitModal } from "@/components/modals/addUnitModal";
// import { AddNewCategoryModal } from "@/components/modals/addInventoryModal";
import GlobalModalManager from "@/components/GlobalModalManager";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgid: string; locale: string };
}) {
  const { locale, orgid } = await params;
  useModals.setState({
    addOrgMOdalIsOpen: false,
  });
  const user = await auth();

  if (!user?.user) {
    redirect({ href: "/login", locale: locale });
    return null;
  }

  const organization = await prismaDb.organization.findFirst({
    where: {
      id: orgid,
      ownerId: user?.user.id,
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
        <SideBar />
        <div className="rtl:mr-12 rtl:sm:mr-16 ltr:ml-12 ltr:sm:ml-16">
          <div
            id="radix-modal"
            className="relative flex flex-col h-screen max-h-screen mx-auto max-w-screen-2xl "
          >
            <GlobalModalManager orgID={params.orgid} />
            <TopNavbar orgName={organization.name} userName={user?.user.name} />
            <div className={`my-auto mx-auto  overflow-y-auto w-full py-1 h-full flex flex-col `}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
