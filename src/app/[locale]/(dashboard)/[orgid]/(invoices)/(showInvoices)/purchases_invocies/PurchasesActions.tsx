import DeletePurchInvoiceBtn from "@/components/Purchases/DeletePurchInvoiceBtn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "@/i18n/routing";
import EditPurchInvoiceBtn, { PurchInvoice } from "@/components/Purchases/EditInvoice";
import { Customer } from "@prisma/client";
interface PurchasesCloumnsT {
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
const PurchasesActions = ({ row }: { row: { original: PurchasesCloumnsT } }) => {
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
};

export default PurchasesActions;
