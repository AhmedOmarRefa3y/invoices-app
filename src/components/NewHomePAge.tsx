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
        <div className="flex mx-auto items-center justify-center h-full p-2 mb-2 ">
            <Actions />
        </div>
    );
};

export default NewHomePAge;
