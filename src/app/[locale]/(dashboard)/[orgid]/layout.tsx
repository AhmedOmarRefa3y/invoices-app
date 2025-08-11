import Backdrop from "@/components/ui/backdrop";
import prismaDb from "@/lib/prisma";
import TopNavbar from "@/components/TopNavbar";
import SideBar from "@/components/SideBar";
import useModals from "@/lib/zustand/useModals";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import GlobalModalManager from "@/components/GlobalModalManager";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgid: string; locale: string };
}) {
  const { locale, orgid } = await params;
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

  // Fetch all organizations for this user
  const userOrganizations = await prismaDb.organization.findMany({
    where: {
      ownerId: user?.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <>
      <Backdrop />
      <div className=" w-full bg-[#fafafa]  ">
        <SideBar />
        <div className="rtl:mr-12 rtl:sm:mr-16 ltr:ml-12 ltr:sm:ml-16">
          <div className="relative flex flex-col lg:h-screen lg:max-h-screen mx-auto max-w-screen-2xl ">
            <GlobalModalManager orgID={params.orgid} />
            <TopNavbar 
              orgName={organization.name} 
              userName={user?.user.name} 
              organizations={userOrganizations}
              currentOrgId={orgid}
            />
            <div className={`my-auto mx-auto  overflow-y-auto w-full py-1 h-full flex flex-col `}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
