"use client";
import { Button } from "@/components/ui/button";
import DeleteCustomerBtn from "@/components/ui/deleteCustomerBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";

export type CustomerBalanceT = {
  customerID: string;
  customerName: string;
  CustomerCredit: number;
  CustomerTotalDebit: number;
  CustomerTotalCredit: number;
  currentBalance: number;
  PageNum: number;
  ItemsPageNum: number;
  orgid: string;
};

export const CustomerBalanceColumns: ColumnDef<CustomerBalanceT>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
            <DescSortableHeader
              column={column}
              label="customer"
              componentName="AccountStatementPage"
              negative={false}
            />
          </div>
        </div>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="">{row.original.customerName}</div>;
    },
  },
  {
    accessorKey: "CustomerCreditHeader",
    header: () => {
      return <Header label="Balance" componentName="AccountStatementPage" />;
    },
    columns: [
      {
        accessorKey: "CustomerCredit",
        id: "CustomerCreditDebit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Debit"
                  componentName="AccountStatementPage"
                />
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.CustomerCredit > 0
                ? row.original.CustomerCredit.toLocaleString("ar-EG", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "CustomerCredit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Credit"
                  componentName="AccountStatementPage"
                  negative={false}
                />
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.CustomerCredit < 0
                ? (row.original.CustomerCredit * -1).toLocaleString("ar-EG", {
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
    accessorKey: "transactions",
    header: () => {
      return <Header label="transactions" componentName="AccountStatementPage" />;
    },
    columns: [
      {
        accessorKey: "CustomerTotalDebit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Debit"
                  componentName="AccountStatementPage"
                />{" "}
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.CustomerTotalDebit > 0
                ? row.original.CustomerTotalDebit.toLocaleString("ar-EG", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "CustomerTotalCredit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Credit"
                  componentName="AccountStatementPage"
                />{" "}
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.CustomerTotalCredit > 0
                ? row.original.CustomerTotalCredit.toLocaleString("ar-EG", {
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
    accessorKey: "currentBalance",
    header: ({}) => {
      return <Header label="current_balance" componentName="AccountStatementPage" />;
    },
    columns: [
      {
        accessorKey: "currentBalance",
        id: "currentBalanceDebit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Debit"
                  componentName="AccountStatementPage"
                />{" "}
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.currentBalance > 0
                ? row.original.currentBalance.toLocaleString("ar-EG", {
                    useGrouping: false,
                  })
                : ""}
            </div>
          );
        },
      },
      {
        accessorKey: "currentBalance",
        id: "currentBalanceCredit",
        header: ({ column }) => {
          return (
            <div>
              <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full ">
                <DescSortableHeader
                  column={column}
                  label="Credit"
                  componentName="AccountStatementPage"
                  negative={false}
                />{" "}
              </div>
            </div>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="">
              {row.original.currentBalance >= 0
                ? ""
                : (row.original.currentBalance * -1).toLocaleString("ar-EG", {
                    useGrouping: false,
                  })}
            </div>
          );
        },
      },
    ],
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div></div>;
    },
    cell: ({ row }) => {
      return (
        <div className="">
          {Actions({
            id: row.original.customerID,
            ItemsPageNum: row.original.ItemsPageNum,
            PageNum: row.original.PageNum,
            orgid: row.original.orgid,
          })}
        </div>
      );
    },
  },
];

const Actions = ({
  id,

  orgid,
}: {
  id: string;
  PageNum: number;
  ItemsPageNum: number;
  orgid: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const t = useTranslations("AccountStatementPage");

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen} modal={false} dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 ">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        <DropdownMenuItem>
          <Link
            href={`/${orgid}/accounts-reports/account-statement/${id}`}
            className="bg-orange-400 hover:bg-orange-400/80 p-2 rounded-md basis-[100%] text-center"
          >
            {t("account_statement")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link
            href={`/${orgid}/accounts-reports/account-statement-items/${id}`}
            className="bg-blue-400 hover:bg-blue-400/80 p-2 rounded-md basis-[100%] text-center"
          >
            {t("account_statement_with_items")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DeleteCustomerBtn id={id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header = ({ label, componentName }: { label: string; componentName: string }) => {
  const t = useTranslations(componentName);
  return <div className="">{t(label)}</div>;
};

interface Props2 {
  column: Column<CustomerBalanceT, any>;
  label: string;
  negative?: boolean;
  // for transaltions
  componentName: string;
}

const DescSortableHeader: React.FC<Props2> = ({
  column,
  label,
  componentName,
  negative = true,
}) => {
  const t = useTranslations(componentName);
  const targetOrder = negative ? "desc" : "asc"; // desired sort direction

  const handleClick = () => {
    const currentSort = column.getIsSorted();
    if (currentSort === targetOrder) {
      column.clearSorting();
    } else {
      // Force sort to target direction
      column.toggleSorting(negative); // because toggleSorting(true) = desc, false = asc
    }
  };

  return (
    <div className="flex items-center w-full gap-1 text-black">
      <div onClick={handleClick} className="flex-grow">
        {t(label)}
      </div>
      <div className="flex flex-col items-center relative">
        <ChevronDown
          className={`h-5 sm:hover:text-red-500 ${
            column.getIsSorted() === targetOrder ? "text-red-500" : "text-slate-500"
          }`}
        />
      </div>
    </div>
  );
};
