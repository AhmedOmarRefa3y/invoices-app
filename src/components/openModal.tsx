"use client";

import useInvoice from "@/lib/zustand/invoiceStore";
import useModals from "@/lib/zustand/useModals";

const OpenModal = () => {
    const Modals = useModals();
    Modals.setAddOrgModalIsOpen(true);
};

export default OpenModal;
