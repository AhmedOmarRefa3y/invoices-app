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

interface InvoiceProps {
    customers: Customer[];
    products: Product[];
}

const Invoice: React.FC<InvoiceProps> = ({ customers, products }) => {
    const Invoice = useInvoice();
    const [prdouctID, setprdouctID] = React.useState<string>();
    const [quantity, setquantity] = React.useState<number>(0);
    const [Price, setPrice] = React.useState<number>(0);

    // set Price
    React.useEffect(() => {
        const product = products.find((item) => item.id == prdouctID);
        const priceAsNumber = product ? Number(product.price) : 0; // Convert to a number or use 0 as a default value
        setPrice(priceAsNumber);
    }, [prdouctID]);

    const saveInvoice = (event: any) => {
        event.preventDefault();
        if (prdouctID && quantity) {
            const product = products.find((item) => item.id == prdouctID);
            Invoice.addItem({
                id: prdouctID,
                name: product?.name,
                price: Price,
                quantity: quantity,
            });
            setquantity(0);
            setPrice(0);
            setprdouctID("");
        }
    };
    // console.log(Invoice.items);

    const sendTodb = async () => {
        // console.log(Invoice.invoice);
        await axios.post(`/api/saveInvoice`, Invoice.invoice);
    };
    return (
        // form container
        <div className="flex flex-col mt-3 w-full p-3 bg-slate-400 h-full">
            {/* Invoice Haeder */}
            <InvoiceHeader customers={customers} />
            {/* Add A PRODUCT */}
            <form action="" className="w-full">
                <div className="mt-3 flex flex-col items-center ">
                    <div className=" flex items-center gap-6  ">
                        <div>
                            <label htmlFor="">Product</label>
                            <Select
                                onValueChange={(value) => {
                                    setprdouctID(value);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Customer</SelectLabel>
                                        {products.map((item) => (
                                            <SelectItem
                                                value={item.id.toString()}
                                                key={item.name}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="">Quantity</label>
                            <Input
                                type="number"
                                value={quantity}
                                placeholder="Quantity"
                                onChange={(e) => {
                                    setquantity(e.target.valueAsNumber);
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="">price</label>
                            <Input
                                type="number"
                                value={Price}
                                onChange={(e) => {
                                    setPrice(e.target.valueAsNumber);
                                }}
                                placeholder="Price"
                            />
                        </div>
                        <div>
                            <label htmlFor="Totalprice">Totalprice</label>
                            <span className="flex items-center w-fit px-4 h-full rounded-md bg-red-300">
                                {quantity && Price ? quantity * Price : 0}
                            </span>
                        </div>
                    </div>
                </div>
                <Button type="button" onClick={saveInvoice}>
                    add
                </Button>
            </form>
            {/* Items Container */}
            <ItemsContainer />
            <Button type="button" onClick={sendTodb}>
                Save Invoice
            </Button>
        </div>
    );
};

export default Invoice;
