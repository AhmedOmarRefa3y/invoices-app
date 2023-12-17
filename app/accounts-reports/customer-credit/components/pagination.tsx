"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
    limit: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit }) => {
    const SearchParams = useSearchParams();
    const pathName = usePathname();

    const params = useMemo(() => {
        return new URLSearchParams(SearchParams);
    }, [SearchParams]);
    const page = parseInt(params.get("page") || "1");
    const router = useRouter();
    const itemsLimit = Math.ceil(limit / 15);

    return (
        <div className="flex mr-auto justify-end absolute top-2 left-10 z-50">
            <button
                onClick={() => {
                    if (page + 1 <= itemsLimit) {
                        params.set("page", (page + 1).toString());
                        router.push(`${pathName}?${params.toString()}`);
                    }
                }}
                className={`print:hidden  w-fit block ${
                    !(page + 1 <= itemsLimit) && "cursor-default"
                } `}
            >
                <GrNext
                    size={"30px"}
                    className={`${
                        page + 1 <= itemsLimit ? "hover:text-orange-500" : ""
                    }   duration-300`}
                />
            </button>
            <span className="text-xl font-bold">{page}</span>
            <button
                onClick={() => {
                    if (page - 1 > 0) {
                        params.set("page", (page - 1).toString());
                        router.push(`${pathName}?${params.toString()}`);
                    }
                }}
                className={`print:hidden  w-fit block ${
                    !(page - 1 > 0) && "cursor-default"
                } `}
            >
                <GrPrevious
                    size={"30px"}
                    className={`${
                        page - 1 > 0 ? "hover:text-orange-500" : ""
                    }   duration-300`}
                />
            </button>
        </div>
    );
};

export default Pagination;
