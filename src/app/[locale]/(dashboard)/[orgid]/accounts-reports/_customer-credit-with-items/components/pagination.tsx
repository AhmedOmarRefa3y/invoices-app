"use client";
import { useRouter } from "@/i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";

interface PaginationProps {
  limit: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit }) => {
  const SearchParams = useSearchParams();

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
            router.push(`/accountstatement/customerbalance?${params.toString()}`);
          }
        }}
        className={`print:hidden  w-fit block ${!(page + 1 <= itemsLimit) && "cursor-default"} `}
      ></button>
      <span className="text-xl font-bold">{page}</span>
      <button
        onClick={() => {
          if (page - 1 > 0) {
            params.set("page", (page - 1).toString());
            router.push(`/accountstatement/customerbalance?${params.toString()}`);
          }
        }}
        className={`print:hidden  w-fit block ${!(page - 1 > 0) && "cursor-default"} `}
      ></button>
    </div>
  );
};

export default Pagination;
