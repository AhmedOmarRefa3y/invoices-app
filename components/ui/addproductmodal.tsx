import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand";

const formSchema = z.object({
    productName: z.string().min(2, {
        message: "Product Name must be at least 5 characters.",
    }),
    price: z.coerce.number().min(1),
});

interface AddNewProductModalProps {
    data: {
        id: string;
        name: string;
        price: number;
    } | null;
}

export const AddNewProductModal: React.FC<AddNewProductModalProps> = ({
    data,
}) => {
    const invoice = useInvoice();
    const { AddProdctModalIsOpen, SetAddProdctModalIsOpen } = invoice;
    const router = useRouter();

    const mode = data ? "edit" : "create";

    const headerName = mode === "edit" ? "تعديل صنف" : "اضافة صنف";
    // 1. Define your form.
    console.log(data);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: data ? data.name : "",
            price: data ? data.price : 0,
        },
    });

    useEffect(() => {
        form.setValue("productName", data ? data.name : "");
        form.setValue("price", data ? data.price : 0);
    }, [data]);

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const res = await axios.post("api/addnewproduct", values);
        console.log(res);
        SetAddProdctModalIsOpen;
        router.refresh();
        return res;
    }
    return (
        <Dialog
            open={AddProdctModalIsOpen}
            onOpenChange={SetAddProdctModalIsOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">اضافة صنف</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" >
                <DialogHeader className="flex items-center">
                    <DialogTitle>{headerName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {" "}
                        <div className="flex h-[120px] justify-center gap-5 mb-3">
                            <FormField
                                control={form.control}
                                name="productName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم الصنف</FormLabel>
                                        <FormControl>
                                            <Input
                                                defaultValue={data?.name}
                                                placeholder="قم بإدخال اسم الصنف هنا"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>السعر</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قم بإدخال سعر الصنف هنا"
                                                {...field}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">إضافة</Button>
                    </form>
                </Form>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
