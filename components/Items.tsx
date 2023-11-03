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
    const { items, DelteItem } = useInvoice();
    const DeletItemHandler = (id: string) => {
        DelteItem(id);
    };
    useEffect(() => {
        setmounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col mt-10 bg-red-300 p-5 rounded-md w-full h-full">
            <Table>
                {items.length < 1 ? (
                    <TableCaption>You Didn't Add Any Products</TableCaption>
                ) : null}
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Product Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>quantity</TableHead>
                        <TableHead className="">Total Price</TableHead>
                        <TableHead className="">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const total = item.price * item.quantity;
                        return (
                            <TableRow key={item.id}>
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
                                <TableCell className="font-medium">
                                    <button
                                        className="h-full p-2 flex items-center justify-center bg-red-600 rounded-md text-white"
                                        onClick={() =>
                                            DeletItemHandler(item.id)
                                        }
                                    >
                                        Delete
                                    </button>
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
