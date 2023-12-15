import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
    customerName: z.string().min(2, {
        message: "Customer Name must be at least 5 characters.",
    }),
    phoneNumber: z.number().min(11, {
        message: "phone Number must be at least 11 numbers.",
    }),
    location: z.string().min(5, {
        message: "location must be at least 5 characters.",
    }),
});

export function AddNewCustomerModal() {
    const [open, setopen] = useState(false);
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        const res = await axios.post("api/addnewcustomer", values);
        // console.log(res);
        setopen(false);
        router.refresh();
        form.reset;
        return res;
    }
    return (
        <Dialog open={open} onOpenChange={setopen}>
            <DialogTrigger asChild>
                <Button variant="outline">اضافة عميل</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>اضافة عميل جديد</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex items-end justify-center gap-2 w-full flex-wrap"
                    >
                        <div className="basis-[190px]">
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
                        </div>
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>العنوان</FormLabel>
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
                        </div>
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم التليفون</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="قم بإدخال اسم العميل هنا"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.valueAsNumber
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="basis-[190px]">
                            إضافة
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
