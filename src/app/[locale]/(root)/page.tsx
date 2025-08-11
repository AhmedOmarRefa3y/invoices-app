import React from "react";
import { redirect } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";
import RedirectToORg from "./RedirectToORg";
import OpenModal from "./openModal";
import { OrgSelector } from "./OrgSelector";

const page = async ({ params }: { params: { locale: string } }) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect({
      href: "/login",
      locale: params.locale,
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
  if (organizations.length === 1) {
    return <RedirectToORg id={organizations[0].id} />;
  }

  // If multiple organizations, show selector
  return <OrgSelector organizations={organizations} />;
};

export default page;
