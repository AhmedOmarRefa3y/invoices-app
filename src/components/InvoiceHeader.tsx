import Image from "next/image";
import React from "react";

import logo from "@/public/logobg.png";

const InvoiceHeader = () => {
  return (
    <div className="relative items-center justify-between hidden w-full h-32 p-4 print:flex ">
      <div className="text-3xl text-center ">
        Company Name <br />
      </div>
      <div className="absolute overflow-hidden -translate-x-1/2 w-36 h-36 top-1 left-1/2">
        <Image src={logo} alt="logo" />
      </div>
      <div>
        address <br /> address
        <br /> address
        <br />
        {/* {parseInt("Company Phone").toLocaleString("en-US", {
          useGrouping: false,
        })} */}
        Company Phone 1
        <br /> Company Phone 2
      </div>
    </div>
  );
};

export default InvoiceHeader;
