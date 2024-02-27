"use client";

import useInvoice from "@/lib/zustand";

const Backdrop = () => {
    const invoice = useInvoice();
    const { isSidebarOpen, toggleSideBar } = invoice;
    const closeSideBar = () => {
        if (isSidebarOpen) {
            toggleSideBar();
        }
    };
    return (
        <div
            className={`min-w-full min-h-screen absolute backdrop-blur-lg 
                     opacity-70  duration-400 ${
                        !isSidebarOpen ? "-z-10" : "z-[50]"
                    }`}
            onClick={closeSideBar}
        ></div>
    );
};

export default Backdrop;
