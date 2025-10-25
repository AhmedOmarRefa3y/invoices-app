"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useRouter } from "@/i18n/routing";

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
  reference: string | null;
  balanceAfter: number;
  entryNumber: number;
};

const THeader = ({ k }: { k: string }) => {
  const t = useTranslations("JournalEntries");
  return t(k);
};

export const JournalTransactionscolumns: ColumnDef<JournalTransactionsColumnDataT>[] = [
  {
    accessorKey: "date",
    header: () => <THeader k="date" />,
    cell: ({ row }) => <DateCell date={row.original.date} />,
  },
  {
    accessorKey: "entryNumber",
    header: () => <THeader k="number" />,
  },
  {
    accessorKey: "reference",
    header: () => <THeader k="reference" />,
    cell: ({ row }) => (
      <ReferenceCell
        journalEntryId={row.original.journalEntryId}
        reference={row.original.reference}
      />
    ),
  },
  {
    accessorKey: "description",
    header: () => <THeader k="description" />,
  },
  {
    accessorKey: "entires",
    header: () => <THeader k="transactions" />,
    columns: [
      {
        id: "debit",
        header: () => <THeader k="debit" />,
        cell: ({ row }) => {
          const debit = row.original.debit;
          return <div className="text-center">{debit > 0 ? debit.toLocaleString() : ""}</div>;
        },
      },
      {
        id: "credit",
        header: () => <THeader k="credit" />,
        cell: ({ row }) => {
          const credit = row.original.credit;
          return <div className="text-center">{credit > 0 ? credit.toLocaleString() : ""}</div>;
        },
      },
    ],
  },
  {
    accessorKey: "balanceAfter",
    header: () => <THeader k="balanceAfter" />,
    columns: [
      {
        accessorKey: "balanceAfterDebit",
        header: () => <THeader k="debit" />,
        cell: ({ row }) => <BalanceDebitCell balance={row.original.balanceAfter} />,
      },
      {
        accessorKey: "balanceAfterCredit",
        header: () => <THeader k="credit" />,
        cell: ({ row }) => <BalanceCreditCell balance={row.original.balanceAfter} />,
      },
    ],
  },
];

export function DateCell({ date }: { date: Date }) {
  const locale = useLocale();
  return (
    <div>
      {format(date, "dd/MM/yyyy", {
        locale: locale === "ar" ? ar : undefined,
      })}
    </div>
  );
}

export function ReferenceCell({
  journalEntryId,
  reference,
}: {
  journalEntryId: string;
  reference: string | null;
}) {
  const locale = useLocale();
  const router = useRouter();
  const refText = reference || "-";

  return (
    <div
      className="font-medium text-blue-600 hover:underline cursor-pointer"
      onClick={() => router.push(`/${locale}/journal-entries/${journalEntryId}`)}
    >
      {refText}
    </div>
  );
}

export function BalanceDebitCell({ balance }: { balance: number }) {
  return <div className="text-center font-bold">{balance > 0 ? balance.toLocaleString() : ""}</div>;
}

export function BalanceCreditCell({ balance }: { balance: number }) {
  return (
    <div className="text-center font-bold">
      {balance < 0 ? Math.abs(balance).toLocaleString() : ""}
    </div>
  );
}
