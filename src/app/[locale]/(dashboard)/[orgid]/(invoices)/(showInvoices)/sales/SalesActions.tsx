"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DeleteInvoiceBtn from "@/components/ui/deleteInvoiceBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditInvoiceBtn from "@/components/ui/editInvoiceBtn";
import { Link } from "@/i18n/routing";
import { Prisma } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";

type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    Product: true;
  };
}>;
type Customer = Prisma.CustomerGetPayload<{
  include: {
    Payment: true;
  };
}>;

interface invoiceTableT {
  id: string;
  number: number;
  customerName: string;
  // Items: OrderItem[];
  date: Date;
  PaidAmount: number;
  CreatedAt: Date;
  // customer: Customer;
  amount: number;
  orgid: string;
}

const SalesActions = ({ row }: { row: { original: invoiceTableT } }) => {
  const t = useTranslations("salesInvoiceTable");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-1">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link
            href={`/${row.original.orgid}/sales/showInvoice/${row.original.number}`}
            className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
          >
            {t("showInvoice")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link
            className="flex-1 text-center bg-black h-10 px-4 py-2 rounded text-white hover:bg-black/90"
            href={`/${row.original.orgid}/sales/releaseorder?num=${row.original.number}`}
          >
            {t("releaseOrder")}
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1">
          <EditInvoiceBtn Invoice={row.original} orgid={row.original.orgid} />
        </DropdownMenuItem> */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex-1">
          <DeleteInvoiceBtn id={row.original.id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SalesActions;
