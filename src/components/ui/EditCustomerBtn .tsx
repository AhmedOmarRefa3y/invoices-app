"use client";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand/invoiceStore";

import React from "react";
import { Button } from "./button";
import useModals from "@/lib/zustand/useModals";

interface editCustomerBtnProps {
    customerInfo: {
        customerId: string;
        customerName: string;
        address: string;
        CreditType: string;
        OpenCredit: number;
        PhoneNumber: string;
    };
}

const EditICustomerBtn: React.FC<editCustomerBtnProps> = ({ customerInfo }) => {
    const ModalsStore = useModals();

    const {
        setcustomerToBeEdited,
        SetAddcustomerModalIsOpen,
        customerToBeEdited,
    } = ModalsStore;
    const editCustomer = () => {
        // console.log(customerInfo);

        setcustomerToBeEdited({
            customerId: customerInfo.customerId,
            customerName: customerInfo.customerName,
            address: customerInfo.address,
            CreditType: customerInfo.CreditType,
            OpenCredit: customerInfo.OpenCredit,
            PhoneNumber: customerInfo.PhoneNumber,
        });
        SetAddcustomerModalIsOpen(true);
        // console.log(customerToBeEdited);
    };

    return (
        <Button
            onClick={editCustomer}
            variant={"default"}
            className={cn("w-full")}
        >
            تعديل
        </Button>
    );
};

export default EditICustomerBtn;
