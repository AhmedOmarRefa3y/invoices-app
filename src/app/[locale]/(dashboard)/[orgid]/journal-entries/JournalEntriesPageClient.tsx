"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";
import { JournalEntryColumnData } from "./columns";
import { TableUi as DataTable } from "@/components/table";
import { columns } from "./columns";
import AddNewJournalEntryModal from "@/components/modals/AddNewJournalEntryModal";
import { Prisma } from "@prisma/client";
import { useIsClient } from "@uidotdev/usehooks";

type JournalEntryFromServer = Prisma.JournalEntryGetPayload<{
  include: {
    lines: {
      include: {
        account: true;
      };
    };
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
  const isClient = useIsClient();
  if (!isClient) return null;

  // 🔹 تنسيق بيانات كل قيد بشكل مستقل
  const formattedEntries = journalEntries.map((entry) => {
    const state: "draft" | "posted" | "cancel" = entry.posted ? "posted" : "draft";

    const lines: JournalEntryColumnData[] = entry.lines.map((line) => {
      const isDebit = Number(line.debit) > 0;

      return {
        id: line.id,
        reference: line.reference ?? "-",
        journalName: `Journal #${entry.number}`,
        date: entry.date,
        description: line.description || entry.description || "-",
        state,
        type: isDebit ? "Debit" : "Credit",
        AccountName: line.account?.name ?? "-",
        amount: isDebit ? Number(line.debit) : Number(line.credit),
      };
    });

    return {
      id: entry.id,
      number: entry.number,
      date: entry.date,
      description: entry.description,
      state,
      lines,
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

        {/* 🔹 عرض كل قيد في جدول منفصل */}
        <div className="space-y-8">
          {formattedEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between mb-4 border-b pb-2">
                <div>
                  <h2 className="text-lg font-semibold">قيد #{entry.number}</h2>
                  <p className="text-sm text-gray-500">{entry.description || "-"}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  {" | "}
                  <span className="capitalize">{entry.state}</span>
                </div>
              </div>

              {/* الجدول الخاص بكل قيد */}
              <DataTable
                columns={columns}
                data={entry.lines}
                filterEnabled={false}
                pagination={false}
              />
            </div>
          ))}
        </div>
      </div>

      <AddNewJournalEntryModal />
    </>
  );
};

export default JournalEntriesPageClient;
