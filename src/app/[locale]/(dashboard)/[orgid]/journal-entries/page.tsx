import React from "react";
import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";
import { redirect } from "@/i18n/routing";
import JournalEntriesPageClient from "./JournalEntriesPageClient";

interface PageProps {
  params: Promise<{
    orgid: string;
    locale: string;
  }>;
}

const JournalEntriesPage = async ({ params }: PageProps) => {
  const { orgid, locale } = await params;
  const user = await auth();

  if (!user?.user) {
    redirect({ href: "/login", locale: locale });
    return null;
  }

  const journalEntries = await prismaDb.journalEntry.findMany({
    where: {
      organizationId: orgid,
    },
    include: {
      lines: {
        include: {
          account: true,
        },
      },
    },
    orderBy: {
      number: "desc",
    },
    take: 50,
  });

  return <JournalEntriesPageClient params={{ orgid, locale }} journalEntries={journalEntries} />;
};

export default JournalEntriesPage;
