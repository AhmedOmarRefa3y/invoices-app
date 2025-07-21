"use client";

import SortableHeader from "@/components/sortableHeader";

import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import SalesActions from "./SalesActions";

type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    Product: true;
  };
}>;
// type customer = Prisma.CustomerGetPayload<{
//   include: {
//     Payment: true;
//   };
// }>;

export interface invoiceTableT {
  id: string;
  number: number;
  customerName: string;
  date: Date;
  PaidAmount: number;
  CreatedAt: Date;
  amount: number;
  orgid: string;
  // Items: OrderItem[];
  // customer: customer;
}

export const columns: ColumnDef<invoiceTableT>[] = [
  {
    accessorKey: "number",
    id: "number",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="number" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.number;
    },
  },
  {
    accessorKey: "customerName",
    size: 300,
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="customer" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.customerName;
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
            <SortableHeader column={column} label="date" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.date.toDateString();
    },
  },

  {
    accessorKey: "Items",
    id: "Total",
    size: 100,
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="total" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.amount;
    },
  },
  {
    accessorKey: "PaidAmount",
    id: "Paid",
    size: 100,
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="paid" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.PaidAmount ? row.original.PaidAmount : "";
    },
  },
  {
    accessorKey: "createdAt",
    size: 200,
    id: "createdAt",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="createdAt" componentName={"salesInvoiceTable"} />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.CreatedAt.toDateString();
    },
  },
  // {
  //   id: "actions",
  //   size: 50,
  //   cell: ({ row }) => {
  //     return <SalesActions row={row} />;
  //   },
  // },
];
