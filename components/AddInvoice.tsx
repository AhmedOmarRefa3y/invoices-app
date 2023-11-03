"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

import { Customer, Product } from "@prisma/client";
import ItemsContainer from "./Items";
import InvoiceHeader from "./InvoiceHeader";
import axios from "axios";
import AddProduct from "./addProduct";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

const Invoice: React.FC<InvoiceProps> = ({ customers, products }) => {
    const router = useRouter();
    const Invoice = useInvoice();

    const saveInvoiceToDB = async () => {
        // router.refresh();
        const data = Invoice;
        const res = await axios.post("/api/saveInvoice", data);
        if (res.status === 200) {
            Invoice.clearData();
            if (true) {
            }
        }
        console.log(res);
    };

    return (
        // form container
        <div className="flex flex-col mt-3 w-full p-3 bg-slate-400 h-full">
            {/* Invoice Haeder */}
            <InvoiceHeader customers={customers} />
            {/* Add A PRODUCT */}
            <AddProduct products={products}  />
            {/* Items Container */}
            <ItemsContainer />
            {/* <Button type="button" onClick={sendTodb}>
                Save Invoice
            </Button> */}
            <Button
                type="button"
                onClick={saveInvoiceToDB}
                className="w-fit mt-4 "
            >
                Save Invoice
            </Button>
        </div>
    );
};

export default Invoice;
