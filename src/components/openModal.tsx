"use client";

import useInvoice from "@/lib/zustand/invoiceStore";

const OpenModal = () => {
    const invoice = useInvoice();
    // console.log(invoice);
    invoice.setAddOrgModalIsOpen(true);
    return null;
};

export default OpenModal;
