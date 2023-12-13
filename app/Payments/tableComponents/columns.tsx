"use client";

import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

interface Payment {
    number: number;
    customerName: string;
    date: Date;
    amount: number;
    method: string;
    type: string;
    notes: string;
}
export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "number",
        id: "الرقم",
        header: () => <div className="text-center">رقم الفاتورة</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.number}
                </div>
            );
        },
    },
    {
        accessorKey: "customerName",
        id: "اسم العميل",
        header: () => <div className="text-center">اسم العميل</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.customerName}
                </div>
            );
        },
    },
    {
        accessorKey: "date",
        id: "التاريخ",

        header: () => <div className="text-center">التاريخ</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center font-medium">
                    {row.original.date.toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
            );
        },
    },

    {
        accessorKey: "amount",
        id: "القيمة",

        header: () => <div className="text-center">القيمة</div>,
        cell: ({ row }) => {
            return (
                <div className=" text-center">
                    {row.original.amount.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "method",
        id: "طريقة السداد",
        header: () => <div className="text-center">طريقة السداد</div>,
        cell: ({ row }) => {
            return <div className=" text-center">{row.original.method}</div>;
        },
    },
    {
        accessorKey: "type",
        id: "النوع",
        header: () => <div className="text-center">النوع</div>,
        cell: ({ row }) => {
            return <div className=" text-center">{row.original.type}</div>;
        },
    },
    {
        accessorKey: "notes",
        id: "ملاحظات",
        header: () => <div className="text-center">ملاحظات</div>,
        cell: ({ row }) => {
            return <div className=" text-center">{row.original.notes}</div>;
        },
    },
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent className="flex flex-col">
    //                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                         <Link
    //                             href={`/invoices/showInvoice?num=${row.original.number}`}
    //                             className="flex-1"
    //                             contentEditable
    //                         >
    //                             عرض الفاتورة
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
    //                         <Link
    //                             className="flex-1"
    //                             contentEditable
    //                             href={`/invoices/releaseorder?num=${row.original.number}`}
    //                         >
    //                             اذن الصرف
    //                         </Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onSelect={(e) => e.preventDefault()}
    //                         className="flex-1"
    //                         contentEditable
    //                     >
    //                         <EditInvoiceBtn Invoice={row.original} />
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem
    //                         onSelect={(e) => e.preventDefault()}
    //                         className="flex-1"
    //                     >
    //                         <DeleteInvoiceBtn id={row.original.id} />
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
