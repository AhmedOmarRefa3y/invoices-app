"use client";

import { DeleteProductionORder } from "@/actions/production";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

export interface ProductionsTableT {
  id: string;
  number: number;
  date: Date;
  CreatedAt: Date;
  orgID: string;
}

export const ProductionsTableColumns: ColumnDef<ProductionsTableT>[] = [
  {
    accessorKey: "date",
    id: "Date",
    header: () => <div className="text-center">Date</div>,
    cell: ({ row }) => {
      return row.original.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "number",
    id: "number",
    header: () => <div className="text-center ">Statement</div>,
    cell: ({ row }) => {
      const { locale } = useParams();
      return (
        <Link href={`/${locale}/${row.original.orgID}/production-orders/${row.original.id}`}>
          Production Order No.
          <span className="px-2">
            {" "}
            {row.original.number.toLocaleString("en-US", {
              useGrouping: false,
            })}
          </span>
        </Link>
      );
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
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Link
                href={`/${row.original.orgID}/production-orders/${row.original.id}`}
                className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Button
                className="flex-1 text-center  h-10 px-4 py-2 rounded text-white "
                onClick={() => {
                  DeleteProductionORder(row.original.id);
                }}
                variant={"destructive"}
              >
                Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
