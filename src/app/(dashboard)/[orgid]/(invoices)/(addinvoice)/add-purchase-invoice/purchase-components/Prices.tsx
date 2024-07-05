"use client";
import { ViewIcon } from "lucide-react";
import React, { useState } from "react";

interface SalesProps {}
const Prices: React.FC<SalesProps> = ({}) => {
    const [SHow, setSHow] = useState(false);
    return (
        <div
            className={`absolute  z-20 ${
                !SHow ? "-left-[300px]" : "left-0"
            }  w-[300px] border top-0 bottom-0 bg-white p-2 flex flex-col gap-2 duration-300`}
        >
            <span className="absolute -right-8   ">
                {/* <TbReportAnalytics
                    className="w-7 h-8"
                    onClick={() => setSHow(!SHow)}
                /> */}
            </span>
        </div>
    );
};

export default Prices;
