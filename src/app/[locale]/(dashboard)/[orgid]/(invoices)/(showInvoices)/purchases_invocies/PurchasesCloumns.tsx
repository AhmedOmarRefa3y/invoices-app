"use client";

import { PurchInvoice } from "@/components/Purchases/EditInvoice";
import SortableHeader from "@/components/sortableHeader";

import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import PurchasesActions from "./PurchasesActions";

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
            <SortableHeader column={column} label="number" componentName="PurchasesCloumns" />
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
            <SortableHeader column={column} label="supplierName" componentName="PurchasesCloumns" />
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
            <SortableHeader column={column} label="date" componentName="PurchasesCloumns" />
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
            <SortableHeader column={column} label="total" componentName="PurchasesCloumns" />
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
            <SortableHeader column={column} label="createdAt" componentName="PurchasesCloumns" />
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
      return <PurchasesActions row={row} />;
    },
  },
];
