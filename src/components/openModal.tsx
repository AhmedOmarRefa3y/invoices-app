"use client";

import useInvoice from "@/lib/zustand/invoiceStore";

const OpenModal = () => {
    const invoice = useInvoice();
    invoice.setAddOrgModalIsOpen(true);
};

export default OpenModal;
