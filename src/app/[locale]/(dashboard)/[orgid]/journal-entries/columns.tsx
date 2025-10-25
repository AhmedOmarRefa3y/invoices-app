"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export type JournalEntryColumnData = {
  id: string;
  reference: string;
  journalName: string;
  date: Date;
  description: string;
  state: "draft" | "posted" | "cancel";
  type: "Debit" | "Credit";
  AccountName: string;
  amount: number;
};

const THeader = ({ k }: { k: string }) => {
  const t = useTranslations("JournalEntries");
  return t(k);
};

export const columns: ColumnDef<JournalEntryColumnData>[] = [
  {
    accessorKey: "journalName",
    header: () => <THeader k="journal" />,
  },
  {
    accessorKey: "date",
    header: () => <THeader k="date" />,
    cell: ({ row }) => <DateCell date={row.getValue("date")} />,
  },
  {
    accessorKey: "AccountName",
    header: () => <THeader k="accountName" />,
    cell: ({ row }) => {
      const { type, AccountName } = row.original;
      return (
        <div
          className={`font-medium ${
            type === "Debit" ? "text-green-700 text-right" : "text-red-700 text-left"
          }`}
        >
          {AccountName}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <THeader k="description" />,
  },
  {
    id: "debit",
    header: () => <THeader k="debit" />,
    cell: ({ row }) => {
      const { type, amount } = row.original;
      return <div className="text-center">{type === "Debit" ? amount.toLocaleString() : ""}</div>;
    },
  },
  {
    id: "credit",
    header: () => <THeader k="credit" />,
    cell: ({ row }) => {
      const { type, amount } = row.original;
      return <div className="text-center">{type === "Credit" ? amount.toLocaleString() : ""}</div>;
    },
  },
  {
    accessorKey: "state",
    header: () => <THeader k="state" />,
    cell: ({ row }) => <StateCell state={row.getValue("state")} />,
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

export function StateCell({ state }: { state: JournalEntryColumnData["state"] }) {
  const t = useTranslations("JournalEntries");

  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (state) {
    case "posted":
      variant = "secondary";
      break;
    case "cancel":
      variant = "destructive";
      break;
  }

  return <Badge variant={variant}>{t(state)}</Badge>;
}
