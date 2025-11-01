"use client";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const PrintWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // <-- Correct property name
  });
  return (
    <div ref={componentRef} className="relative">
      <button onClick={handlePrint} className={cn("absolute left-0 top-0 print:hidden", className)}>
        {/* <BsFillPrinterFill
                    size={"40px"}
                    className=" cursor-pointer hover:text-orange-500 duration-300"
                /> */}
      </button>
      {children}
    </div>
  );
};

export default PrintWrapper;
