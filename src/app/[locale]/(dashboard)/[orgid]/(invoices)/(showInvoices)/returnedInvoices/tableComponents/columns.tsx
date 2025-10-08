"use client";

import { ReturnsInvoice } from "@/components/returnsInvoices/EditReturnsInvoiceBtn";

import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import SortableHeader from "@/components/sortableHeader";
import ReturnsActions from "./returnsActions";
export interface Retinvoice {
  id: string;
  number: number;
  customerName: string;
  date: Date;
  customer: Customer;
  amount: number;
  orgid: string;
  Invoice: ReturnsInvoice;
}

export const columns: ColumnDef<Retinvoice>[] = [
  {
    accessorKey: "number",
    id: "number",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="number" componentName="Returns" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => row.original.number,
  },
  {
    accessorKey: "customerName",
    id: "customerName",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="customerName" componentName="Returns" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => row.original.customerName,
  },
  {
    accessorKey: "date",
    id: "Date",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="date" componentName="Returns" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => row.original.date.toDateString(),
  },

  {
    accessorKey: "amount",
    id: "Amount",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="amount" componentName="Returns" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className=" text-center">{row.original.amount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ReturnsActions row={row} />;
    },
  },
];
