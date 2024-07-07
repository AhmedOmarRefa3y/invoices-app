"use client";

import useInvoice from "@/lib/zustand/invoiceStore";
import useModals from "@/lib/zustand/useModals";

const Backdrop = () => {
    const ModalsStore = useModals();
    const { isSidebarOpen, toggleSideBar } = ModalsStore;
    const closeSideBar = () => {
        if (isSidebarOpen) {
            toggleSideBar();
        }
    };
    return (
        <div
            className={`min-w-full min-h-screen absolute backdrop-blur-3xl 
                     opacity-70  duration-400 ${
                         !isSidebarOpen ? "-z-10" : "z-[51]"
                     }`}
            onClick={closeSideBar}
        />
    );
};

export default Backdrop;
