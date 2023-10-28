"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useInvoice from "@/lib/zustand";
import { useEffect, useState } from "react";

const ItemsContainer = () => {
    const [mounted, setmounted] = useState(false);
    const Invoice = useInvoice();
    const allItems = Invoice.items;

    useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    console.log(allItems);

    return (
        <div className="flex flex-col mt-10 bg-red-300 p-5 rounded-md w-full h-full">
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            Product Name
                        </TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>quantity</TableHead>
                        <TableHead className="text-right">
                            Total Price
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allItems.map((item) => {
                        const total = item.price * item.quantity;
                        return (
                            <TableRow key={Math.random() * 100}>
                                <TableCell className="font-medium">
                                    {item.name}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.price}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {total}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemsContainer;
