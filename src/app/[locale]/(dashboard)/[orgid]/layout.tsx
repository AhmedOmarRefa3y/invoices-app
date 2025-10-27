import Backdrop from "@/components/ui/backdrop";
import TopNavbar from "@/components/TopNavbar";
import SideBar from "@/components/SideBar";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import GlobalModalManager from "@/components/modals/GlobalModalManager";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgid: string; locale: string }>;
}) {
  const { locale, orgid } = await params;
  const user = await auth();

  if (!user?.user?.id) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <>
      <Backdrop />
      <div className="w-full bg-[#fafafa]">
        <SideBar />
        <div className="rtl:mr-12 rtl:sm:mr-16 ltr:ml-12 ltr:sm:ml-16">
          <div className="relative flex flex-col lg:h-screen lg:max-h-screen mx-auto max-w-screen-2xl">
            <GlobalModalManager orgID={orgid} />
            <TopNavbar userID={user.user.id} />
            <div className="my-auto mx-auto overflow-y-auto w-full py-1 h-full flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
