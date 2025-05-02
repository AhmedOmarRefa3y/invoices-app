import { MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteRetInvoiceBtn from "@/components/returnsInvoices/DeleteRetInvoiceBtn";
import EditReturnsInvoiceBtn, {
  ReturnsInvoice,
} from "@/components/returnsInvoices/EditReturnsInvoiceBtn";
import { Customer } from "@prisma/client";
import { useTranslations } from "next-intl";

interface Retinvoice {
  id: string;
  number: number;
  customerName: string;
  date: Date;
  customer: Customer;
  amount: number;
  orgid: string;
  Invoice: ReturnsInvoice;
}
const ReturnsActions = ({ row }: { row: { original: Retinvoice } }) => {
  const t = useTranslations("salesInvoiceTable");

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
            {t("showInvoice")}
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
};

export default ReturnsActions;
