import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Product } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import toast, { ErrorIcon } from "react-hot-toast";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface AddProductProps {
    products: Product[];
}
const AddProductToInvoice: React.FC<AddProductProps> = ({ products }) => {
    const invoice = useInvoice();
    const { productToBeEdited, setproductToBeEdited, items } = invoice;
    const [prdouctID, setprdouctID] = React.useState<string | null>();
    const [quantity, setquantity] = React.useState<number>(0);
    const [Price, setPrice] = React.useState<number>(0);
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const product = products.find((item) => item.id == prdouctID);
    const [productEroor, setproductEroor] = useState<boolean | undefined>(
        undefined
    );
    const [quantityEroor, setquantityEroor] = useState<boolean | undefined>(
        undefined
    );
    // set Price
    React.useEffect(() => {
        const product = products.find((item) => item.id == prdouctID);
        const priceAsNumber = product ? Number(product.price) : 0; // Convert to a number or use 0 as a default value
        setPrice(priceAsNumber);
    }, [prdouctID, product, products]);

    const addProductHandler = () => {
        const product = products.find((item) => item.id === prdouctID);
        const IsProductAdded = items.find(
            (product) => product.id === prdouctID
        );
        if (IsProductAdded) {
            toast.error("تمت اضافة الصنف من قبل");
            return;
        }
        if (!product) {
            setproductEroor(true);
            return;
        }
        if (quantity < 1) {
            setquantityEroor(true);
            toast.error("الكمية يجب ان تكون اكبر من 1");
            return;
        }

        if (product) {
            invoice.addItem({
                id: product?.id,
                name: product?.name,
                price: product.price,
                quantity: quantity,
            });
            setquantity(0);
            setprdouctID("");
            setPrice(0);
        }
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 md:justify-items-start  gap-4 items-center mt-3 ">
            <div className="w-full sm:col-span-2 md:col-span-3">
                <Popover open={IsPopoverOpen} onOpenChange={setPopoverOpen}>
                    <div className="overflow-hidden ">
                        <label
                            htmlFor=""
                            className={`${
                                productEroor
                                    ? "text-red-600 font-extrabold"
                                    : null
                            } flex flex-row `}
                        >
                            الصنف
                            {productEroor ? (
                                <ErrorIcon className="mr-2" />
                            ) : null}
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
                                <span
                                    className={`${
                                        productEroor
                                            ? "text-red-600 font-extrabold"
                                            : null
                                    }`}
                                >
                                    {product ? product.name : "اختر اسم الصنف"}
                                </span>
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
                                    {products.map((productInfo) => (
                                        <div
                                            className=" flex justify-between items-center "
                                            key={productInfo.id}
                                        >
                                            <CommandItem
                                                key={productInfo.id}
                                                onSelect={() => {
                                                    if (
                                                        productInfo.id ===
                                                        prdouctID
                                                    ) {
                                                        setprdouctID(null);
                                                    } else {
                                                        setprdouctID(
                                                            productInfo.id
                                                        );
                                                        setproductEroor(
                                                            undefined
                                                        );
                                                    }
                                                }}
                                                className="text-sm w-full text-center"
                                            >
                                                {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
                                                <span className="w-full">
                                                    {productInfo.name}
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
                                                        setproductToBeEdited({
                                                            id: productInfo.id,
                                                            name: productInfo.name,
                                                            price: productInfo.price,
                                                        });
                                                        invoice.SetAddProdctModalIsOpen(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </CommandItem>
                                        </div>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        <div className="flex items-center justify-center">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    invoice.SetAddProdctModalIsOpen(true)
                                }
                            >
                                اضافة صنف
                            </Button>
                            <PlusCircle className="mr-2  h-5 w-5" />
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className=" w-full col-span-1">
                <label htmlFor="">سعر الصنف</label>
                <Input
                    className="text-center text-lg"
                    type="number"
                    value={Price}
                    disabled
                    onChange={(e) => {
                        setPrice(e.target.valueAsNumber);
                    }}
                    placeholder="Price"
                />
            </div>
            <div className=" w-full">
                <label
                    htmlFor=""
                    className={`${
                        quantityEroor ? "text-red-600 font-extrabold" : null
                    } flex flex-row `}
                >
                    الكمية
                    {quantityEroor ? <ErrorIcon className="mr-2" /> : null}
                </label>

                <Input
                    className="text-center text-lg"
                    type="number"
                    disabled={!prdouctID}
                    value={quantity}
                    placeholder="Quantity"
                    onChange={(e) => {
                        setquantity(e.target.valueAsNumber);
                        if (e.target.valueAsNumber > 0) {
                            setquantityEroor(undefined);
                        }
                    }}
                />
            </div>
            <div className="flex flex-col align-baseline  w-full ">
                <label htmlFor="Totalprice">القيمة</label>
                <span className=" h-[40px] bg-green-400 text-lg flex items-center justify-center rounded-md">
                    {quantity && Price ? quantity * Price : 0}
                </span>
            </div>

            <Button
                type="button"
                onClick={addProductHandler}
                // disabled={!prdouctID || quantity <= 0 ? true : false}
                className="h-[64px] text-lg grow "
            >
                اضافة الي الفاتورة
            </Button>
        </div>
    );
};

export default AddProductToInvoice;
