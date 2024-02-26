import Image from "next/image";
import React from "react";

import logo from "../../../../../../public/logo.png";

const Logo = () => {
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
};

export default Logo;
