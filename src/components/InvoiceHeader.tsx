import Image from "next/image";
import React from "react";

import logo from "../../public/logo.png";

const InvoiceHeader = () => {
    return (
        <div className="relative items-center justify-between hidden w-full h-32 p-4 print:flex ">
            <div className="text-3xl text-center ">
                شركة مصانع رمضان <br />
                للصناعات المعدنية
            </div>
            <div className="absolute overflow-hidden -translate-x-1/2 w-36 h-36 top-1 left-1/2">
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
};

export default InvoiceHeader;
