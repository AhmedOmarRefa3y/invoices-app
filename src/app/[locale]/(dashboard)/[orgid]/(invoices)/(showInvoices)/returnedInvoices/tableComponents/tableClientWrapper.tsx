"use client";

import { TableUi } from "@/components/table";
import { Retinvoice, columns } from "./columns";

export default function TableClientWrapper({
  invoices,
  filterLabel,
  filterPlaceholder,
  notfound,
}: {
  invoices: Retinvoice[];
  filterLabel: string;
  filterPlaceholder: string;
  notfound: string;
}) {
  return (
    <TableUi
      columns={columns}
      data={invoices}
      filterAccessorKey="customerName"
      filterlabel={filterLabel}
      filterplaceholder={filterPlaceholder}
      notfound={notfound}
    />
  );
}
