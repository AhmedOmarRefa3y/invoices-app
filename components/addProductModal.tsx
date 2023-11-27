"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Table } from "./ui/table";
import { Check, ChevronsUpDown, Edit } from "lucide-react";
import { Product } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const formSchema = z.object({
    productName: z.string().min(2, {
        message: "Product Name must be at least 5 characters.",
    }),
    price: z.coerce.number().min(1),
});

interface AddNewProductModalProps {
    products: Product[];
}

type Item = {
    name: string;
    quantity: number;
};
export const AddNewProductModal: React.FC<AddNewProductModalProps> = ({
    products,
}) => {
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const [prdouctID, setprdouctID] = useState<string | null>();
    const [quantity, setquantity] = useState<number>(0);
    const [parts, setParts] = useState<Item[]>([]);
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
        let ProductInfo = {
            ...values,
            productId: productToBeEdited?.id,
            parts,
        };

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
        setParts([]);
        form.setValue("productName", "");
        form.setValue("price", 0);
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
                        <div className="flex flex-col h-[400px] justify-start gap-5 mb-3">
                            <div className="felx ">
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
                            <div>
                                <Popover
                                    open={IsPopoverOpen}
                                    onOpenChange={setPopoverOpen}
                                >
                                    <div className="overflow-hidden ">
                                        <label
                                            htmlFor=""
                                            className={`flex flex-row `}
                                        >
                                            الصنف
                                        </label>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                size="sm"
                                                role="combobox"
                                                aria-expanded={IsPopoverOpen}
                                                aria-label="اختر اسم الصنف"
                                                className={cn(
                                                    `w-full justify-between h-[40px] `
                                                )}
                                            >
                                                "اختر اسم الصنف"
                                                <ChevronsUpDown className="ml-r  w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        {/* {productEroor ? <span>{productEroor}</span> : null} */}
                                    </div>
                                    <PopoverContent className="w-[310px] p-0">
                                        <Command>
                                            <CommandList>
                                                <CommandInput placeholder="ابحث بالاسم..." />
                                                <CommandEmpty>
                                                    للا يوجد صنف بهذا الاسم
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {products.map(
                                                        (productInfo) => (
                                                            <div
                                                                className=" flex justify-between items-center "
                                                                key={
                                                                    productInfo.id
                                                                }
                                                            >
                                                                <CommandItem
                                                                    key={
                                                                        productInfo.id
                                                                    }
                                                                    onSelect={() => {
                                                                        console.log(
                                                                            productInfo.name
                                                                        );

                                                                        setParts(
                                                                            [
                                                                                ...parts,
                                                                                {
                                                                                    name: productInfo.name,
                                                                                    quantity: 1,
                                                                                },
                                                                            ]
                                                                        );
                                                                    }}
                                                                    className="text-sm w-full text-center"
                                                                >
                                                                    {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
                                                                    <span className="w-full">
                                                                        {
                                                                            productInfo.name
                                                                        }
                                                                    </span>
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-auto w-4",
                                                                            productInfo?.id ===
                                                                                prdouctID
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    ></Check>
                                                                    {/* {productInfo?.price} */}
                                                                    <Edit
                                                                        onClick={() => {
                                                                            setproductToBeEdited(
                                                                                {
                                                                                    id: productInfo.id,
                                                                                    name: productInfo.name,
                                                                                    price: productInfo.price,
                                                                                }
                                                                            );
                                                                            invoice.SetAddProdctModalIsOpen(
                                                                                true
                                                                            );
                                                                        }}
                                                                    />
                                                                </CommandItem>
                                                            </div>
                                                        )
                                                    )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Table className="">
                                    <thead>
                                        <td>الاسم</td>
                                        <td>الكمية</td>
                                    </thead>
                                    <tbody>
                                        {parts?.map((item) => {
                                            return (
                                                <tr>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
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
