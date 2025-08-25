"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "../../../columns";
import { useTranslations } from "next-intl";
import Link from "next/link";
import useModals from "@/lib/zustand/useModals";

export type TransactionT = {
  type: "Debit" | "credit" | "openCredit";
  amount: number;
  date?: Date;
  number?: number;
  label: "orderItem" | "payment" | "returns" | "openCredit" | "prev" | "Purchase";
  effect?: number;
  creditAfter: number;
  // Additional fields for navigation and payment details
  orgid?: string;
  locale?: string;
  name?: string;
  paymentId?: string;
  customerId?: string;
  customerName?: string;
  paymentMethod?: string;
  paymentNote?: string | null;
  invoiceNumber?: number;
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
  const { SetViewPaymentModalIsOpen, setPaymentToBeEdited } = useModals();
  const orgid = row.original.orgid || "";
  const locale = row.original.locale || "";

  let label;
  let linkComponent = null;

  const handlePaymentClick = () => {
    if (row.original.paymentId) {
      setPaymentToBeEdited({
        id: row.original.paymentId,
        customerId: row.original.customerId || "",
        amount: row.original.amount,
        Note: row.original.paymentNote || null,
        date: row.original.date || new Date(),
        method: row.original.paymentMethod || "",
        number: row.original.number,
      });
      SetViewPaymentModalIsOpen(true);
    }
  };

  switch (row.original.label) {
    case "orderItem":
      label = row.original.name;
      if (row.original.invoiceNumber) {
        linkComponent = (
          <Link
            href={`/${locale}/${orgid}/sales/showInvoice/${row.original.invoiceNumber}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {label} #{row.original.invoiceNumber}
          </Link>
        );
      }
      break;
    case "payment":
      label = t("payments");
      if (row.original.number) {
        linkComponent = (
          <button
            onClick={handlePaymentClick}
            className="text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {label} #{row.original.number}
          </button>
        );
      } else if (row.original.paymentId) {
        linkComponent = (
          <button
            onClick={handlePaymentClick}
            className="text-blue-600 hover:text-blue-800 hover:underline text-left"
          >
            {label}
          </button>
        );
      }
      break;
    case "openCredit":
      label = t("openingBalance");
      break;
    case "prev":
      label = t("previous");
      break;
    case "returns":
      label = t("returnsInvoice");
      if (row.original.number) {
        linkComponent = (
          <Link
            href={`/${locale}/${orgid}/returnedInvoices/showREtInvoice/${row.original.number}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {label} #{row.original.number}
          </Link>
        );
      }
      break;
    case "Purchase":
      label = t("purchaseInvoice");
      break;
    default:
      label = "Unknown";
  }

  return <div className="">{linkComponent || label}</div>;
};
