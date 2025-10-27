import { Metadata } from "next";
import OrganizationSettingsForm from "./organization-settings-form";
import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "@/i18n/routing";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Organization Settings - Edara ™",
  description: "Manage your organization settings",
};

export default async function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ orgid: string; locale: string }>;
}) {
  const { orgid, locale } = await params;
  const user = await auth();

  if (!user?.user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const organization = await prismaDb.organization.findFirst({
    where: {
      id: orgid,
      ownerId: user.user.id,
    },
  });

  if (!organization) {
    notFound();
  }

  return (
    <div className="bg-gray-50 p-4 md:p-6 gap-4 md:gap-6 flex flex-col h-full w-full">
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {locale === "ar" ? "إعدادات المنشأة" : "Organization Settings"}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === "ar"
              ? "إدارة معلومات منظمتك وإعداداتها"
              : "Manage your organization's information and settings"}
          </p>

          <OrganizationSettingsForm organization={organization} locale={locale} />
        </div>
      </div>
    </div>
  );
}
