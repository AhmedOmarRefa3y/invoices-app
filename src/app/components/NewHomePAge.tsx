"use client";
import { useIsClient } from "@uidotdev/usehooks";
import Actions from "./actions";
import useInvoice from "@/lib/zustand";
import { useEffect } from "react";

const NewHomePAge = () => {
    const isOpen = useInvoice((state) => state.addOrgMOdalIsOpen);
    const onOpen = useInvoice((state) => state.setAddOrgModalIsOpen);
    const isClient = useIsClient();
    useEffect(() => {
        if (isOpen) {
            onOpen(false);
        }
    }, [isOpen, onOpen]);
    if (!isClient) {
        return null;
    }

    return (
        <div className="w-full  flex items-center justify-center h-screen ">
            <Actions />
        </div>
    );
};

export default NewHomePAge;
