"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const MainNavTop = ({
    orgName,
    userName,
}: {
    userName: string | null | undefined;
    orgName: string;
}) => {
    return (
        <div className=" flex items-center sticky top-0 left-0 right-0 w-full  justify-end py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px]  border-b border-b-stone-300 mx-auto z-50">
            <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col text-sm items-end justify-center font-light">
                    <span>{userName}</span>
                    <span>{orgName}</span>
                </div>
                <span
                    onClick={() => signOut()}
                    className="text-slate-900 duration-300 hover:bg-[#f5f4f4] p-1 rounded-sm hover:text-emerald-500 "
                >
                    <LogOut size={25} />
                </span>
            </div>
        </div>
    );
};

export default MainNavTop;
