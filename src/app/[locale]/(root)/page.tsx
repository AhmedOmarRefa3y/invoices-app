import React from "react";
import { redirect } from "@/i18n/routing";
import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";
import RedirectToORg from "./RedirectToORg";
import OpenModal from "./openModal";
import { OrgSelector } from "./OrgSelector";

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user?.id) {
    redirect({
      href: "/login",
      locale: locale,
    });
    return;
  }

  const organizations = await prismaDb.organization.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // If no organizations, show modal to create first one
  if (organizations.length === 0) {
    return <OpenModal />;
  }

  // If only one organization, redirect to it
  if (organizations.length > 0) {
    // Redirect to the latest created org (last in the sorted array)
    return <RedirectToORg id={organizations[organizations.length - 1].id} />;
  }

  // If multiple organizations, show selector
  return <OrgSelector organizations={organizations} />;
};

export default page;
