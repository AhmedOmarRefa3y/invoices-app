"use client";

import DeletePurchInvoiceBtn from "@/components/Purchases/DeletePurchInvoiceBtn";
import EditPurchInvoiceBtn, { PurchInvoice } from "@/components/Purchases/EditInvoice";
import SortableHeader from "@/components/sortableHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";
export interface PurchasesCloumnsT {
  id: string;
  number: number;
  SupplierName: string;
  date: Date;
  CreatedAt: Date;
  Supplier: Customer;
  amount: number;
  orgid: string;
  invoice: PurchInvoice;
}

export const PurchasesCloumns: ColumnDef<PurchasesCloumnsT>[] = [
  {
    accessorKey: "number",
    id: "number",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Invoice Number" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.number.toLocaleString("en-US", {
        useGrouping: false,
      });
    },
  },
  {
    accessorKey: "SupplierName",
    size: 300,
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Supplier Name" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.SupplierName;
    },
  },
  {
    accessorKey: "date",
    id: "Date",
    size: 200,
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
      return row.original.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },

  {
    accessorKey: "amount",
    id: "Total Amount",
    size: 100,
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Total Amount" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.amount;
    },
  },

  {
    accessorKey: "createdAt",
    size: 200,
    id: "Created At",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="Created At" />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.CreatedAt.toDateString();
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="  h-1  ">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col">
            <DropdownMenuItem>
              <Link
                href={`/${row.original.orgid}/purchases_invocies/showInvoice?num=${row.original.number}`}
                className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
              >
                View Invoice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1 ">
              <EditPurchInvoiceBtn
                Invoice={{
                  date: row.original.invoice.date,
                  id: row.original.invoice.id,
                  items: row.original.invoice.items,
                  SupplierID: row.original.invoice.SupplierID,
                }}
                orgid={row.original.orgid}
              />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1">
              <DeletePurchInvoiceBtn id={row.original.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
