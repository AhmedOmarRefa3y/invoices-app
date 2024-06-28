import { Column, SortDirection } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
interface Props {
    column: any;
    label: string;
}
const SortableHeader: React.FC<Props> = ({ column, label }) => {
    return (
        <div className="flex items-center w-full gap-1 text-black">
            <div
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="flex-grow"
            >
                {label}
            </div>
            <div className="flex flex-col items-center relative">
                <ChevronUp
                    className={`  h-5 sm:hover:text-red-500 ${
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
                <ChevronDown
                    className={` h-5 sm:hover:text-red-500 ${
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
    );
};

export default SortableHeader;
