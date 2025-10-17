"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";
import { JournalEntryColumnData } from "./columns";
import { TableUi as DataTable } from "@/components/table";
import { columns } from "./columns";
import AddNewJournalEntryModal from "@/components/modals/AddNewJournalEntryModal";
import { JournalEntry, Prisma, PrismaClient } from "@prisma/client";

// Define types for our data
type JournalEntryLineFromServer = Prisma.JournalEntryLineGetPayload<{}>;

type JournalEntryFromServer = Prisma.JournalEntryGetPayload<{
  include: {
    lines: {};
  };
}>;

interface Props {
  params: {
    orgid: string;
    locale: string;
  };
  journalEntries: JournalEntryFromServer[];
}

const JournalEntriesPageClient = ({ journalEntries }: Props) => {
  const t = useTranslations("JournalEntries");
  const { SetAddJournalEntryModalIsOpen } = useModals();

  const formattedEntries: JournalEntryColumnData[] = journalEntries.map((entry) => {
    const totalAmount = entry.lines.reduce((sum: number, line: JournalEntryLineFromServer) => {
      const debitValue = Number(line.debit || 0);
      return sum + debitValue;
    }, 0);

    const state: "draft" | "posted" | "cancel" = entry.posted ? "posted" : "draft";

    return {
      id: entry.id,
      reference: `JRN-${entry.number}`,
      journalName: `Journal #${entry.number}`,
      date: new Date(entry.date),
      description: entry.description || "",
      totalAmount,
      state,
    };
  });

  return (
    <>
      <div className="p-4">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t("journalEntries")}</h1>
            <p className="text-gray-600">{t("journalEntriesDescription")}</p>
          </div>
          <Button onClick={() => SetAddJournalEntryModalIsOpen(true)} className="flex items-center">
            <Plus className="h-4 w-4 me-2" />
            {t("add_journal_entry")}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <DataTable
            columns={columns}
            data={formattedEntries}
            filterEnabled={true}
            filterAccessorKey="reference"
            filterplaceholder={t("filterPlaceholder")}
          />
        </div>
      </div>
      <AddNewJournalEntryModal />
    </>
  );
};

export default JournalEntriesPageClient;
