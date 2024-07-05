import React from "react";
import { CommandEmpty, CommandInput } from "@/components/ui/command";
const CommandItemHeader = () => {
    return (
        <div className="sticky top-0 z-[100] w-full rounded-none">
            <CommandInput
                placeholder="ابحث عن صنف"
                className="rounded-none h-fit py-1"
            />
            <div className="flex rounded-none items-center  font-bold text-base bg-[#fafafa]    ">
                <span className="basis-[60%] sm:basis-[80%] text-center border border-t-transparent border-r-transparent border-stone-300 py-1">
                    اسم الصنف
                </span>
                <span className="basis-[20%] sm:basis-[10%] text-center border border-t-transparent border-r-transparent border-stone-300 py-1">
                    السعر
                </span>
                <span className="basis-[20%] sm:basis-[10%] text-center border border-t-transparent border-r-transparent border-stone-300 py-1">
                    تعديل
                </span>
            </div>
            <CommandEmpty className="text-lg text-center font-bold p-4">
                لا يوجد صنف بهذا الاسم
            </CommandEmpty>
        </div>
    );
};

export default CommandItemHeader;
