"use client";
import React from "react";
import { Checkbox } from "./checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface InvoicesCheckBoxProps {
  filtername: string;
  label: string;
}

const FilterCheckBox: React.FC<InvoicesCheckBoxProps> = ({ filtername, label }) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams();

  const filterValue = params.get(filtername) === "true" ? true : false;

  return (
    <div className="items-top flex space-x-2 z-50 justify-start gap-3 w-[110px]">
      <Checkbox
        id="terms1"
        defaultChecked={filterValue}
        onCheckedChange={(e) => {
          params.set(filtername, e ? "true" : "false");
          router.push(`${pathName}?${params.toString()}`);
          // console.log(e, params);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default FilterCheckBox;
