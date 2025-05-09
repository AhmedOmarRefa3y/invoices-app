"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "../../../columns";
import { useTranslations } from "next-intl";

export type TransactionT = {
  type: "Debit" | "credit" | "openCredit";
  amount: number;
  date?: Date;
  number?: number;
  label: "inv" | "payment" | "returns" | "openCredit" | "prev" | "Purchase";
  effect?: number;
  creditAfter: number;
};

export const TransactionColumns: ColumnDef<TransactionT>[] = [
  {
    accessorKey: "date",
    header: ({}) => <Header componentName="accountStatement" label="date" />,
    cell: ({ row }) => {
      return (
        <div className="">
          {row.original.date
            ? row.original.date.toLocaleDateString("en-us", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "label",
    header: ({}) => <Header componentName="accountStatement" label="Operation" />,
    cell: ({ row }) => <OperationCell row={row} />,
    size: 300,
  },

  {
    accessorKey: "transactions",
    header: ({}) => <Header componentName="accountStatement" label="transactions" />,

    columns: [
      {
        accessorKey: "amount",
        header: ({}) => <Header componentName="accountStatement" label="Debit" />,
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.type === "Debit"
                ? row.original.amount.toLocaleString("en-us", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: ({}) => <Header componentName="accountStatement" label="Credit" />,
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.type === "credit"
                ? row.original.amount.toLocaleString("en-us", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: "creditAfter",
    header: ({}) => <Header componentName="accountStatement" label="creditAfter" />,

    columns: [
      {
        accessorKey: "creditAfter",
        header: ({}) => <Header componentName="accountStatement" label="Debit" />,
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.creditAfter > 0
                ? row.original.creditAfter.toLocaleString("en-us", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "creditAfter",
        header: ({}) => <Header componentName="accountStatement" label="Credit" />,
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.creditAfter >= 0
                ? ""
                : (row.original.creditAfter * -1).toLocaleString("en-us", {
                    useGrouping: false,
                  })}
            </div>
          );
        },
      },
    ],
  },
];

const OperationCell = ({ row }: { row: any }) => {
  const t = useTranslations("accountStatement");

  let label;
  switch (row.original.label) {
    case "inv":
      label = t("salesInvoice");
      break;
    case "payment":
      label = t("payments");
      break;
    case "openCredit":
      label = t("openingBalance");
      break;
    case "prev":
      label = t("previous");
      break;
    case "returns":
      label = t("returnsInvoice");
      break;
    case "Purchase":
      label = t("purchaseInvoice");
      break;
    default:
      label = "Unknown";
  }

  return <div className="">{label}</div>;
};
