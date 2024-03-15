"use client";
import useInvoice from "@/lib/zustand";
import { useEffect } from "react";

const SetupPage = () => {
    const isOpen = useInvoice((state) => state.addOrgMOdalIsOpen);
    const onOpen = useInvoice((state) => state.setAddOrgModalIsOpen);
    useEffect(() => {
        if (!isOpen) {
            onOpen(!isOpen);
        }
    }, [isOpen, onOpen]);

    return null;
};

export default SetupPage;
