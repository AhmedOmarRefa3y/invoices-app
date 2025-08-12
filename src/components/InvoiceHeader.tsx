import Image from "next/image";
import React from "react";

import logo from "@/public/inv_logo.png";
import logo2 from "@/public/logobg.png";
import { APP_VERSION } from "@/lib/config";

const InvoiceHeader = () => {
  if (APP_VERSION === "A") {
    return (
      <div className="h-32 w-full  flex items-center relative justify-between p-4">
        <div className="text-3xl text-center ">
          شركة مصانع رمضان <br />
          للصناعات المعدنية
        </div>
        <div className="overflow-hidden w-36 h-36 absolute top-1 left-1/2 -translate-x-1/2">
          <Image src={logo} alt="logo" />
        </div>
        <div>
          مصر ، سوهاج <br /> حي الكوثر
          <br /> المنطقة الصناعية الثانية
          <br /> ت/ ٠
          {parseInt("01005705620").toLocaleString("ar-EG", {
            useGrouping: false,
          })}
          <br /> ت/ ٠
          {parseInt("01001752862").toLocaleString("ar-EG", {
            useGrouping: false,
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative items-center justify-between hidden w-full h-32 p-4 print:flex ">
        <div className="text-3xl text-center ">
          Company Name <br />
        </div>
        <div className="absolute overflow-hidden -translate-x-1/2 w-36 h-36 top-1 left-1/2">
          <Image src={logo2} alt="logo" />
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
  }
};

export default InvoiceHeader;
