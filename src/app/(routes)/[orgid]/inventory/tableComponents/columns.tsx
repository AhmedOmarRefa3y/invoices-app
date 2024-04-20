"use client";

import { Part } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { FaCaretUp } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa6";

export type inventoryT = {
    productName: string;
    id: string;
    initalQuantity: number;
    soldQuantity: number;
    returnedQuantity: number;
    producedQuantity: number;
    outProduction: number;
    availableQuantity: number;
    isAcomposistion?: boolean;
    parts?: Part[];
    unit: string;
    orgid: string;
};

export const InventoryColumns: ColumnDef<inventoryT>[] = [
    {
        accessorKey: "productName",
        header: ({ header }) => {
            return <div className="">اسم الصنف</div>;
        },
        size: 700,
        cell: ({ row }) => {
            return (
                <Link
                    href={`/${row.original.orgid}/inventory/product-records/${row.original.id}`}
                >
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
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            اول المدة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
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
        accessorKey: "producedQuantity",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            الكمية المنتجة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.producedQuantity.toLocaleString("ar-EG", {
                        useGrouping: false,
                    })}
                </div>
            );
        },
    },
    {
        accessorKey: "outProduction",
        header: ({ column }) => {
            return (
                <div>
                    <div className="flex px-2 items-center justify-center gap-1 select-none cursor-pointer  w-full">
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            المنصرف للانتاج
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            );
        },
        size: 50,

        cell: ({ row }) => {
            return (
                <div>
                    {row.original.outProduction.toLocaleString("ar-EG", {
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
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            الكمية المرتجعة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
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
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            الكمية المباعة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
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
                        <div
                            onClick={() => {
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                );
                            }}
                        >
                            الكمية المتاحة
                        </div>
                        <div className="flex flex-col items-center relative">
                            <FaCaretUp
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "asc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "asc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(false);
                                    }
                                }}
                            />
                            <FaCaretDown
                                className={` text-xl  sm:hover:text-red-500 ${
                                    column.getIsSorted() === "desc"
                                        ? "text-red-500"
                                        : "text-slate-500"
                                } `}
                                onClick={() => {
                                    if (column.getIsSorted() === "desc") {
                                        column.clearSorting();
                                    } else {
                                        column.toggleSorting(true);
                                    }
                                }}
                            />
                        </div>
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
