"use client";

import { Input } from "./ui/input";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { Customer, Product } from "@prisma/client";
import ItemsContainer from "./Items";
import InvoiceHeader from "./InvoiceHeader";
import useInvoice from "@/lib/zustand";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/Select";
import axios from "axios";
import AddProduct from "./addProduct";

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

const Invoice: React.FC<InvoiceProps> = ({ customers, products }) => {
    return (
        // form container
        <div className="flex flex-col mt-3 w-full p-3 bg-slate-400 h-full">
            {/* Invoice Haeder */}
            <InvoiceHeader customers={customers} />
            {/* Add A PRODUCT */}
            <AddProduct products={products} />
            {/* Items Container */}
            <ItemsContainer />
            {/* <Button type="button" onClick={sendTodb}>
                Save Invoice
            </Button> */}
            <Button type="button">Save Invoice</Button>
        </div>
    );
};

export default Invoice;
