import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Product } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { AddNewProductModal } from "../addProductModal";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface AddProductProps {
    products: Product[];
}
const AddProductToInvoice: React.FC<AddProductProps> = ({ products }) => {
    const invoice = useInvoice();
    const { productToBeEdited, setproductToBeEdited } = invoice;
    const [prdouctID, setprdouctID] = React.useState<string | null>();
    const [quantity, setquantity] = React.useState<number>(0);
    const [Price, setPrice] = React.useState<number>(0);
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const product = products.find((item) => item.id == prdouctID);

    // set Price
    React.useEffect(() => {
        const product = products.find((item) => item.id == prdouctID);
        const priceAsNumber = product ? Number(product.price) : 0; // Convert to a number or use 0 as a default value
        setPrice(priceAsNumber);
    }, [prdouctID]);

    const addProductHandler = () => {
        const product = products.find((item) => item.id === prdouctID);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 items-center mt-3 justify-items-center">
            <div className="w-full">
                <Popover open={IsPopoverOpen} onOpenChange={setPopoverOpen}>
                    <div>
                        <label htmlFor="">الصنف</label>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                size="sm"
                                role="combobox"
                                aria-expanded={IsPopoverOpen}
                                aria-label="اختر اسم الصنف"
                                className={cn("w-full justify-between")}
                            >
                                {product ? product.name : "اختر اسم الصنف"}
                                <ChevronsUpDown className="ml-r h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
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
                                            className=" flex justify-between "
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
                                                    }
                                                }}
                                                className="text-sm w-full"
                                            >
                                                {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
                                                {productInfo.name}
                                                <Check
                                                    className={cn(
                                                        "mr-auto h-4 w-4 ",
                                                        productInfo?.id ===
                                                            prdouctID
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                ></Check>
                                                {/* {productInfo?.price} */}
                                            </CommandItem>
                                            <Edit
                                                onClick={() => {
                                                    setproductToBeEdited({
                                                        id: productInfo.id,
                                                        name: productInfo.name,
                                                        price: productInfo.price,
                                                    });
                                                    invoice.SetAddProdctModalIsOpen(
                                                        !invoice.AddProdctModalIsOpen
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                            <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem className="flex justify-center">
                                        <AddNewProductModal
                                            data={productToBeEdited}
                                        />
                                        <PlusCircle className="mr-2  h-5 w-5" />
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <div className=" w-full">
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
                <label htmlFor="">الكمية</label>
                <Input
                    className="text-center text-lg"
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    onChange={(e) => {
                        setquantity(e.target.valueAsNumber);
                    }}
                />
            </div>
            <div className="flex flex-col align-baseline  w-full h-full">
                <label htmlFor="Totalprice">القيمة</label>
                <span className=" h-full bg-green-400 text-lg flex items-center justify-center rounded-md">
                    {quantity && Price ? quantity * Price : 0}
                </span>
            </div>

            <Button
                type="button"
                onClick={addProductHandler}
                className="h-full text-lg w-full"
            >
                اضافة الي الفاتورة
            </Button>
        </div>
    );
};

export default AddProductToInvoice;
