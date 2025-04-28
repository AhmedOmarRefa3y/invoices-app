"use client";

import SortableHeader from "@/components/sortableHeader";
import DeletePaymentBtn from "@/components/ui/DeletePaymentBtn";
import EditIPayemntBtn from "@/components/ui/EditIPayemntBtn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

interface PaymentT {
  customerID: string;
  id: string;
  number: number;
  customerName: string;
  date: Date;
  amount: number;
  method: string;
  notes: string;
}

export const columns: ColumnDef<PaymentT>[] = [
  {
    accessorKey: "number",
    id: "Notice Number",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Notice Number" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center ">{row.original.number}</div>;
    },
  },
  {
    accessorKey: "date",
    id: "Date",

    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Date" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center ">
          {row.original.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Customer Name" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center ">{row.original.customerName}</div>;
    },
  },

  {
    accessorKey: "amount",
    accessorFn: (row) => row.amount,
    id: "Amount",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Amount" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className=" text-center">
          {row.original.amount.toLocaleString("en-US", {
            useGrouping: false,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "method",
    accessorFn: (row) => row.method,

    id: "Payment Method",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Payment Method" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className=" text-center">{row.original.method}</div>;
    },
  },
  {
    accessorKey: "notes",
    accessorFn: (row) => row.notes,

    id: "Notes",
    header: () => <div className="text-center">Notes</div>,
    cell: ({ row }) => {
      return <div className=" text-center">{row.original.notes}</div>;
    },
  },
  {
    id: "actions",
    accessorFn: (row) => row,
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center justify-center">
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1">
              <DeletePaymentBtn id={`${row.original.id}`} />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1">
              <EditIPayemntBtn paymentInfo={row.original} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
