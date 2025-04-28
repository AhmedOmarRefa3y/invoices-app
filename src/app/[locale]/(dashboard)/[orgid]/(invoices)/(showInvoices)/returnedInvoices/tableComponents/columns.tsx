"use client";

import DeleteRetInvoiceBtn from "@/components/returnsInvoices/DeleteRetInvoiceBtn";
import EditReturnsInvoiceBtn, {
  ReturnsInvoice,
} from "@/components/returnsInvoices/EditReturnsInvoiceBtn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";
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
    header: () => <div className="text-center">Number</div>,
    cell: ({ row }) => row.original.number,
  },
  {
    accessorKey: "customerName",
    id: "Customer Name",
    header: () => <div className="text-center">Customer Name</div>,
    cell: ({ row }) => row.original.customerName,
  },
  {
    accessorKey: "date",
    id: "Date",

    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => row.original.date.toDateString(),
  },

  {
    accessorKey: "amount",
    id: "Amount",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      return <div className=" text-center">{row.original.amount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col">
            <DropdownMenuItem>
              <Link
                href={`/${row.original.orgid}/returnedInvoices/showREtInvoice/${row.original.number}`}
                className="flex-1 bg-slate-300 text-center rounded-md p-2"
              >
                Show Invoice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-1">
              <EditReturnsInvoiceBtn Invoice={row.original.Invoice} orgid={row.original.orgid} />
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-1" onSelect={(e) => e.preventDefault()}>
              <DeleteRetInvoiceBtn id={row.original.id} url="returnedInvoice" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
