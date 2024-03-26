"use client";
import { useIsClient } from "@uidotdev/usehooks";
import Actions from "./actions";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useEffect } from "react";

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
        <div className="flex items-center justify-center h-full  ">
            <Actions />
        </div>
    );
};

export default NewHomePAge;
