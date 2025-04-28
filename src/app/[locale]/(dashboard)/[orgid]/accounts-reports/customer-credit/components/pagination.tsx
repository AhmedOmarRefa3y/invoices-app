"use client";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React from "react";

interface PaginationProps {
  limit: number;
  SetPage?: (page: number) => void;
  page?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({ limit, SetPage, page, itemsPerPage }) => {
  const itemsLimit = Math.ceil(limit / itemsPerPage!);

  return (
    <div className="flex  gap-2  w-fit items-end justify-center z-50 mt-1">
      <div>
        <span className=" px-1 font-bold text-lg">
          <span className="px-1">
            {page!.toLocaleString("ar-EG", {
              useGrouping: false,
            })}
          </span>{" "}
          /{" "}
          <span className="px-1">
            {itemsLimit.toLocaleString("ar-EG", {
              useGrouping: false,
            })}
          </span>
        </span>
      </div>
      <div className="w-full flex justify-center  print:hidden">
        <ArrowBigRight
          onClick={() => {
            if (page! + 1 <= itemsLimit) {
              SetPage!(page! + 1);
            }
          }}
          size={"30px"}
          className={`${page! + 1 <= itemsLimit ? "hover:text-orange-500" : ""}   duration-300`}
        />
        <ArrowBigLeft
          onClick={() => {
            if (page! - 1 > 0) {
              SetPage!(page! - 1);
            }
          }}
          size={"30px"}
          className={`${page! - 1 > 0 ? "hover:text-orange-500" : ""}   duration-300`}
        />
      </div>
    </div>
  );
};

export default Pagination;
