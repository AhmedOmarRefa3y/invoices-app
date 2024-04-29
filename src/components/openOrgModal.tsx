"use client";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useEffect } from "react";

const OpenOrgModal = () => {
    const onOpen = useInvoice((state) => state.setAddOrgModalIsOpen);
    useEffect(() => {
        onOpen(true);
    }, [onOpen]);

    return null;
};

export default OpenOrgModal;
