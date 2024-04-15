"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
    limit: number;
    SetPage: (page: number) => void;
    page: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit, SetPage, page }) => {
    const SearchParams = useSearchParams();
    const pathName = usePathname();
    // console.log(limit);

    const params = useMemo(() => {
        return new URLSearchParams(SearchParams);
    }, [SearchParams]);
    // const page = parseInt(params.get("page") || "1");
    const router = useRouter();
    const itemsLimit = Math.ceil(limit / 15);
    // console.log(itemsLimit);

    return (
        <div className="flex left-2 top-5 absolute gap-2  w-fit z-50 mt-1 print:hidden">
            <Button
                size="sm"
                onClick={() => {
                    SetPage(itemsLimit);
                }}
                className={`print:hidden bg-sky-500 text-black hover:bg-sky-400    w-fit block font-bold ${
                    page === itemsLimit && " hidden"
                } `}
            >
                الاخيرة
            </Button>
            <Button
                size="sm"
                onClick={() => {
                    if (page + 1 <= itemsLimit) {
                        // params.set("page", (page + 1).toString());
                        // router.push(`${pathName}?${params.toString()}`);
                        SetPage(page + 1);
                    }
                }}
                className={`print:hidden bg-sky-500 text-black hover:bg-sky-400 font-bold  w-fit block ${
                    !(page + 1 <= itemsLimit) && " hidden"
                } `}
            >
                التالي
            </Button>

            <Button
                size="sm"
                onClick={() => {
                    if (page - 1 > 0) {
                        // params.set("page", (page - 1).toString());
                        // router.push(`${pathName}?${params.toString()}`);
                        SetPage(page - 1);
                    }
                }}
                className={`print:hidden    bg-sky-500 hover:bg-sky-400 font-bold text-black ${
                    !(page - 1 > 0) && "hidden"
                } `}
            >
                السابق
            </Button>
            <span className="text-xl font-bold bg-sky-500 text-black my-auto p-1 rounded-md w-8 h-8 text-center">
                {page}
            </span>
        </div>
    );
};

export default Pagination;
