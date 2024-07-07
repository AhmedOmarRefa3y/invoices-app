"use client";
import useInvoice from "@/lib/zustand/invoiceStore";
import useModals from "@/lib/zustand/useModals";
import { useEffect } from "react";

const OpenOrgModal = () => {
    const onOpen = useModals((state) => state.setAddOrgModalIsOpen);
    useEffect(() => {
        onOpen(true);
    }, [onOpen]);

    return null;
};

export default OpenOrgModal;
