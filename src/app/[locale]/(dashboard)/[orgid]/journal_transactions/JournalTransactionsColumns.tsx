"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export type JournalTransactionsColumnDataT = {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountName: string;
  accountCode?: string;
  description: string;
  debit: number;
  credit: number;
  date: Date;
  reference?: string;
  balanceAfter: number;
  entryNumber: number;
};

export const JournalTransactionscolumns: ColumnDef<JournalTransactionsColumnDataT>[] = [
  {
    accessorKey: "date",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("date");
    },
    cell: ({ row }) => {
      const locale = useLocale();
      return (
        <div>
          {format(row.original.date, "dd/MM/yyyy", {
            locale: locale === "ar" ? ar : undefined,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "entryNumber",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("number");
    },
  },
  {
    accessorKey: "accountName",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("accountName");
    },
  },
  {
    accessorKey: "reference",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("reference");
    },
    cell: ({ row }) => {
      const locale = useLocale();
      const router = useRouter();
      const reference = row.original.reference || "-";
      
      return (
        <div
          className="font-medium text-blue-600 hover:underline cursor-pointer"
          onClick={() => router.push(`/${locale}/journal-entries/${row.original.journalEntryId}`)}
        >
          {reference}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("description");
    },
  },
  {
    id: "debit",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("debit");
    },
    cell: ({ row }) => {
      const debit = row.original.debit;
      return <div className="text-center">{debit > 0 ? debit.toLocaleString() : ""}</div>;
    },
  },
  {
    id: "credit",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("credit");
    },
    cell: ({ row }) => {
      const credit = row.original.credit;
      return <div className="text-center">{credit > 0 ? credit.toLocaleString() : ""}</div>;
    },
  },
  {
    accessorKey: "balanceAfter",
    header: () => {
      const t = useTranslations("JournalEntries");
      return t("balanceAfter");
    },
    cell: ({ row }) => {
      const balance = row.original.balanceAfter;
      return <div className="text-center font-bold">{balance.toLocaleString()}</div>;
    },
  },
];
