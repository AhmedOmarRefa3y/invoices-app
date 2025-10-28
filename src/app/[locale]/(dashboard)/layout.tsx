// import Backdrop from "@/components/ui/backdrop";
import TopNavbar from "@/components/TopNavbar";
import SideBar from "@/components/SideBar";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await auth();

  if (!user?.user?.id) {
    redirect({ href: "/login", locale });
    return null;
  }

  return (
    <>
      {/* <Backdrop /> */}
      <div className="w-full bg-[#fafafa] flex">
        <SideBar />
        <div className="w-full">
          <div className="relative flex flex-col lg:h-screen lg:max-h-screen mx-auto ">
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
