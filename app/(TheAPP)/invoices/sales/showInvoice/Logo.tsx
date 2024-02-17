import React from "react";

const Logo = () => {
    return (
        <div className="h-32 w-full  flex items-center justify-between p-4">
            <div className="text-4xl text-center">
                شركة مصانع رمضان <br />
                للصناعات المعدنية
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
