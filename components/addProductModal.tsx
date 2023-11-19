"use client";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useInvoice from "@/lib/zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    productName: z.string().min(2, {
        message: "Product Name must be at least 5 characters.",
    }),
    price: z.coerce.number().min(1),
});

export const AddNewProductModal = () => {
    const invoice = useInvoice();
    const {
        AddProdctModalIsOpen,
        SetAddProdctModalIsOpen,
        setproductToBeEdited,
        productToBeEdited,
    } = invoice;
    const router = useRouter();

    const mode = productToBeEdited ? "edit" : "create";
    const headerName = mode === "edit" ? "تعديل صنف" : "اضافة صنف";

    // ZOD Schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: productToBeEdited ? productToBeEdited.name : "",
            price: productToBeEdited ? productToBeEdited.price : 0,
        },
    });

    // set Product Name
    useEffect(() => {
        form.setValue(
            "productName",
            productToBeEdited ? productToBeEdited.name : ""
        );
        form.setValue("price", productToBeEdited ? productToBeEdited.price : 0);
    }, [productToBeEdited, form]);

    // Submit Handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        let ProductInfo = { ...values, productId: productToBeEdited?.id };

        console.log(ProductInfo);

        const res = await axios.post("api/addnewproduct", ProductInfo);
        if (res.status === 200) {
            if (!productToBeEdited) {
                toast.success("تم اضافة الصنف بنجاح");
            } else {
                toast.success("تم تعديل الصنف بنجاح");
            }
            router.refresh();
            SetAddProdctModalIsOpen(false);
        }
        return res;
    }

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(null);
    };

    return (
        <Dialog open={AddProdctModalIsOpen} onOpenChange={onOpenChangeHandler}>
            <DialogContent className="sm:max-w-md transition-all shadow-lg ">
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
                        <Button type="submit">
                            {productToBeEdited ? "حفظ التعديلات" : "حفظ الصنف"}
                        </Button>
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
