"use client";

import useInvoice from "@/lib/zustand/invoiceStore";
import { useEffect } from "react";

const SetupPage = () => {
    const isOpen = useInvoice((state) => state.addOrgMOdalIsOpen);
    const onOpen = useInvoice((state) => state.setAddOrgModalIsOpen);
    useEffect(() => {
        onOpen(true);
    }, [isOpen, onOpen]);

    return null;
};

export default SetupPage;
