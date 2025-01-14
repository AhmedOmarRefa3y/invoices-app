"use client";
import { ColumnDef } from "@tanstack/react-table";

export type TransactionT = {
  type: "Debit" | "credit" | "openCredit";
  amount: number;
  date?: Date;
  number?: number;
  label: "inv" | "paymnet" | "returns" | "openCredit" | "prev" | "Purchase";
  effect?: number;
  creditAfter: number;
};

export const TransactionColumns: ColumnDef<TransactionT>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => "Date",
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
    header: ({ column }) => "Operation",
    cell: ({ row }) => {
      let label: any = row.original.label;
      switch (row.original.label) {
        case "inv":
          label = "Sales Invoice";
          break;
        case "paymnet":
          label = "Payments";
          break;
        case "openCredit":
          label = "Opening Balance";
          break;
        case "prev":
          label = "Previous";
          break;
        case "returns":
          label = "Returns Invoice";
          break;
        case "Purchase":
          label = "Purchase Invoice";
        default:
          console.log("Default case");
      }
      return <div className="">{label}</div>;
    },
    size: 300,
  },

  {
    accessorKey: "transactions",
    header: ({ header }) => {
      return <div className="">Movement</div>;
    },
    columns: [
      {
        accessorKey: "amount",
        header: ({ column }) => "Debit",
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
        header: ({ column }) => "Credit",
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
    header: ({ header }) => {
      return <div className="min-w-[200px]">Current Balance</div>;
    },
    columns: [
      {
        accessorKey: "creditAfter",
        header: ({ column }) => "Debit",
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
        header: ({ column }) => "Credit",
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
