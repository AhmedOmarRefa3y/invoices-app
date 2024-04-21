"use client";
import { useIsClient } from "@uidotdev/usehooks";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicActions = dynamic(() => import("./actions"), {
    ssr: false,
});

const NewHomePAge = () => {
    const isOpen = useInvoice((state) => state.addOrgMOdalIsOpen);
    const setAddOrgModalIsOpen = useInvoice(
        (state) => state.setAddOrgModalIsOpen
    );
    const isClient = useIsClient();
    useEffect(() => {
        if (isOpen) {
            setAddOrgModalIsOpen(false);
        }
    }, [isOpen, setAddOrgModalIsOpen]);
    if (!isClient) {
        return null;
    }

    return (
        <div className="flex mx-auto items-center justify-center h-full ">
            <DynamicActions />
        </div>
    );
};

export default NewHomePAge;
