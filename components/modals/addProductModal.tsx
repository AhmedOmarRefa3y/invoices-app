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

import {
    CreateProduct,
    NewProductDataT,
    UpdateProduct,
} from "@/actions/products";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Catgories, Product, Units } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Table } from "../ui/table";
import { TiDelete } from "react-icons/ti";

const formSchema = z.object({
    productName: z.string().min(2, {
        message: "Product Name must be at least 5 characters.",
    }),
    price: z.coerce.number().min(1),
});

interface AddNewProductModalProps {
    products: Product[];
    categories: Catgories[];
    units: Units[];
}

type Item = {
    name: string;
    quantity: number;
    productId: string;
};
export const AddNewProductModal: React.FC<AddNewProductModalProps> = ({
    products,
    categories,
    units,
}) => {
    const invoice = useInvoice();
    const {
        AddProdctModalIsOpen,
        SetAddProdctModalIsOpen,
        setproductToBeEdited,
        productToBeEdited,
    } = invoice;
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const [prdouctID, setprdouctID] = useState<string | null>();
    const [parts, setParts] = useState<Item[]>([]);
    const [unitID, setUnitID] = useState<string | null>(null);
    const [categoryID, setCategoryID] = useState<string | null>(null);

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
        setCategoryID(productToBeEdited?.catgoryId || null);
        setUnitID(productToBeEdited?.unitId || null);
        setParts(productToBeEdited?.parts || []);
    }, [productToBeEdited, form]);

    // Submit Handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        let ProductInfo: NewProductDataT = {
            ...values,
            name: values.productName,
            unitID: unitID || "",
            price: values.price,
            parts,
            categoryID: categoryID || "",
            PrdocutId: productToBeEdited?.id,
        };

        const res = productToBeEdited
            ? await UpdateProduct(ProductInfo)
            : await CreateProduct(ProductInfo);
        if (res.status === "ok") {
            toast.success(
                `تم ${productToBeEdited ? "تعديل" : "اضافة"} الصنف بنجاح`
            );
            SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
            setproductToBeEdited(null);
            setUnitID(null);
            setCategoryID(null);
            setParts([]);
            form.setValue("productName", "");
            form.setValue("price", 0);
        } else {
            // toast.error(
            //     `لم يتم ${productToBeEdited ? "تعديل" : "اضافة"} الصنف بنجاح`
            // );
            toast.error(res.message);
        }
        return res;
    }

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(null);
        setUnitID(null);
        setCategoryID(null);
        setParts([]);
        form.setValue("productName", "");
        form.setValue("price", 0);
    };

    console.log("newProductRenderd");

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
                                <div className="flex justify-between pt-1">
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
                                                        className="space-y-0 mt-0"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div>
                                        <label htmlFor="">الوحدة</label>
                                        <Popover>
                                            <div className="overflow-hidden ">
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        size="sm"
                                                        role="combobox"
                                                        aria-expanded={
                                                            IsPopoverOpen
                                                        }
                                                        className={cn(
                                                            `w-[100px] mt-[8px] justify-center gap-1 h-[40px] `
                                                        )}
                                                    >
                                                        {unitID
                                                            ? units.find(
                                                                  (unit) =>
                                                                      unit.id ===
                                                                      unitID
                                                              )?.name
                                                            : "الوحدة"}
                                                        <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                            </div>
                                            <PopoverContent className=" p-2 w-[100px]">
                                                <Command>
                                                    <CommandList>
                                                        <CommandGroup>
                                                            {units.map(
                                                                (unit) => (
                                                                    <div
                                                                        className=" flex justify-between items-center "
                                                                        key={
                                                                            unit.id
                                                                        }
                                                                    >
                                                                        <CommandItem
                                                                            key={
                                                                                unit.id
                                                                            }
                                                                            onSelect={() => {
                                                                                // console.log(
                                                                                //     unit.name
                                                                                // );
                                                                                setUnitID(
                                                                                    unit.id
                                                                                );
                                                                            }}
                                                                            className="text-sm w-full text-center"
                                                                        >
                                                                            <span className="w-full">
                                                                                {
                                                                                    unit.name
                                                                                }
                                                                            </span>
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-auto w-4",
                                                                                    unitID ===
                                                                                        unit.id
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
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
                                    </div>

                                    <div>
                                        <label htmlFor="">النوع</label>
                                        <Popover>
                                            <div className="overflow-hidden ">
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        size="sm"
                                                        role="combobox"
                                                        aria-expanded={
                                                            IsPopoverOpen
                                                        }
                                                        className={cn(
                                                            `w-[120px] mt-[8px] justify-center gap-1 h-[40px] `
                                                        )}
                                                    >
                                                        {categoryID
                                                            ? categories.find(
                                                                  (category) =>
                                                                      category.id ===
                                                                      categoryID
                                                              )?.name
                                                            : "النوع"}
                                                        <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                            </div>
                                            <PopoverContent className=" p-2 w-[160px]">
                                                <Command>
                                                    <CommandList>
                                                        <CommandInput
                                                            placeholder=""
                                                            className="pr-2"
                                                        />
                                                        <CommandEmpty>
                                                            للا يوجد صنف بهذاz
                                                            الاسم
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {categories.map(
                                                                (catrgory) => (
                                                                    <div
                                                                        key={
                                                                            catrgory.id
                                                                        }
                                                                        className=" flex justify-between items-center "
                                                                    >
                                                                        <CommandItem
                                                                            key={
                                                                                catrgory.id
                                                                            }
                                                                            onSelect={() => {
                                                                                // console.log(
                                                                                //     catrgory.name
                                                                                // );
                                                                                setCategoryID(
                                                                                    catrgory.id
                                                                                );
                                                                            }}
                                                                            className="text-sm w-full text-center"
                                                                        >
                                                                            <span className="w-full">
                                                                                {
                                                                                    catrgory.name
                                                                                }
                                                                            </span>
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-auto w-4",
                                                                                    catrgory.id ===
                                                                                        categoryID
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
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
                                    </div>
                                </div>
                            </div>
                            {categories.find(
                                (category) => category.id === categoryID
                            )?.name === "منتج تام مركب" && (
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
                                                    aria-expanded={
                                                        IsPopoverOpen
                                                    }
                                                    aria-label="اختر اسم الصنف"
                                                    className={cn(
                                                        `w-full justify-between h-[40px] `
                                                    )}
                                                >
                                                    اضافة جزء
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
                                                                            const IsProductExists =
                                                                                parts.find(
                                                                                    (
                                                                                        prod
                                                                                    ) =>
                                                                                        prod.name ===
                                                                                        productInfo.name
                                                                                );
                                                                            if (
                                                                                IsProductExists
                                                                            ) {
                                                                                return;
                                                                            }
                                                                            setParts(
                                                                                [
                                                                                    ...parts,
                                                                                    {
                                                                                        productId:
                                                                                            productInfo.id,
                                                                                        name: productInfo.name,
                                                                                        quantity: 1,
                                                                                    },
                                                                                ]
                                                                            );
                                                                        }}
                                                                        className="text-sm w-full text-center"
                                                                    >
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
                                                                    </CommandItem>
                                                                </div>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <Table className="border mt-1 rounded">
                                        <thead className="rounded">
                                            <td
                                                align="center"
                                                className="text-lg text-black border border-black w-[80%]"
                                            >
                                                الاسم
                                            </td>
                                            <td
                                                align="center"
                                                className="text-lg text-black border border-black w-[20%]"
                                            >
                                                الكمية
                                            </td>
                                        </thead>
                                        <tbody>
                                            {parts?.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td
                                                            align="center"
                                                            className="text-lg text-black font-semibold border border-black "
                                                        >
                                                            {item.name}
                                                        </td>
                                                        <td
                                                            align="center"
                                                            className="text-lg text-black font-semibold border border-black "
                                                        >
                                                            <Input
                                                                type="number"
                                                                defaultValue={
                                                                    item.quantity
                                                                }
                                                                className=" outline-none bg-transparent text-center p-0 whitespace-pre-wrap w-full  border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updatedParts =
                                                                        parts.map(
                                                                            (
                                                                                part
                                                                            ) => {
                                                                                if (
                                                                                    part.productId ===
                                                                                    item.productId
                                                                                ) {
                                                                                    return {
                                                                                        ...part,
                                                                                        quantity:
                                                                                            e
                                                                                                .target
                                                                                                .valueAsNumber,
                                                                                    };
                                                                                }
                                                                                return part;
                                                                            }
                                                                        );
                                                                    setParts(
                                                                        updatedParts
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                        <td
                                                            align="center"
                                                            className="text-lg text-red-700 font-semibold border border-black "
                                                            onClick={() => {
                                                                setParts(
                                                                    parts.filter(
                                                                        (
                                                                            prod
                                                                        ) =>
                                                                            prod.name !==
                                                                            item.name
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            <TiDelete fontSize={"30px"} />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="z-50 relative">
                            {productToBeEdited ? "حفظ التعديلات" : "حفظ الصنف"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
