"use client";

import { Part } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import SortableHeader from "@/components/sortableHeader";
import { Link } from "@/i18n/routing";

export type inventoryT = {
  productName: string;
  id: string;
  initalQuantity: number;
  soldQuantity: number;
  returnedQuantity: number;
  purchasedQuantity: number;
  // producedQuantity: number;
  // outProduction: number;
  availableQuantity: number;
  isAcomposistion?: boolean;
  parts?: Part[];
  unit: string;
  orgid: string;
};

export const InventoryColumns: ColumnDef<inventoryT>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="product_name" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 700,
    cell: ({ row }) => {
      return (
        <Link href={`/${row.original.orgid}/inventory/product-records/${row.original.id}`}>
          {row.original.productName}
        </Link>
      );
    },
  },
  {
    accessorKey: "initalQuantity",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="open_stock" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 50,
    cell: ({ row }) => {
      return row.original.initalQuantity.toLocaleString("ar-EG", {
        useGrouping: false,
      });
    },
  },
  {
    accessorKey: "purchasedQuantity",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="purchasedQuantity" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 50,

    cell: ({ row }) => {
      return (
        <div>
          {row.original.purchasedQuantity.toLocaleString("ar-EG", {
            useGrouping: false,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "returnedQuantity",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="returnedQuantity" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 50,

    cell: ({ row }) => {
      return (
        <div>
          {row.original.returnedQuantity.toLocaleString("ar-EG", {
            useGrouping: false,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "soldQuantity",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="soldQuantity" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 50,

    cell: ({ row }) => {
      return (
        <div>
          {row.original.soldQuantity.toLocaleString("ar-EG", {
            useGrouping: false,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "availableQuantity",
    header: ({ column }) => {
      return (
        <div>
          <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
            <SortableHeader column={column} label="availableQuantity" componentName="Inventory" />
          </div>
        </div>
      );
    },
    size: 50,

    cell: ({ row }) => {
      return (
        <div>
          {row.original.availableQuantity.toLocaleString("ar-EG", {
            useGrouping: false,
          })}
        </div>
      );
    },
  },
];
