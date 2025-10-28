import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import GlobalModalManager from "@/components/modals/GlobalModalManager";
import { Suspense } from "react";

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

  console.log({ orgid });

  return (
    <>
      <Suspense fallback={<div>Loading organization data...</div>}>
        {children}
        <GlobalModalManager orgID={orgid} />
      </Suspense>
    </>
  );
}
