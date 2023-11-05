"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";

const formSchema = z.object({
    customerName: z.string().min(2, {
        message: "Product Name must be at least 5 characters.",
    }),
});

export default function AddNewCustomer() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const res = await axios.post("api/addnewcustomer", values);
        console.log(res);
        return res;
    }
    return (
        <>
            <Popover>
                <PopoverTrigger className="bg-red-300 px-1 rounded-md mb-1 ">
                    اضافة عميل جديد
                </PopoverTrigger>
                <PopoverContent className="w-[400px] h-[200px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {" "}
                            <div className="flex h-[120px] justify-center gap-5 mb-3">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم العميل</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="قم بإدخال اسم العميل هنا"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
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
                                /> */}
                            </div>
                            <Button type="submit">إضافة</Button>
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </>
    );
}
