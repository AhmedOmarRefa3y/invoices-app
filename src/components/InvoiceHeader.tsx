import Image from "next/image";
import React from "react";

import logo from "@/public/logobg.png";

const InvoiceHeader = () => {
    return (
        <div className="relative items-center justify-between hidden w-full h-32 p-4 print:flex ">
            <div className="text-3xl text-center ">
                Ramadan Factories Company <br />
                For Metal Industries
            </div>
            <div className="absolute overflow-hidden -translate-x-1/2 w-36 h-36 top-1 left-1/2">
                <Image src={logo} alt="logo" />
            </div>
            <div>
                Egypt, Sohag <br /> Al-Kawthar District
                <br /> Second Industrial Zone
                <br /> t/ 0
                {parseInt("01005705620").toLocaleString("en-US", {
                    useGrouping: false,
                })}
                <br /> t/ 0
                {parseInt("01001752862").toLocaleString("en-US", {
                    useGrouping: false,
                })}
            </div>
        </div>
    );
};

export default InvoiceHeader;
