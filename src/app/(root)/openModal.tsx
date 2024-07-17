"use client";
import useModals from "@/lib/zustand/useModals";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OpenModal = () => {
    const isOpen = useModals((state) => state.addOrgMOdalIsOpen);
    const onOpen = useModals((state) => state.setAddOrgModalIsOpen);
    useEffect(() => {
        if (!isOpen) {
            onOpen(true);
        }
    }, [isOpen, onOpen]);
    return null;
};

export default OpenModal;
