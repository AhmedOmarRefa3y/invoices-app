import React from "react";
import { CommandEmpty, CommandInput } from "@/components/ui/command";
const CommandItemHeader = () => {
    return (
        <div className="sticky top-0 z-20 w-full">
            <CommandInput placeholder="" />
            <div className="flex l p-2 rounded-sm items-center gap-2 font-bold text-lg bg-orange-300 aria-selected:bg-orange-300 mb-2  ">
                <span className="w-[80%]">اسم الصنف</span>
                <span className="w-[10%] text-center">السعر</span>
                <span className="w-[10%] text-center">تعديل</span>
            </div>
            <CommandEmpty className="text-lg text-center font-bold p-4">
                لا يوجد صنف بهذا الاسم
            </CommandEmpty>
        </div>
    );
};

export default CommandItemHeader;
