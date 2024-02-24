"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
    limit: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit }) => {
    const SearchParams = useSearchParams();
    const pathName = usePathname();
    console.log(limit);

    const params = useMemo(() => {
        return new URLSearchParams(SearchParams);
    }, [SearchParams]);
    const page = parseInt(params.get("page") || "1");
    const router = useRouter();
    const itemsLimit = Math.ceil(limit / 15);
    console.log(itemsLimit);

    return (
        <div className="flex left-0 top-5 absolute gap-2  w-fit z-50 mt-1">
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    params.set("page", itemsLimit.toString());
                    router.push(`${pathName}?${params.toString()}`);

                    console.log(params.toString());
                    console.log(itemsLimit.toString());
                }}
                className={`print:hidden  w-fit block font-bold ${
                    page === itemsLimit && " hidden"
                } `}
            >
                {/* <GrPrevious
                    size={"30px"}
                    className={`${
                        page - 1 > 0 ? "hover:text-orange-500" : ""
                    }   duration-300`}
                /> */}
                الاخيرة
            </Button>
            <Button
                variant="default"
                size="sm"
                onClick={() => {
                    if (page + 1 <= itemsLimit) {
                        params.set("page", (page + 1).toString());
                        router.push(`${pathName}?${params.toString()}`);
                    }
                }}
                className={`print:hidden bg-white font-bold text-black  w-fit block ${
                    !(page + 1 <= itemsLimit) && " hidden"
                } `}
            >
                {/* <GrNext
                    size={"30px"}
                    className={`${
                        page + 1 <= itemsLimit ? "hover:text-orange-500" : ""
                    }   duration-300`}
                /> */}
                التالي
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    if (page - 1 > 0) {
                        params.set("page", (page - 1).toString());
                        router.push(`${pathName}?${params.toString()}`);
                    }
                }}
                className={`print:hidden    font-bold ${
                    !(page - 1 > 0) && "hidden"
                } `}
            >
                {/* <GrPrevious
                    size={"30px"}
                    className={`${
                        page - 1 > 0 ? "hover:text-orange-500" : ""
                    }   duration-300`}
                /> */}
                السابق
            </Button>
            <span className="text-xl font-bold bg-white my-auto p-1 rounded-full w-8 h-8 text-center">
                {page}
            </span>
        </div>
    );
};

export default Pagination;
