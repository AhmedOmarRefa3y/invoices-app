"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
    limit: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit }) => {
    const SearchParams = useSearchParams();

    const params = new URLSearchParams(SearchParams);
    const page = parseInt(params.get("page") || "1");
    console.log(limit);
    const router = useRouter();

    const itemsLimit = Math.ceil(limit / 15);
    // router.push(`/accountstatement/customerbalance?${params.toString()}`);

    useEffect(() => {
        params.set("page", itemsLimit.toString());
        router.push(`/accountstatement/customerbalance?${params.toString()}`);
    }, []);
    console.log(itemsLimit);

    return (
        <div className="flex mr-auto justify-end absolute top-2 left-10 z-50">
            <button
                onClick={() => {
                    if (page + 1 <= itemsLimit) {
                        console.log("go");
                        params.set("page", (page + 1).toString());
                        router.push(
                            `/accountstatement/customerbalance?${params.toString()}`
                        );
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
                        console.log("go");
                        params.set("page", (page - 1).toString());
                        router.push(
                            `/accountstatement/customerbalance?${params.toString()}`
                        );
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
