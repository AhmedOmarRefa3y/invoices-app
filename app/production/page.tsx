import { Selectv0 } from "@/components/component/select";
import { Select } from "@/components/ui/Select";
import React from "react";

const page = () => {
    return (
        <div className="w-full h-screen p-10 bg-slate-200">
            <div className="flex gap-2 w-fit">
                <div>نوع العملية الانتاجية</div>
                <select name="type">
                    <option value="1">one</option>
                    <option value="2">two</option>
                    <option value="3">three</option>
                    <option value="4">four</option>
                </select>
            </div>

            <div className="flex flex-col w-full h-full gap-4 p-4 mt-2 border border-black rounded-md">
                <div className="flex items-center gap-2 p-2 h-fit">
                    <span className="">الصنف المراد انتاجه</span>
                    <Selectv0 />
                </div>
                <span>المكونات</span>
                <div className="w-full">
                    <table className="w-full ">
                        <thead>
                            <th>المكون</th>
                            <th>الكمية المطلوبة</th>
                            <th>الكمية المتاحة</th>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default page;
